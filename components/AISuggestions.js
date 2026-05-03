// ========================================
// AI-Powered Suggestions Component
// Uses rule-based AI for threat suggestions
// ========================================

function AISuggestions({ project, onApplySuggestion }) {
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Generate AI suggestions based on project analysis
  const generateSuggestions = () => {
    setLoading(true);
    
    setTimeout(() => {
      const newSuggestions = [];
      
      // Analyze architecture patterns
      const components = project.components || [];
      const threats = project.threats || [];
      const flows = project.flows || [];
      
      console.log('Analyzing project:', { 
        componentCount: components.length, 
        threatCount: threats.length, 
        flowCount: flows.length,
        componentTypes: components.map(c => c.type)
      });
      
      // Missing security components (flexible matching)
      const hasFirewall = components.some(c => 
        c.type?.toLowerCase().includes('firewall') || 
        c.name?.toLowerCase().includes('firewall')
      );
      const hasWAF = components.some(c => 
        c.type?.toLowerCase().includes('waf') || 
        c.name?.toLowerCase().includes('waf')
      );
      const hasAuth = components.some(c => 
        c.type?.toLowerCase().includes('auth') || 
        c.type?.toLowerCase().includes('identity') ||
        c.name?.toLowerCase().includes('auth') ||
        c.name?.toLowerCase().includes('idp')
      );
      const hasLogging = components.some(c => 
        c.type?.toLowerCase().includes('log') || 
        c.type?.toLowerCase().includes('monitoring') ||
        c.name?.toLowerCase().includes('log')
      );
      const hasAPI = components.some(c => 
        c.type?.toLowerCase().includes('api') || 
        c.type?.toLowerCase().includes('gateway') ||
        c.name?.toLowerCase().includes('api')
      );
      const hasDatabase = components.some(c => 
        c.type?.toLowerCase().includes('database') || 
        c.type?.toLowerCase().includes('db') ||
        c.type?.toLowerCase().includes('sql') ||
        c.type?.toLowerCase().includes('nosql') ||
        c.type?.toLowerCase().includes('dynamodb') ||
        c.name?.toLowerCase().includes('database')
      );
      const hasExternal = components.some(c =>
        c.type?.toLowerCase().includes('user') ||
        c.type?.toLowerCase().includes('external') ||
        c.type?.toLowerCase().includes('browser') ||
        c.trustBoundary === 'external'
      );
      const hasEncryption = components.some(c =>
        c.type?.toLowerCase().includes('vault') ||
        c.type?.toLowerCase().includes('secrets') ||
        c.type?.toLowerCase().includes('hsm')
      );
      const hasCache = components.some(c =>
        c.type?.toLowerCase().includes('cache') ||
        c.type?.toLowerCase().includes('redis')
      );
      
      // Template-specific suggestions
      const templateId = project.template;
      
      // Payment/Financial systems
      if (templateId?.includes('payment') || templateId?.includes('financial') || templateId?.includes('ecommerce')) {
        if (!hasEncryption) {
          newSuggestions.push({
            id: 'add_vault',
            category: 'architecture',
            priority: 'critical',
            title: 'Add Secrets/Token Vault',
            description: 'Financial systems require secure storage for sensitive data like payment tokens and credentials.',
            impact: 'PCI-DSS compliance and secure credential management',
            action: 'Add Component'
          });
        }
        
        newSuggestions.push({
          id: 'pci_compliance',
          category: 'compliance',
          priority: 'critical',
          title: 'Ensure PCI-DSS Compliance',
          description: 'Payment systems must comply with PCI-DSS requirements. Review all 12 requirements.',
          impact: 'Legal compliance and customer trust',
          action: 'Review'
        });
      }
      
      // IoT systems
      if (templateId?.includes('iot') || components.some(c => c.name?.toLowerCase().includes('device'))) {
        newSuggestions.push({
          id: 'device_auth',
          category: 'architecture',
          priority: 'high',
          title: 'Implement Device Authentication',
          description: 'IoT devices should use certificate-based authentication or device tokens.',
          impact: 'Prevents unauthorized device access',
          action: 'Review'
        });
        
        if (!hasEncryption) {
          newSuggestions.push({
            id: 'device_encryption',
            category: 'dataflow',
            priority: 'high',
            title: 'Enable End-to-End Encryption',
            description: 'IoT telemetry data should be encrypted in transit and at rest.',
            impact: 'Protects sensitive device data',
            action: 'Review'
          });
        }
      }
      
      // AI/ML systems
      if (templateId?.includes('llm') || templateId?.includes('rag') || templateId?.includes('agent') || templateId?.includes('ml')) {
        newSuggestions.push({
          id: 'prompt_injection',
          category: 'threats',
          priority: 'high',
          title: 'Add Prompt Injection Protections',
          description: 'LLM systems are vulnerable to prompt injection attacks. Implement input validation and output filtering.',
          impact: 'Prevents malicious prompt manipulation',
          action: 'Add Mitigation'
        });
        
        newSuggestions.push({
          id: 'data_privacy',
          category: 'compliance',
          priority: 'high',
          title: 'Review Data Privacy for AI',
          description: 'Ensure training data and user inputs comply with GDPR/privacy regulations.',
          impact: 'Legal compliance and user privacy',
          action: 'Review'
        });
      }
      
      // Serverless systems
      if (templateId?.includes('serverless') || components.some(c => c.type?.toLowerCase().includes('lambda'))) {
        newSuggestions.push({
          id: 'lambda_timeout',
          category: 'architecture',
          priority: 'medium',
          title: 'Configure Function Timeouts',
          description: 'Set appropriate timeout values for Lambda functions to prevent resource exhaustion.',
          impact: 'Prevents DoS and cost overruns',
          action: 'Review'
        });
      }
      
      // General security components
      if (hasAPI && !hasWAF && !hasFirewall) {
        newSuggestions.push({
          id: 'add_waf',
          category: 'architecture',
          priority: 'high',
          title: 'Add Web Application Firewall (WAF)',
          description: 'Your API lacks WAF protection. Add a WAF to protect against OWASP Top 10 attacks.',
          impact: 'Prevents SQL injection, XSS, and other common web attacks',
          action: 'Add Component'
        });
      }
      
      if (!hasAuth && (hasAPI || hasDatabase) && hasExternal) {
        newSuggestions.push({
          id: 'add_auth',
          category: 'architecture',
          priority: 'critical',
          title: 'Add Authentication Service',
          description: 'No authentication component detected. External users can access APIs/databases directly.',
          impact: 'Prevents unauthorized access',
          action: 'Add Component'
        });
      }
      
      if (!hasLogging && components.length > 3) {
        newSuggestions.push({
          id: 'add_logging',
          category: 'architecture',
          priority: 'medium',
          title: 'Add Centralized Logging',
          description: 'No logging component found. Add centralized logging for security monitoring.',
          impact: 'Enables threat detection and forensic analysis',
          action: 'Add Component'
        });
      }
      
      if (hasDatabase && !hasCache && components.length > 5) {
        newSuggestions.push({
          id: 'add_cache',
          category: 'architecture',
          priority: 'low',
          title: 'Consider Adding Cache Layer',
          description: 'A cache layer can improve performance and reduce database load.',
          impact: 'Better performance and scalability',
          action: 'Consider'
        });
      }
      
      // Threat coverage analysis
      const strideCategories = ['S', 'T', 'R', 'I', 'D', 'E'];
      const coveredCategories = new Set(threats.flatMap(t => t.stride?.split('') || []));
      
      strideCategories.forEach(category => {
        if (!coveredCategories.has(category)) {
          const categoryNames = {
            'S': 'Spoofing',
            'T': 'Tampering',
            'R': 'Repudiation',
            'I': 'Information Disclosure',
            'D': 'Denial of Service',
            'E': 'Elevation of Privilege'
          };
          
          newSuggestions.push({
            id: `threat_${category}`,
            category: 'threats',
            priority: 'medium',
            title: `Missing ${categoryNames[category]} Threats`,
            description: `No ${categoryNames[category]} threats identified. Review your architecture for potential ${categoryNames[category].toLowerCase()} vulnerabilities.`,
            impact: 'Comprehensive threat coverage',
            action: 'Review'
          });
        }
      });
      
      // Data flow security
      flows.forEach(flow => {
        const fromComp = components.find(c => c.id === flow.from);
        const toComp = components.find(c => c.id === flow.to);
        
        if (fromComp && toComp) {
          const isExternal = fromComp.type.toLowerCase().includes('external') || 
                           fromComp.type.toLowerCase().includes('user') ||
                           fromComp.type.toLowerCase().includes('browser');
          const isDatabase = toComp.type.toLowerCase().includes('database');
          const isAPI = toComp.type.toLowerCase().includes('api');
          
          if (isExternal && (isDatabase || isAPI)) {
            const protocol = flow.protocol?.toLowerCase() || '';
            if (!protocol.includes('https') && !protocol.includes('tls')) {
              newSuggestions.push({
                id: `flow_${flow.from}_${flow.to}`,
                category: 'dataflow',
                priority: 'high',
                title: `Unencrypted Flow: ${fromComp.name} → ${toComp.name}`,
                description: 'External-facing data flow lacks encryption. Use HTTPS/TLS.',
                impact: 'Prevents man-in-the-middle attacks and data interception',
                action: 'Update Flow',
                flow: { ...flow, protocol: 'HTTPS' }
              });
            }
          }
        }
      });
      
      // Mitigation suggestions
      threats.forEach(threat => {
        if (!threat.mitigation || threat.mitigation.length < 20) {
          newSuggestions.push({
            id: `mitigation_${threat.id}`,
            category: 'mitigation',
            priority: threat.likelihood * threat.impact >= 12 ? 'high' : 'medium',
            title: `Incomplete Mitigation: ${threat.title}`,
            description: 'This threat lacks detailed mitigation strategy.',
            impact: 'Reduces risk through proper controls',
            action: 'Add Mitigation',
            threat: threat
          });
        }
      });
      
      setSuggestions(newSuggestions);
      setLoading(false);
    }, 1000);
  };

  // Filter suggestions
  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="ai-suggestions">
      <div className="panel-header">
        <h2>
          <i className="fas fa-magic" style={{ color: 'var(--accent)', marginRight: '0.5rem' }}></i>
          AI-Powered Suggestions
        </h2>
        <button className="btn btn-primary" onClick={generateSuggestions} disabled={loading}>
          <i className={`fas fa-${loading ? 'spinner fa-spin' : 'lightbulb'}`}></i>
          {loading ? 'Analyzing...' : 'Generate Suggestions'}
        </button>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        <i className="fas fa-robot"></i> AI analyzes your architecture and suggests security improvements
      </p>

      {suggestions.length > 0 && (
        <div className="filters" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({suggestions.length})
          </button>
          <button 
            className={`btn ${selectedCategory === 'architecture' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('architecture')}
          >
            Architecture ({suggestions.filter(s => s.category === 'architecture').length})
          </button>
          <button 
            className={`btn ${selectedCategory === 'threats' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('threats')}
          >
            Threats ({suggestions.filter(s => s.category === 'threats').length})
          </button>
          <button 
            className={`btn ${selectedCategory === 'dataflow' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('dataflow')}
          >
            Data Flow ({suggestions.filter(s => s.category === 'dataflow').length})
          </button>
          <button 
            className={`btn ${selectedCategory === 'mitigation' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('mitigation')}
          >
            Mitigation ({suggestions.filter(s => s.category === 'mitigation').length})
          </button>
        </div>
      )}

      {suggestions.length === 0 && !loading && (
        <div className="empty-state">
          <i className="fas fa-magic" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
          <p>Click "Generate Suggestions" to get AI-powered security recommendations</p>
        </div>
      )}

      <div className="suggestions-list">
        {filteredSuggestions.map(suggestion => (
          <div key={suggestion.id} className="suggestion-card" style={{ 
            marginBottom: '1rem', 
            padding: '1rem', 
            background: 'var(--bg-secondary)', 
            borderRadius: '8px',
            borderLeft: `4px solid ${getPriorityColor(suggestion.priority)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {suggestion.title}
                </h3>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px',
                  background: getPriorityColor(suggestion.priority) + '20',
                  color: getPriorityColor(suggestion.priority),
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {suggestion.priority}
                </span>
              </div>
              {onApplySuggestion && (
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => onApplySuggestion(suggestion)}
                  style={{ marginLeft: '1rem' }}
                >
                  <i className="fas fa-check"></i> Apply
                </button>
              )}
            </div>
            <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {suggestion.description}
            </p>
            <div style={{ 
              marginTop: '0.5rem', 
              padding: '0.5rem', 
              background: 'var(--accent-bg)', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              <strong>Impact:</strong> {suggestion.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
