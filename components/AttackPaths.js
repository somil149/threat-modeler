// ========================================
// Attack Paths Component
// ========================================

function AttackPaths({ project }) {
  const [attackChains, setAttackChains] = useState([]);

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

                  <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.375rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Exploitable Threats:
                    </div>
                    <ul style={{ fontSize: '0.875rem', paddingLeft: '1.5rem', margin: 0 }}>
                      {chain.threats.map((threat, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{threat}</li>
                      ))}
                    </ul>
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
