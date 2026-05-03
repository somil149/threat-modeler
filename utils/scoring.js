// ========================================
// Scoring Utility - Risk Calculation Engine
// ========================================

const Scoring = {
  // Calculate risk score: Likelihood (1-5) × Impact (1-5)
  calculateRisk(likelihood, impact) {
    return likelihood * impact;
  },

  // Get risk level from score
  getRiskLevel(score) {
    if (score >= 20) return 'CRITICAL';
    if (score >= 12) return 'HIGH';
    if (score >= 6) return 'MEDIUM';
    return 'LOW';
  },

  // Get risk color
  getRiskColor(level) {
    const colors = {
      CRITICAL: '#ef4444',
      HIGH: '#f59e0b',
      MEDIUM: '#3b82f6',
      LOW: '#10b981'
    };
    return colors[level] || colors.LOW;
  },

  // Calculate project risk summary
  calculateProjectRisk(threats) {
    const summary = {
      total: threats.length,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      avgScore: 0
    };

    let totalScore = 0;

    threats.forEach(threat => {
      const score = this.calculateRisk(threat.likelihood, threat.impact);
      const level = this.getRiskLevel(score);
      
      summary[level.toLowerCase()]++;
      totalScore += score;
    });

    summary.avgScore = threats.length > 0 ? (totalScore / threats.length).toFixed(1) : 0;

    return summary;
  },

  // Generate risk matrix data
  generateRiskMatrix(threats) {
    const matrix = Array(5).fill(null).map(() => Array(5).fill(0));

    threats.forEach(threat => {
      const l = threat.likelihood - 1; // 0-indexed
      const i = threat.impact - 1;
      if (l >= 0 && l < 5 && i >= 0 && i < 5) {
        matrix[i][l]++;
      }
    });

    return matrix;
  },

  // Calculate STRIDE distribution
  calculateStrideDistribution(threats) {
    const stride = {
      Spoofing: 0,
      Tampering: 0,
      Repudiation: 0,
      'Information Disclosure': 0,
      'Denial of Service': 0,
      'Elevation of Privilege': 0
    };

    threats.forEach(threat => {
      if (threat.stride && stride.hasOwnProperty(threat.stride)) {
        stride[threat.stride]++;
      }
    });

    return stride;
  },

  // Calculate component risk scores
  calculateComponentRisks(components, threats) {
    const componentRisks = {};

    components.forEach(comp => {
      const compThreats = threats.filter(t => t.component === comp.id);
      const scores = compThreats.map(t => this.calculateRisk(t.likelihood, t.impact));
      const avgScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;
      
      componentRisks[comp.id] = {
        name: comp.name,
        threatCount: compThreats.length,
        avgScore: avgScore.toFixed(1),
        level: this.getRiskLevel(Math.round(avgScore))
      };
    });

    return componentRisks;
  }
};
