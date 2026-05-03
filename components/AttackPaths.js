// ========================================
// Attack Paths Component
// ========================================

function AttackPaths({ project }) {
  const [attackChains, setAttackChains] = useState([]);
  const [expandedMitigations, setExpandedMitigations] = useState({});

  const toggleMitigations = (index) => {
    setExpandedMitigations(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    console.log('AttackPaths - Project data:', {
      hasComponents: !!project.components,
      componentCount: project.components?.length || 0,
      hasFlows: !!project.flows,
      flowCount: project.flows?.length || 0,
      hasThreats: !!project.threats,
      threatCount: project.threats?.length || 0,
      components: project.components?.map(c => ({ id: c.id, name: c.name, type: c.type })),
      threats: project.threats?.map(t => ({ id: t.id, component: t.component }))
    });
    
    if (project.components && project.flows && project.threats) {
      try {
        const chains = Graph.generateAttackChains(
          project.components,
          project.flows,
          project.threats
        );
        console.log('Attack chains generated:', chains);
        setAttackChains(chains);
      } catch (error) {
        console.error('Error generating attack chains:', error);
        setAttackChains([]);
      }
    } else {
      console.log('Missing data for attack paths:', {
        components: !!project.components,
        flows: !!project.flows,
        threats: !!project.threats
      });
    }
  }, [project]);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Attack Path Analysis
      </h2>

      {attackChains.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <i className="fas fa-route" style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}></i>
          <p style={{ color: 'var(--text-secondary)' }}>
            No attack paths identified. Generate threats first.
          </p>
        </div>
      ) : (
        <>
          <div className="card mb-2">
            <h3 className="card-title">Summary</h3>
            <div className="grid grid-3">
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Paths</div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{attackChains.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>High Risk Paths</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>
                  {attackChains.filter(c => c.riskScore >= 15).length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Avg Path Length</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
                  {(attackChains.reduce((sum, c) => sum + c.path.length, 0) / attackChains.length).toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {attackChains.map((chain, index) => {
              const riskLevel = Scoring.getRiskLevel(chain.riskScore);
              const riskColor = Scoring.getRiskColor(riskLevel);

              return (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                      Attack Path #{index + 1}
                    </h3>
                    <span className={`badge badge-${riskLevel.toLowerCase()}`}>
                      Risk: {chain.riskScore}
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Attack Chain:
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {chain.path.map((node, i) => (
                        <React.Fragment key={i}>
                          <span style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}>
                            {node}
                          </span>
                          {i < chain.path.length - 1 && (
                            <i className="fas fa-arrow-right" style={{ color: 'var(--text-secondary)' }}></i>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Exploitable Threats:
                    </div>
                    <ul style={{ fontSize: '0.875rem', paddingLeft: '1.5rem', margin: 0 }}>
                      {chain.threats.map((threat, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{threat}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Mitigation Section */}
                  <div>
                    <button
                      onClick={() => toggleMitigations(index)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--accent-bg)',
                        border: '1px solid var(--accent)',
                        borderRadius: '0.375rem',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <i className={`fas fa-shield-alt`}></i>
                      {expandedMitigations[index] ? 'Hide Mitigations' : 'View Mitigations'}
                      <i className={`fas fa-chevron-${expandedMitigations[index] ? 'up' : 'down'}`}></i>
                    </button>

                    {expandedMitigations[index] && (
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        background: 'var(--bg-tertiary)', 
                        borderRadius: '0.375rem',
                        border: '2px solid var(--accent)'
                      }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                          <i className="fas fa-shield-alt"></i> Recommended Mitigations (Priority Order)
                        </div>

                        {/* Get unique mitigations from threats in this path */}
                        {(() => {
                          // Match threats by component name OR component ID
                          const pathThreats = project.threats?.filter(t => {
                            const componentName = t.componentName || t.component;
                            const componentId = t.component;
                            return chain.path.includes(componentName) || chain.path.includes(componentId);
                          }) || [];

                          // Group mitigations by priority
                          const criticalMitigations = [];
                          const highMitigations = [];
                          const mediumMitigations = [];

                          pathThreats.forEach((threat, idx) => {
                            const priority = threat.likelihood * threat.impact >= 15 ? 'critical' :
                                           threat.likelihood * threat.impact >= 9 ? 'high' : 'medium';
                            
                            const mitigation = {
                              threat: threat.title,
                              mitigation: threat.mitigation,
                              detection: threat.detection,
                              component: threat.componentName || threat.component,
                              priority: priority
                            };

                            if (priority === 'critical') criticalMitigations.push(mitigation);
                            else if (priority === 'high') highMitigations.push(mitigation);
                            else mediumMitigations.push(mitigation);
                          });

                          const allMitigations = [...criticalMitigations, ...highMitigations, ...mediumMitigations];

                          return allMitigations.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {allMitigations.map((m, idx) => (
                                <div key={idx} style={{ 
                                  padding: '0.75rem', 
                                  background: 'var(--bg-secondary)', 
                                  borderRadius: '0.375rem',
                                  borderLeft: `4px solid ${
                                    m.priority === 'critical' ? '#dc2626' :
                                    m.priority === 'high' ? '#ea580c' : '#f59e0b'
                                  }`
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      textTransform: 'uppercase',
                                      background: m.priority === 'critical' ? '#dc262620' :
                                                 m.priority === 'high' ? '#ea580c20' : '#f59e0b20',
                                      color: m.priority === 'critical' ? '#dc2626' :
                                             m.priority === 'high' ? '#ea580c' : '#f59e0b'
                                    }}>
                                      {m.priority}
                                    </span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                      {m.component}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <strong>Threat:</strong> {m.threat}
                                  </div>
                                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    <strong style={{ color: 'var(--accent)' }}>
                                      <i className="fas fa-shield-alt"></i> Mitigation:
                                    </strong> {m.mitigation}
                                  </div>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <strong>
                                      <i className="fas fa-search"></i> Detection:
                                    </strong> {m.detection}
                                  </div>
                                </div>
                              ))}

                              {/* Impact Analysis */}
                              <div style={{ 
                                marginTop: '0.5rem', 
                                padding: '0.75rem', 
                                background: 'var(--success-bg)', 
                                borderRadius: '0.375rem',
                                border: '1px solid var(--success)'
                              }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)', marginBottom: '0.25rem' }}>
                                  <i className="fas fa-lightbulb"></i> Impact Analysis
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                  Implementing {criticalMitigations.length > 0 ? 'critical' : 'high'} priority mitigations 
                                  will break this attack chain and reduce risk by approximately{' '}
                                  <strong style={{ color: 'var(--success)' }}>
                                    {Math.min(80, criticalMitigations.length * 30 + highMitigations.length * 20)}%
                                  </strong>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                              No specific mitigations available. Generate threats first.
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
