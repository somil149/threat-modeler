// ========================================
// Threat List Component
// ========================================

function ThreatList({ project, onUpdate }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [editingThreat, setEditingThreat] = useState(null);
  const [threatStatus, setThreatStatus] = useState({});
  const [threatComments, setThreatComments] = useState({});
  const threats = project.threats || [];

  // Enhanced filtering with search and severity
  const filteredThreats = threats.filter(t => {
    // STRIDE filter
    const strideMatch = filter === 'all' || t.stride === filter;
    
    // Search filter
    const searchMatch = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mitigation.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Severity filter
    let severityMatch = true;
    if (severityFilter !== 'all') {
      const risk = Scoring.calculateRisk(t.likelihood, t.impact);
      const level = Scoring.getRiskLevel(risk);
      severityMatch = level.toLowerCase() === severityFilter;
    }
    
    return strideMatch && searchMatch && severityMatch;
  });

  const riskSummary = Scoring.calculateProjectRisk(threats);

  const handleDeleteThreat = (id) => {
    const updated = threats.filter(t => t.id !== id);
    onUpdate({ threats: updated });
  };

  const handleStatusChange = (threatId, status) => {
    setThreatStatus({ ...threatStatus, [threatId]: status });
  };

  const handleCommentChange = (threatId, comment) => {
    setThreatComments({ ...threatComments, [threatId]: comment });
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Identified Threats
      </h2>

      {/* Summary */}
      <div className="grid grid-4 mb-2">
        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{riskSummary.total}</div>
        </div>
        <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
          <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>Critical</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>{riskSummary.critical}</div>
        </div>
        <div className="card" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>High</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{riskSummary.high}</div>
        </div>
        <div className="card" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Medium</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>{riskSummary.medium}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-2">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              className="input"
              placeholder="Search threats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Severity:</span>
            <select 
              className="select" 
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{ minWidth: '120px' }}
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing {filteredThreats.length} of {threats.length} threats
          </div>
        </div>
      </div>

      {/* STRIDE Filter */}
      <div className="flex gap-1 mb-2" style={{ flexWrap: 'wrap' }}>
        {['all', 'S', 'T', 'R', 'I', 'D', 'E'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
            title={f === 'all' ? 'All' : 
                   f === 'S' ? 'Spoofing' :
                   f === 'T' ? 'Tampering' :
                   f === 'R' ? 'Repudiation' :
                   f === 'I' ? 'Information Disclosure' :
                   f === 'D' ? 'Denial of Service' :
                   'Elevation of Privilege'}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Threats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredThreats.map(threat => {
          const risk = Scoring.calculateRisk(threat.likelihood, threat.impact);
          const level = Scoring.getRiskLevel(risk);
          
          return (
            <div key={threat.id} className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{threat.title}</h3>
                <div className="flex gap-1">
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => setEditingThreat(editingThreat === threat.id ? null : threat.id)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="btn-secondary btn-sm" onClick={() => handleDeleteThreat(threat.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="flex gap-1 mb-1">
                <span className={`badge badge-${level.toLowerCase()}`}>{level}</span>
                <span className="badge badge-medium">{threat.stride}</span>
                <span className="badge badge-low">Risk: {risk}</span>
              </div>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{threat.description}</p>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.375rem', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Mitigation:</div>
                <div style={{ fontSize: '0.875rem' }}>{threat.mitigation}</div>
              </div>
              {threat.detection && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.375rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Detection:</div>
                  <div style={{ fontSize: '0.875rem' }}>{threat.detection}</div>
                </div>
              )}

              {/* Status & Comments */}
              {editingThreat === threat.id && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.375rem', marginTop: '1rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                      Status:
                    </label>
                    <div className="flex gap-2">
                      <button
                        className={`btn btn-sm ${threatStatus[threat.id] === 'open' ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => handleStatusChange(threat.id, 'open')}
                      >
                        <i className="fas fa-exclamation-circle"></i>
                        Open
                      </button>
                      <button
                        className={`btn btn-sm ${threatStatus[threat.id] === 'mitigated' ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => handleStatusChange(threat.id, 'mitigated')}
                      >
                        <i className="fas fa-check-circle"></i>
                        Mitigated
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                      Comments:
                    </label>
                    <textarea
                      className="input"
                      rows="3"
                      placeholder="Add notes about mitigation status, actions taken, etc..."
                      value={threatComments[threat.id] || ''}
                      onChange={(e) => handleCommentChange(threat.id, e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  {(threatStatus[threat.id] || threatComments[threat.id]) && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <i className="fas fa-info-circle"></i> Status and comments are saved automatically
                    </div>
                  )}
                </div>
              )}

              {/* Show status badge if set */}
              {threatStatus[threat.id] && editingThreat !== threat.id && (
                <div style={{ marginTop: '1rem' }}>
                  <span className={`badge ${threatStatus[threat.id] === 'mitigated' ? 'badge-low' : 'badge-high'}`}>
                    <i className={`fas fa-${threatStatus[threat.id] === 'mitigated' ? 'check' : 'exclamation'}-circle`}></i>
                    {threatStatus[threat.id] === 'mitigated' ? 'Mitigated' : 'Open'}
                  </span>
                  {threatComments[threat.id] && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      <i className="fas fa-comment"></i> {threatComments[threat.id]}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
