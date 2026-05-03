// ========================================
// Threat Intelligence Component
// Integrates with NVD API for CVE data
// ========================================

function ThreatIntelligence({ project }) {
  const [cveData, setCveData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSeverity, setSelectedSeverity] = React.useState('all');

  // Fetch CVEs based on project threats
  const fetchThreatIntel = async () => {
    if (!project.threats || project.threats.length === 0) {
      alert('No threats found in this project. Please generate threats first.');
      return;
    }

    setLoading(true);
    setProgress('Analyzing project threats...');
    
    try {
      const keywords = extractKeywordsFromThreats(project);
      setProgress(`Found ${keywords.length} threat categories. Fetching relevant CVEs...`);
      const cves = await fetchCVEsFromNVD(keywords);
      setCveData(cves);
      setProgress('');
    } catch (error) {
      console.error('Failed to fetch threat intelligence:', error);
      setProgress('Error fetching CVEs');
    }
    setLoading(false);
  };

  // Extract keywords from project threats (STRIDE categories + components)
  const extractKeywordsFromThreats = (project) => {
    const keywords = new Set();
    
    // Analyze threats
    project.threats.forEach(threat => {
      const desc = threat.description.toLowerCase();
      const title = threat.title.toLowerCase();
      const component = threat.component?.toLowerCase() || '';
      
      // STRIDE-based keywords
      if (threat.stride?.includes('S') || title.includes('spoof') || desc.includes('authentication')) {
        keywords.add('authentication bypass');
      }
      if (threat.stride?.includes('T') || title.includes('tamper') || desc.includes('integrity')) {
        keywords.add('data tampering');
      }
      if (threat.stride?.includes('R') || title.includes('repudiation')) {
        keywords.add('audit logging');
      }
      if (threat.stride?.includes('I') || title.includes('information') || desc.includes('disclosure')) {
        keywords.add('information disclosure');
      }
      if (threat.stride?.includes('D') || title.includes('denial') || desc.includes('availability')) {
        keywords.add('denial of service');
      }
      if (threat.stride?.includes('E') || title.includes('elevation') || desc.includes('privilege')) {
        keywords.add('privilege escalation');
      }
      
      // Component-specific keywords
      if (component.includes('api') || desc.includes('api')) keywords.add('api security');
      if (component.includes('database') || desc.includes('sql')) keywords.add('sql injection');
      if (component.includes('web') || desc.includes('xss')) keywords.add('cross site scripting');
      if (component.includes('auth') || desc.includes('oauth')) keywords.add('oauth');
      if (component.includes('container') || desc.includes('docker')) keywords.add('container escape');
      if (component.includes('kubernetes')) keywords.add('kubernetes');
      if (component.includes('llm') || desc.includes('prompt')) keywords.add('prompt injection');
      if (desc.includes('csrf')) keywords.add('csrf');
      if (desc.includes('injection')) keywords.add('code injection');
      if (desc.includes('deserialization')) keywords.add('deserialization');
    });
    
    // If no specific keywords found, use general ones
    if (keywords.size === 0) {
      keywords.add('web application security');
      keywords.add('api security');
    }
    
    return Array.from(keywords);
  };

  // Fetch CVEs from NVD API
  const fetchCVEsFromNVD = async (keywords) => {
    const results = [];
    const seenCVEs = new Set();
    
    // Limit to top 3 most relevant keywords
    const topKeywords = keywords.slice(0, 3);
    
    for (let i = 0; i < topKeywords.length; i++) {
      const keyword = topKeywords[i];
      setProgress(`Fetching CVEs for "${keyword}" (${i + 1}/${topKeywords.length})...`);
      
      try {
        const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(keyword)}&resultsPerPage=30`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.warn(`NVD API error for "${keyword}": ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        
        if (data.vulnerabilities) {
          data.vulnerabilities.forEach(vuln => {
            const cve = vuln.cve;
            
            // Skip duplicates
            if (seenCVEs.has(cve.id)) return;
            seenCVEs.add(cve.id);
            
            const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV2?.[0];
            const publishedDate = new Date(cve.published);
            
            // Only include CVEs from last 5 years
            const fiveYearsAgo = new Date();
            fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
            
            if (publishedDate < fiveYearsAgo) return;
            
            results.push({
              id: cve.id,
              description: cve.descriptions?.[0]?.value || 'No description',
              severity: metrics?.cvssData?.baseSeverity || 'MEDIUM',
              score: metrics?.cvssData?.baseScore || 5.0,
              published: cve.published,
              publishedDate: publishedDate,
              keyword: keyword,
              matchedThreat: keyword
            });
          });
        }
        
        // Add delay to avoid rate limiting
        if (i < topKeywords.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 6000));
        }
        
      } catch (error) {
        console.error(`Failed to fetch CVEs for ${keyword}:`, error);
      }
    }
    
    // Sort by severity score (highest first), then by date
    return results.sort((a, b) => {
      const scoreDiff = b.score - a.score;
      return scoreDiff !== 0 ? scoreDiff : b.publishedDate - a.publishedDate;
    });
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

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        <i className="fas fa-info-circle"></i> Fetches CVEs matching your project's identified threats (STRIDE categories)
      </p>

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
          <p>Click "Fetch Latest CVEs" to get vulnerabilities matching your project threats</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Make sure you've generated threats first (Architecture → Generate Threats)
          </p>
        </div>
      )}

      {loading && (
        <div className="empty-state">
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}></i>
          <p>{progress || 'Fetching threat intelligence from NVD...'}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            This may take 30-60 seconds due to API rate limits
          </p>
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
                  <i className="fas fa-bullseye"></i> Matches: {cve.matchedThreat}
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
