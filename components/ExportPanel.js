// ========================================
// Export Panel Component
// ========================================

function ExportPanel({ project }) {
  const handleExport = (format) => {
    switch (format) {
      case 'pdf':
        ExportUtil.exportPDF(project);
        break;
      case 'csv':
        ExportUtil.exportCSV(project);
        break;
      case 'json':
        ExportUtil.exportJSON(project);
        break;
      case 'markdown':
        ExportUtil.exportMarkdown(project);
        break;
      case 'html':
        ExportUtil.exportHTML(project);
        break;
      default:
        break;
    }
  };

  const exportOptions = [
    {
      format: 'pdf',
      icon: 'fa-file-pdf',
      title: 'PDF Report',
      description: 'Executive and technical report',
      color: '#ef4444'
    },
    {
      format: 'csv',
      icon: 'fa-file-csv',
      title: 'CSV Export',
      description: 'Threat table for spreadsheets',
      color: '#10b981'
    },
    {
      format: 'json',
      icon: 'fa-file-code',
      title: 'JSON Export',
      description: 'Full project data',
      color: '#3b82f6'
    },
    {
      format: 'markdown',
      icon: 'fa-file-alt',
      title: 'Markdown',
      description: 'Documentation format',
      color: '#f59e0b'
    },
    {
      format: 'html',
      icon: 'fa-file-code',
      title: 'HTML Report',
      description: 'Shareable web page',
      color: '#8b5cf6'
    }
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Export Threat Model
      </h2>

      <div className="card mb-2">
        <h3 className="card-title">Project Summary</h3>
        <div className="grid grid-2">
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Project Name</div>
            <div style={{ fontWeight: 600 }}>{project.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Template</div>
            <div style={{ fontWeight: 600 }}>{project.template}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Components</div>
            <div style={{ fontWeight: 600 }}>{project.components?.length || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Threats</div>
            <div style={{ fontWeight: 600 }}>{project.threats?.length || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {exportOptions.map(option => (
          <div
            key={option.format}
            className="card"
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => handleExport(option.format)}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = option.color}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div className="flex items-center gap-2 mb-1">
              <i className={`fas ${option.icon}`} style={{ fontSize: '2rem', color: option.color }}></i>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{option.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {option.description}
                </p>
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm mt-1"
              style={{ width: '100%' }}
            >
              <i className="fas fa-download"></i>
              Export {option.title}
            </button>
          </div>
        ))}
      </div>

      <div className="card mt-2">
        <h3 className="card-title">Export Notes</h3>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
          <li>PDF includes executive summary and detailed threat list</li>
          <li>CSV format is compatible with Excel and Google Sheets</li>
          <li>JSON export can be imported back into ThreatModeler</li>
          <li>Markdown is ideal for documentation and version control</li>
          <li>HTML report can be shared via email or web hosting</li>
        </ul>
      </div>
    </div>
  );
}
