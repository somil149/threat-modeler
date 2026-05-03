// ========================================
// Threat Intelligence Component
// Integrates with NVD API for CVE data
// ========================================

function ThreatIntelligence({ project }) {
  const [cveData, setCveData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSeverity, setSelectedSeverity] = React.useState('all');

  // Fetch CVEs based on project components
  const fetchThreatIntel = async () => {
    setLoading(true);
    try {
      const keywords = extractKeywords(project);
      const cves = await fetchCVEsFromNVD(keywords);
      setCveData(cves);
    } catch (error) {
      console.error('Failed to fetch threat intelligence:', error);
    }
    setLoading(false);
  };

  // Extract keywords from project components
  const extractKeywords = (project) => {
    const keywords = new Set();
    project.components.forEach(comp => {
      const type = comp.type.toLowerCase();
      if (type.includes('api')) keywords.add('api');
      if (type.includes('database') || type.includes('sql')) keywords.add('database');
      if (type.includes('web')) keywords.add('web server');
      if (type.includes('container') || type.includes('docker')) keywords.add('container');
      if (type.includes('kubernetes')) keywords.add('kubernetes');
      if (type.includes('lambda')) keywords.add('serverless');
      if (type.includes('llm') || type.includes('ai')) keywords.add('artificial intelligence');
    });
    return Array.from(keywords);
  };

  // Fetch CVEs from NVD API
  const fetchCVEsFromNVD = async (keywords) => {
    const results = [];
    
    for (const keyword of keywords.slice(0, 3)) { // Limit to 3 keywords to avoid rate limiting
      try {
        const response = await fetch(
          `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(keyword)}&resultsPerPage=10`
        );
        
        if (!response.ok) continue;
        
        const data = await response.json();
        
        if (data.vulnerabilities) {
          data.vulnerabilities.forEach(vuln => {
            const cve = vuln.cve;
            const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV2?.[0];
            
            results.push({
              id: cve.id,
              description: cve.descriptions?.[0]?.value || 'No description',
              severity: metrics?.cvssData?.baseSeverity || 'UNKNOWN',
              score: metrics?.cvssData?.baseScore || 0,
              published: cve.published,
              keyword: keyword
            });
          });
        }
      } catch (error) {
        console.error(`Failed to fetch CVEs for ${keyword}:`, error);
      }
    }
    
    return results.sort((a, b) => b.score - a.score);
  };

  // Filter CVEs
  const filteredCVEs = cveData.filter(cve => {
    const matchesSearch = cve.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cve.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || cve.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#dc2626';
      case 'HIGH': return '#ea580c';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="threat-intelligence">
      <div className="panel-header">
        <h2>
          <i className="fas fa-shield-virus" style={{ color: 'var(--accent)', marginRight: '0.5rem' }}></i>
          Threat Intelligence
        </h2>
        <button className="btn btn-primary" onClick={fetchThreatIntel} disabled={loading}>
          <i className={`fas fa-${loading ? 'spinner fa-spin' : 'sync'}`}></i>
          {loading ? 'Fetching...' : 'Fetch Latest CVEs'}
        </button>
      </div>

      {cveData.length > 0 && (
        <div className="filters" style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search CVEs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, marginRight: '0.5rem' }}
          />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      )}

      {cveData.length === 0 && !loading && (
        <div className="empty-state">
          <i className="fas fa-shield-virus" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
          <p>Click "Fetch Latest CVEs" to get real-time vulnerability data from NVD</p>
        </div>
      )}

      {loading && (
        <div className="empty-state">
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}></i>
          <p>Fetching threat intelligence from NVD...</p>
        </div>
      )}

      <div className="cve-list">
        {filteredCVEs.map(cve => (
          <div key={cve.id} className="cve-card" style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                  <a href={`https://nvd.nist.gov/vuln/detail/${cve.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                    {cve.id}
                  </a>
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <i className="fas fa-tag"></i> {cve.keyword}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  background: getSeverityColor(cve.severity) + '20',
                  color: getSeverityColor(cve.severity)
                }}>
                  {cve.severity}
                </span>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  background: 'var(--accent-bg)',
                  color: 'var(--accent)'
                }}>
                  {cve.score.toFixed(1)}
                </span>
              </div>
            </div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {cve.description.length > 200 ? cve.description.substring(0, 200) + '...' : cve.description}
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-calendar"></i> Published: {new Date(cve.published).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredCVEs.length === 0 && cveData.length > 0 && (
        <div className="empty-state">
          <p>No CVEs match your filters</p>
        </div>
      )}
    </div>
  );
}
