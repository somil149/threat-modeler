// ========================================
// Dashboard Component
// ========================================

function Dashboard({ onProjectSelect, onImportDiagram }) {
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareProject, setShareProject] = useState(null);

  useEffect(() => {
    setProjects(Storage.getProjects());
    
    // Load templates
    fetch('data/templates.json')
      .then(res => res.json())
      .then(data => {
        const customTemplates = Storage.getCustomTemplates();
        setTemplates([...data.templates, ...customTemplates]);
      })
      .catch(err => console.error('Failed to load templates:', err));
  }, []);

  const handleCreateProject = () => {
    if (!newProjectName || !selectedTemplate) {
      alert('Please enter project name and select a template');
      return;
    }

    const template = templates.find(t => t.id === selectedTemplate);
    
    const newProject = Storage.createProject({
      name: newProjectName,
      template: selectedTemplate,
      components: template.components,
      flows: template.flows,
      threats: []
    });

    setProjects([...projects, newProject]);
    setShowNewProject(false);
    setNewProjectName('');
    setSelectedTemplate('');
    onProjectSelect(newProject);
  };

  const handleDeleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      Storage.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleExportProject = (project, e) => {
    e.stopPropagation();
    Storage.exportProject(project);
  };

  const handleImportProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = Storage.importProject(event.target.result);
            setProjects([...projects, imported]);
            alert(`Project "${imported.name}" imported successfully!`);
          } catch (error) {
            alert('Failed to import project: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleShareProject = (project, e) => {
    e.stopPropagation();
    const link = Storage.generateShareableLink(project);
    setShareLink(link);
    setShareProject(project);
    setShowShareModal(true);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  const handleSaveAsTemplate = (project, e) => {
    e.stopPropagation();
    const template = Storage.saveAsTemplate(project);
    alert(`Template "${template.name}" created successfully!`);
    // Reload templates
    const customTemplates = Storage.getCustomTemplates();
    fetch('data/templates.json')
      .then(res => res.json())
      .then(data => setTemplates([...data.templates, ...customTemplates]))
      .catch(err => console.error('Failed to reload templates:', err));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Threat Modeling Projects
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Create and manage your threat models
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => setShowNewProject(true)}>
            <i className="fas fa-plus"></i>
            New Project
          </button>
          <button className="btn btn-secondary" onClick={handleImportProject}>
            <i className="fas fa-file-upload"></i>
            Import Project
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              console.log('Import Diagram clicked, onImportDiagram:', onImportDiagram);
              if (onImportDiagram) {
                onImportDiagram();
              } else {
                console.error('onImportDiagram is not defined!');
              }
            }}
            style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
          >
            <i className="fas fa-file-import"></i>
            Import Diagram
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-3" style={{ marginTop: '2rem' }}>
        {projects.map(project => (
          <div key={project.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{project.name}</h3>
              <button
                className="btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <div onClick={() => onProjectSelect(project)} style={{ cursor: 'pointer' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Template: {project.template}
              </p>
              <div className="flex gap-2">
                <span className="badge badge-medium">
                  {project.components?.length || 0} Components
                </span>
                <span className="badge badge-high">
                  {project.threats?.length || 0} Threats
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Updated: {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="card-footer" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={(e) => handleExportProject(project, e)}
                title="Export as JSON"
              >
                <i className="fas fa-download"></i>
              </button>
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={(e) => handleShareProject(project, e)}
                title="Share (read-only link)"
              >
                <i className="fas fa-share-alt"></i>
              </button>
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={(e) => handleSaveAsTemplate(project, e)}
                title="Save as template"
              >
                <i className="fas fa-save"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="modal-overlay" onClick={() => setShowNewProject(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button onClick={() => setShowNewProject(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="My Threat Model"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select Template</label>
                <select
                  className="select"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Choose a template...</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {selectedTemplate && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewProject(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateProject}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Share Project: {shareProject?.name}</h2>
              <button onClick={() => setShowShareModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Anyone with this link can view (read-only) your threat model:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  value={shareLink}
                  readOnly
                  style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}
                />
                <button className="btn btn-primary" onClick={handleCopyShareLink}>
                  <i className="fas fa-copy"></i> Copy
                </button>
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <i className="fas fa-info-circle"></i> <strong>Note:</strong> The link contains the entire project data. 
                  Recipients can import it to their own account but cannot edit your original project.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowShareModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
