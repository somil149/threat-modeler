// ========================================
// Compliance Component
// ========================================

function Compliance({ project }) {
  const [complianceData, setComplianceData] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState('NIST_CSF');

  useEffect(() => {
    fetch('data/compliance.json')
      .then(res => res.json())
      .then(data => setComplianceData(data))
      .catch(err => console.error('Failed to load compliance data:', err));
  }, []);

  if (!complianceData) {
    return <div>Loading compliance data...</div>;
  }

  const threats = project.threats || [];
  const framework = complianceData.frameworks[selectedFramework];
  
  // Calculate compliance coverage
  const strideCategories = ['Spoofing', 'Tampering', 'Repudiation', 'Information Disclosure', 'Denial of Service', 'Elevation of Privilege'];
  const coverage = {};
  
  strideCategories.forEach(category => {
    const categoryThreats = threats.filter(t => t.stride === category);
    const controls = framework.mappings[category] || [];
    coverage[category] = {
      threats: categoryThreats.length,
      controls: controls,
      addressed: categoryThreats.length > 0
    };
  });

  const totalAddressed = Object.values(coverage).filter(c => c.addressed).length;
  const coveragePercent = ((totalAddressed / strideCategories.length) * 100).toFixed(0);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Compliance Mapping
      </h2>

      {/* Framework Selector */}
      <div className="card mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title">Select Framework</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Map threats to compliance controls
            </p>
          </div>
          <select
            className="select"
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            style={{ width: 'auto' }}
          >
            {Object.keys(complianceData.frameworks).map(key => (
              <option key={key} value={key}>
                {complianceData.frameworks[key].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Coverage Summary */}
      <div className="card mb-2">
        <h3 className="card-title">Coverage Summary</h3>
        <div className="grid grid-3">
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Framework</div>
            <div style={{ fontWeight: 600 }}>{framework.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Coverage</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
              {coveragePercent}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Categories Addressed</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {totalAddressed}/{strideCategories.length}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Mapping Table */}
      <div className="card">
        <h3 className="card-title">Control Mappings</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', border: '1px solid var(--border)', textAlign: 'left' }}>
                  STRIDE Category
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid var(--border)', textAlign: 'left' }}>
                  Threats
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid var(--border)', textAlign: 'left' }}>
                  Controls
                </th>
                <th style={{ padding: '0.75rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {strideCategories.map(category => {
                const data = coverage[category];
                return (
                  <tr key={category}>
                    <td style={{ padding: '0.75rem', border: '1px solid var(--border)', fontWeight: 600 }}>
                      {category}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid var(--border)' }}>
                      {data.threats} threat{data.threats !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid var(--border)' }}>
                      {data.controls.join(', ')}
                    </td>
                    <td style={{ padding: '0.75rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                      {data.addressed ? (
                        <span className="badge badge-low">
                          <i className="fas fa-check"></i> Addressed
                        </span>
                      ) : (
                        <span className="badge badge-medium">
                          <i className="fas fa-minus"></i> Not Addressed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
