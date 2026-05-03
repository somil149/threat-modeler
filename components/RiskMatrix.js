// ========================================
// Risk Matrix Component
// ========================================

function RiskMatrix({ project }) {
  const canvasRef = React.useRef(null);
  const threats = project.threats || [];
  const matrix = Scoring.generateRiskMatrix(threats);
  const riskSummary = Scoring.calculateProjectRisk(threats);

  useEffect(() => {
    if (!canvasRef.current || threats.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          label: 'Threats by Risk Level',
          data: [riskSummary.critical, riskSummary.high, riskSummary.medium, riskSummary.low],
          backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }, [threats]);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Risk Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-3 mb-2">
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Total Threats
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{riskSummary.total}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Average Risk Score
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>
            {riskSummary.avgScore}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            High Priority
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ef4444' }}>
            {riskSummary.critical + riskSummary.high}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="card-title">Risk Distribution</h3>
        <div style={{ height: '300px' }}>
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="card mt-2">
        <h3 className="card-title">Risk Matrix (Likelihood × Impact)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.5rem', border: '1px solid var(--border)' }}>Impact →<br/>Likelihood ↓</th>
                {[1, 2, 3, 4, 5].map(i => (
                  <th key={i} style={{ padding: '0.5rem', border: '1px solid var(--border)' }}>{i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[5, 4, 3, 2, 1].map(l => (
                <tr key={l}>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--border)', fontWeight: 600 }}>{l}</td>
                  {[1, 2, 3, 4, 5].map(i => {
                    const count = matrix[i - 1][l - 1];
                    const risk = l * i;
                    const level = Scoring.getRiskLevel(risk);
                    const color = Scoring.getRiskColor(level);
                    
                    return (
                      <td
                        key={i}
                        style={{
                          padding: '1rem',
                          border: '1px solid var(--border)',
                          background: `${color}20`,
                          textAlign: 'center',
                          fontWeight: 600,
                          color: color
                        }}
                      >
                        {count > 0 ? count : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
