// ========================================
// Threat Intelligence Component
// Integrates with NVD API for CVE data
// ========================================

function ThreatIntelligence({ project }) {
  const [cveData, setCveData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Clear cache when project changes
  React.useEffect(() => {
    setCveData([]);
  }, [project.id]);

  // Fetch CVEs based on project threats
  const fetchThreatIntel = async () => {
    if (!project.threats || project.threats.length === 0) {
      alert('No threats found in this project. Please generate threats first.');
      return;
    }

    setLoading(true);
    setCveData([]); // Clear previous results
    setProgress('Analyzing project threats...');
    
    try {
      const keywords = extractKeywordsFromThreats(project);
      
      if (keywords.length === 0) {
        setProgress('No relevant keywords found in threats');
        setLoading(false);
        return;
      }
      
      setProgress(`Found ${keywords.length} threat categories: ${keywords.map(k => k.keyword).join(', ')}`);
      const cves = await fetchCVEsFromNVD(keywords);
      
      if (cves.length === 0) {
        setProgress('No CRITICAL/HIGH CVEs found for these threats');
      }
      
      setCveData(cves);
      setProgress('');
    } catch (error) {
      console.error('Failed to fetch threat intelligence:', error);
      setProgress('Error fetching CVEs: ' + error.message);
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
      const riskScore = (threat.likelihood || 3) * (threat.impact || 3);
      
      // Specific vulnerability keywords (avoid generic terms)
      if (desc.includes('sql') || desc.includes('injection') && desc.includes('database')) {
        keywordMap['sql injection'] = (keywordMap['sql injection'] || 0) + riskScore;
      }
      if (desc.includes('xss') || desc.includes('cross-site scripting') || desc.includes('script injection')) {
        keywordMap['cross site scripting'] = (keywordMap['cross site scripting'] || 0) + riskScore;
      }
      if (desc.includes('csrf') || desc.includes('cross-site request forgery')) {
        keywordMap['csrf'] = (keywordMap['csrf'] || 0) + riskScore;
      }
      if (desc.includes('authentication') && (desc.includes('bypass') || desc.includes('broken'))) {
        keywordMap['authentication bypass'] = (keywordMap['authentication bypass'] || 0) + riskScore;
      }
      if (desc.includes('oauth') || desc.includes('token')) {
        keywordMap['oauth vulnerability'] = (keywordMap['oauth vulnerability'] || 0) + riskScore;
      }
      if (desc.includes('session') && (desc.includes('hijack') || desc.includes('fixation'))) {
        keywordMap['session hijacking'] = (keywordMap['session hijacking'] || 0) + riskScore;
      }
      if (desc.includes('deserialization') || desc.includes('pickle') || desc.includes('yaml')) {
        keywordMap['insecure deserialization'] = (keywordMap['insecure deserialization'] || 0) + riskScore;
      }
      if (desc.includes('xxe') || desc.includes('xml external entity')) {
        keywordMap['xxe'] = (keywordMap['xxe'] || 0) + riskScore;
      }
      if (desc.includes('ssrf') || desc.includes('server-side request forgery')) {
        keywordMap['ssrf'] = (keywordMap['ssrf'] || 0) + riskScore;
      }
      if (desc.includes('rce') || desc.includes('remote code execution') || desc.includes('command injection')) {
        keywordMap['remote code execution'] = (keywordMap['remote code execution'] || 0) + riskScore;
      }
      if (desc.includes('path traversal') || desc.includes('directory traversal') || desc.includes('../')) {
        keywordMap['path traversal'] = (keywordMap['path traversal'] || 0) + riskScore;
      }
      if (desc.includes('file upload') || desc.includes('unrestricted upload')) {
        keywordMap['unrestricted file upload'] = (keywordMap['unrestricted file upload'] || 0) + riskScore;
      }
      if (desc.includes('privilege') && desc.includes('escalation')) {
        keywordMap['privilege escalation'] = (keywordMap['privilege escalation'] || 0) + riskScore;
      }
      if (desc.includes('api') && (desc.includes('broken') || desc.includes('insecure'))) {
        keywordMap['broken api'] = (keywordMap['broken api'] || 0) + riskScore;
      }
      if (desc.includes('jwt') || desc.includes('json web token')) {
        keywordMap['jwt vulnerability'] = (keywordMap['jwt vulnerability'] || 0) + riskScore;
      }
      if (desc.includes('ldap') && desc.includes('injection')) {
        keywordMap['ldap injection'] = (keywordMap['ldap injection'] || 0) + riskScore;
      }
      if (desc.includes('nosql') && desc.includes('injection')) {
        keywordMap['nosql injection'] = (keywordMap['nosql injection'] || 0) + riskScore;
      }
      
      // Component-specific
      if (component.includes('container') || component.includes('docker')) {
        keywordMap['container escape'] = (keywordMap['container escape'] || 0) + riskScore;
      }
      if (component.includes('kubernetes') || component.includes('k8s')) {
        keywordMap['kubernetes privilege escalation'] = (keywordMap['kubernetes privilege escalation'] || 0) + riskScore;
      }
      if (component.includes('llm') || desc.includes('prompt injection')) {
        keywordMap['prompt injection'] = (keywordMap['prompt injection'] || 0) + riskScore;
      }
      if (component.includes('redis') || component.includes('memcached')) {
        keywordMap['cache poisoning'] = (keywordMap['cache poisoning'] || 0) + riskScore;
      }
    });
    
    // Sort by relevance score and return top keywords
    const sortedKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .map(([keyword, score]) => ({ keyword, score }));
    
    console.log('Extracted keywords from threats:', sortedKeywords);
    
    // If no specific keywords found, analyze components
    if (sortedKeywords.length === 0) {
      console.log('No specific vulnerability keywords found, analyzing components...');
      
      const hasWeb = project.components.some(c => c.type.toLowerCase().includes('web'));
      const hasAPI = project.components.some(c => c.type.toLowerCase().includes('api'));
      const hasDB = project.components.some(c => c.type.toLowerCase().includes('database'));
      
      if (hasWeb) sortedKeywords.push({ keyword: 'cross site scripting', score: 8 });
      if (hasAPI) sortedKeywords.push({ keyword: 'broken api', score: 8 });
      if (hasDB) sortedKeywords.push({ keyword: 'sql injection', score: 9 });
      
      if (sortedKeywords.length === 0) {
        return [
          { keyword: 'remote code execution', score: 10 },
          { keyword: 'authentication bypass', score: 9 }
        ];
      }
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
        
        console.log(`NVD API returned ${data.vulnerabilities?.length || 0} CVEs for "${keyword}"`);
        
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
    
    console.log(`Total CVEs found: ${results.length} (after filtering for CRITICAL/HIGH from last 5 years)`);
    
    // Sort by relevance score (highest first)
    const sorted = results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 30); // Top 30 most relevant
    
    console.log(`Returning top ${sorted.length} most relevant CVEs`);
    
    return sorted;
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
