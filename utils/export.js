// ========================================
// Export Utility - PDF, CSV, JSON, Markdown
// ========================================

const ExportUtil = {
  // Export as PDF
  exportPDF(project) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let y = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;

    // Helper to add new page if needed
    const checkPage = () => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    // Title
    doc.setFontSize(20);
    doc.text('Threat Model Report', 20, y);
    y += 15;

    // Project info
    doc.setFontSize(12);
    doc.text(`Project: ${project.name}`, 20, y);
    y += lineHeight;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y);
    y += lineHeight * 2;

    // Executive Summary
    doc.setFontSize(16);
    doc.text('Executive Summary', 20, y);
    y += lineHeight;
    doc.setFontSize(10);

    const riskSummary = Scoring.calculateProjectRisk(project.threats || []);
    doc.text(`Total Threats: ${riskSummary.total}`, 20, y);
    y += lineHeight;
    doc.text(`Critical: ${riskSummary.critical} | High: ${riskSummary.high} | Medium: ${riskSummary.medium} | Low: ${riskSummary.low}`, 20, y);
    y += lineHeight * 2;

    checkPage();

    // Components
    doc.setFontSize(16);
    doc.text('Architecture Components', 20, y);
    y += lineHeight;
    doc.setFontSize(10);

    (project.components || []).forEach(comp => {
      checkPage();
      doc.text(`• ${comp.name} (${comp.type})`, 25, y);
      y += lineHeight;
    });

    y += lineHeight;
    checkPage();

    // Threats
    doc.setFontSize(16);
    doc.text('Identified Threats', 20, y);
    y += lineHeight;
    doc.setFontSize(10);

    (project.threats || []).forEach((threat, index) => {
      checkPage();
      const risk = Scoring.calculateRisk(threat.likelihood, threat.impact);
      const level = Scoring.getRiskLevel(risk);
      
      doc.text(`${index + 1}. ${threat.title}`, 20, y);
      y += lineHeight;
      doc.text(`   STRIDE: ${threat.stride} | Risk: ${level} (${risk})`, 25, y);
      y += lineHeight;
      doc.text(`   Mitigation: ${threat.mitigation.substring(0, 80)}...`, 25, y);
      y += lineHeight * 1.5;
    });

    // Save
    doc.save(`${project.name.replace(/\s+/g, '_')}_threat_model.pdf`);
  },

  // Export as CSV
  exportCSV(project) {
    const threats = project.threats || [];
    
    const headers = ['ID', 'Title', 'STRIDE', 'Component', 'Likelihood', 'Impact', 'Risk Score', 'Risk Level', 'Mitigation', 'Detection'];
    
    const rows = threats.map((threat, index) => {
      const risk = Scoring.calculateRisk(threat.likelihood, threat.impact);
      const level = Scoring.getRiskLevel(risk);
      
      return [
        index + 1,
        threat.title,
        threat.stride,
        threat.component,
        threat.likelihood,
        threat.impact,
        risk,
        level,
        threat.mitigation,
        threat.detection || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_threats.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Export as JSON
  exportJSON(project) {
    Storage.exportProject(project);
  },

  // Export as Markdown
  exportMarkdown(project) {
    const riskSummary = Scoring.calculateProjectRisk(project.threats || []);
    
    let md = `# Threat Model: ${project.name}\n\n`;
    md += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
    md += `---\n\n`;
    
    // Executive Summary
    md += `## Executive Summary\n\n`;
    md += `- **Total Threats:** ${riskSummary.total}\n`;
    md += `- **Critical:** ${riskSummary.critical}\n`;
    md += `- **High:** ${riskSummary.high}\n`;
    md += `- **Medium:** ${riskSummary.medium}\n`;
    md += `- **Low:** ${riskSummary.low}\n`;
    md += `- **Average Risk Score:** ${riskSummary.avgScore}\n\n`;
    
    // Components
    md += `## Architecture Components\n\n`;
    (project.components || []).forEach(comp => {
      md += `- **${comp.name}** (${comp.type})\n`;
    });
    md += `\n`;
    
    // Threats
    md += `## Identified Threats\n\n`;
    (project.threats || []).forEach((threat, index) => {
      const risk = Scoring.calculateRisk(threat.likelihood, threat.impact);
      const level = Scoring.getRiskLevel(risk);
      
      md += `### ${index + 1}. ${threat.title}\n\n`;
      md += `- **STRIDE Category:** ${threat.stride}\n`;
      md += `- **Affected Component:** ${threat.component}\n`;
      md += `- **Risk Level:** ${level} (Score: ${risk})\n`;
      md += `- **Likelihood:** ${threat.likelihood}/5\n`;
      md += `- **Impact:** ${threat.impact}/5\n\n`;
      md += `**Description:** ${threat.description}\n\n`;
      md += `**Mitigation:** ${threat.mitigation}\n\n`;
      if (threat.detection) {
        md += `**Detection:** ${threat.detection}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_threat_model.md`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Export as HTML
  exportHTML(project) {
    const riskSummary = Scoring.calculateProjectRisk(project.threats || []);
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Threat Model: ${project.name}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .threat { background: white; padding: 20px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #3b82f6; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .critical { background: #fee; color: #c00; }
    .high { background: #ffeaa7; color: #d63031; }
    .medium { background: #dfe6e9; color: #0984e3; }
    .low { background: #d5f4e6; color: #00b894; }
  </style>
</head>
<body>
  <h1>Threat Model: ${project.name}</h1>
  <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
  
  <div class="summary">
    <h2>Executive Summary</h2>
    <p><strong>Total Threats:</strong> ${riskSummary.total}</p>
    <p>
      <span class="badge critical">Critical: ${riskSummary.critical}</span>
      <span class="badge high">High: ${riskSummary.high}</span>
      <span class="badge medium">Medium: ${riskSummary.medium}</span>
      <span class="badge low">Low: ${riskSummary.low}</span>
    </p>
  </div>
  
  <h2>Identified Threats</h2>`;

    (project.threats || []).forEach((threat, index) => {
      const risk = Scoring.calculateRisk(threat.likelihood, threat.impact);
      const level = Scoring.getRiskLevel(risk);
      
      html += `
  <div class="threat">
    <h3>${index + 1}. ${threat.title}</h3>
    <p><span class="badge ${level.toLowerCase()}">${level}</span> <strong>STRIDE:</strong> ${threat.stride}</p>
    <p><strong>Description:</strong> ${threat.description}</p>
    <p><strong>Mitigation:</strong> ${threat.mitigation}</p>
  </div>`;
    });

    html += `
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_threat_model.html`;
    link.click();
    URL.revokeObjectURL(url);
  }
};
