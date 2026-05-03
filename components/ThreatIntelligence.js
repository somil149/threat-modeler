// ========================================
// Threat Intelligence Component
// Integrates with NVD API for CVE data
// ========================================

function ThreatIntelligence({ project }) {
  const [cveData, setCveData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');

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
    const keywordMap = {}; // keyword -> relevance score
    
    // Analyze threats
    project.threats.forEach(threat => {
      const desc = threat.description.toLowerCase();
      const title = threat.title.toLowerCase();
      const component = threat.component?.toLowerCase() || '';
      const riskScore = (threat.likelihood || 3) * (threat.impact || 3); // Higher risk = more relevant
      
      // STRIDE-based keywords with risk weighting
      if (threat.stride?.includes('S') || title.includes('spoof') || desc.includes('authentication')) {
        keywordMap['authentication bypass'] = (keywordMap['authentication bypass'] || 0) + riskScore;
        if (desc.includes('oauth') || component.includes('oauth')) {
          keywordMap['oauth vulnerability'] = (keywordMap['oauth vulnerability'] || 0) + riskScore;
        }
      }
      if (threat.stride?.includes('T') || title.includes('tamper') || desc.includes('integrity')) {
        if (desc.includes('sql') || component.includes('database')) {
          keywordMap['sql injection'] = (keywordMap['sql injection'] || 0) + riskScore;
        }
        if (desc.includes('code') || desc.includes('script')) {
          keywordMap['code injection'] = (keywordMap['code injection'] || 0) + riskScore;
        }
      }
      if (threat.stride?.includes('I') || title.includes('information') || desc.includes('disclosure')) {
        keywordMap['information disclosure'] = (keywordMap['information disclosure'] || 0) + riskScore;
        if (desc.includes('path traversal') || desc.includes('directory')) {
          keywordMap['path traversal'] = (keywordMap['path traversal'] || 0) + riskScore;
        }
      }
      if (threat.stride?.includes('D') || title.includes('denial') || desc.includes('availability')) {
        keywordMap['denial of service'] = (keywordMap['denial of service'] || 0) + riskScore;
      }
      if (threat.stride?.includes('E') || title.includes('elevation') || desc.includes('privilege')) {
        keywordMap['privilege escalation'] = (keywordMap['privilege escalation'] || 0) + riskScore;
      }
      
      // Specific vulnerability types
      if (desc.includes('xss') || desc.includes('cross-site scripting')) {
        keywordMap['cross site scripting'] = (keywordMap['cross site scripting'] || 0) + riskScore;
      }
      if (desc.includes('csrf') || desc.includes('cross-site request')) {
        keywordMap['csrf'] = (keywordMap['csrf'] || 0) + riskScore;
      }
      if (desc.includes('deserialization')) {
        keywordMap['deserialization'] = (keywordMap['deserialization'] || 0) + riskScore;
      }
      if (desc.includes('xxe') || desc.includes('xml external')) {
        keywordMap['xxe'] = (keywordMap['xxe'] || 0) + riskScore;
      }
      if (desc.includes('ssrf') || desc.includes('server-side request')) {
        keywordMap['ssrf'] = (keywordMap['ssrf'] || 0) + riskScore;
      }
      if (desc.includes('rce') || desc.includes('remote code execution')) {
        keywordMap['remote code execution'] = (keywordMap['remote code execution'] || 0) + riskScore;
      }
      
      // Component-specific
      if (component.includes('api') || desc.includes('api')) {
        keywordMap['api security'] = (keywordMap['api security'] || 0) + riskScore;
      }
      if (component.includes('container') || desc.includes('docker')) {
        keywordMap['container escape'] = (keywordMap['container escape'] || 0) + riskScore;
      }
      if (component.includes('kubernetes')) {
        keywordMap['kubernetes'] = (keywordMap['kubernetes'] || 0) + riskScore;
      }
      if (component.includes('llm') || desc.includes('prompt')) {
        keywordMap['prompt injection'] = (keywordMap['prompt injection'] || 0) + riskScore;
      }
    });
    
    // Sort by relevance score and return top keywords
    const sortedKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .map(([keyword, score]) => ({ keyword, score }));
    
    // If no specific keywords found, use general high-risk ones
    if (sortedKeywords.length === 0) {
      return [
        { keyword: 'remote code execution', score: 10 },
        { keyword: 'sql injection', score: 9 },
        { keyword: 'authentication bypass', score: 8 }
      ];
    }
    
    return sortedKeywords.slice(0, 5); // Top 5 most relevant
  };

  // Fetch CVEs from NVD API
  const fetchCVEsFromNVD = async (keywordObjects) => {
    const results = [];
    const seenCVEs = new Set();
    
    for (let i = 0; i < keywordObjects.length; i++) {
      const { keyword, score: relevanceScore } = keywordObjects[i];
      setProgress(`Fetching CVEs for "${keyword}" (${i + 1}/${keywordObjects.length})...`);
      
      try {
        const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(keyword)}&resultsPerPage=20`;
        
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
            
            const severity = metrics?.cvssData?.baseSeverity || 'MEDIUM';
            const cvssScore = metrics?.cvssData?.baseScore || 5.0;
            
            // Only show CRITICAL and HIGH severity CVEs
            if (severity !== 'CRITICAL' && severity !== 'HIGH') return;
            
            // Calculate relevance score: CVSS score * threat relevance * recency factor
            const monthsOld = (Date.now() - publishedDate) / (1000 * 60 * 60 * 24 * 30);
            const recencyFactor = Math.max(0.5, 1 - (monthsOld / 60)); // Newer = more relevant
            const finalRelevance = cvssScore * (relevanceScore / 10) * recencyFactor;
            
            results.push({
              id: cve.id,
              description: cve.descriptions?.[0]?.value || 'No description',
              severity: severity,
              score: cvssScore,
              published: cve.published,
              publishedDate: publishedDate,
              keyword: keyword,
              matchedThreat: keyword,
              relevanceScore: finalRelevance
            });
          });
        }
        
        // Add delay to avoid rate limiting
        if (i < keywordObjects.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 6000));
        }
        
      } catch (error) {
        console.error(`Failed to fetch CVEs for ${keyword}:`, error);
      }
    }
    
    // Sort by relevance score (highest first)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 30); // Top 30 most relevant
  };

  // Filter CVEs
  const filteredCVEs = cveData.filter(cve => {
    const matchesSearch = cve.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cve.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cve.matchedThreat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
        <i className="fas fa-brain"></i> Intelligent matching: Shows top 30 <strong>CRITICAL/HIGH</strong> CVEs ranked by relevance to your threats
      </p>

      {cveData.length > 0 && (
        <div className="filters" style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search CVEs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
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
                  CVSS: {cve.score.toFixed(1)}
                </span>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  background: '#10b98120',
                  color: '#10b981'
                }} title="Relevance to your threats">
                  <i className="fas fa-bullseye"></i> {cve.relevanceScore.toFixed(1)}
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
