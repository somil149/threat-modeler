// ========================================
// Main Application - ThreatModeler
// ========================================

const { useState, useEffect } = React;

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentProject, setCurrentProject] = useState(null);
  const [theme, setTheme] = useState(Storage.getTheme());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.setTheme(theme);
  }, [theme]);

  // Load current project on mount
  useEffect(() => {
    const project = Storage.getCurrentProject();
    if (project) {
      setCurrentProject(project);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    Storage.setCurrentProject(project.id);
    setCurrentView('architecture');
  };

  const handleProjectUpdate = (updates) => {
    if (currentProject) {
      const updated = Storage.updateProject(currentProject.id, updates);
      setCurrentProject(updated);
    }
  };

  const handleSaveAsTemplate = () => {
    if (currentProject) {
      Storage.saveAsTemplate(currentProject);
      alert('Template saved successfully!');
    }
  };

  const handleShowVersions = () => {
    if (currentProject) {
      const projectVersions = Storage.getVersions(currentProject.id);
      setVersions(projectVersions);
      setShowVersionHistory(true);
    }
  };

  const handleRestoreVersion = (timestamp) => {
    if (currentProject) {
      const restored = Storage.restoreVersion(currentProject.id, timestamp);
      setCurrentProject(restored);
      setShowVersionHistory(false);
      alert('Version restored successfully!');
    }
  };

  const renderView = () => {
    if (!currentProject && currentView !== 'dashboard') {
      return <Dashboard onProjectSelect={handleProjectSelect} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onProjectSelect={handleProjectSelect} />;
      case 'architecture':
        // Use CustomArchitectureBuilder for custom template
        if (currentProject && currentProject.template === 'custom') {
          return <CustomArchitectureBuilder project={currentProject} onUpdate={handleProjectUpdate} />;
        }
        return <ArchitectureCanvas project={currentProject} onUpdate={handleProjectUpdate} />;
      case 'threats':
        return <ThreatList project={currentProject} onUpdate={handleProjectUpdate} />;
      case 'risk':
        return <RiskMatrix project={currentProject} />;
      case 'attackpaths':
        return <AttackPaths project={currentProject} />;
      case 'compliance':
        return <Compliance project={currentProject} />;
      case 'export':
        return <ExportPanel project={currentProject} />;
      default:
        return <Dashboard onProjectSelect={handleProjectSelect} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-shield-alt"></i>
            <span>ThreatModeler</span>
          </div>
        </div>

        <div className="sidebar-nav">
          <button
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </button>

          {currentProject && (
            <>
              <button
                className={`nav-item ${currentView === 'architecture' ? 'active' : ''}`}
                onClick={() => setCurrentView('architecture')}
              >
                <i className="fas fa-project-diagram"></i>
                <span>Architecture</span>
              </button>

              <button
                className={`nav-item ${currentView === 'threats' ? 'active' : ''}`}
                onClick={() => setCurrentView('threats')}
              >
                <i className="fas fa-exclamation-triangle"></i>
                <span>Threats</span>
              </button>

              <button
                className={`nav-item ${currentView === 'risk' ? 'active' : ''}`}
                onClick={() => setCurrentView('risk')}
              >
                <i className="fas fa-chart-bar"></i>
                <span>Risk Matrix</span>
              </button>

              <button
                className={`nav-item ${currentView === 'attackpaths' ? 'active' : ''}`}
                onClick={() => setCurrentView('attackpaths')}
              >
                <i className="fas fa-route"></i>
                <span>Attack Paths</span>
              </button>

              <button
                className={`nav-item ${currentView === 'compliance' ? 'active' : ''}`}
                onClick={() => setCurrentView('compliance')}
              >
                <i className="fas fa-check-circle"></i>
                <span>Compliance</span>
              </button>

              <button
                className={`nav-item ${currentView === 'export' ? 'active' : ''}`}
                onClick={() => setCurrentView('export')}
              >
                <i className="fas fa-file-export"></i>
                <span>Export</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="btn-secondary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className="fas fa-bars"></i>
            </button>
            {currentProject && (
              <span style={{ marginLeft: '1rem', fontWeight: 600 }}>
                {currentProject.name}
              </span>
            )}
          </div>

          <div className="topbar-right">
            {currentProject && (
              <>
                <button className="btn-secondary btn-sm" onClick={handleShowVersions} title="Version History">
                  <i className="fas fa-history"></i>
                </button>
                <button className="btn-secondary btn-sm" onClick={handleSaveAsTemplate} title="Save as Template">
                  <i className="fas fa-save"></i>
                </button>
              </>
            )}
            <button className="btn-secondary btn-sm" onClick={() => setShowTutorial(true)} title="Tutorial">
              <i className="fas fa-question-circle"></i>
            </button>
            <button className="theme-toggle" onClick={toggleTheme}>
              <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`}></i>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {renderView()}
        </div>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="modal-overlay" onClick={() => setShowVersionHistory(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Version History</h2>
              <button onClick={() => setShowVersionHistory(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {versions.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No version history available</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {versions.map((version, index) => (
                    <div key={index} className="card" style={{ padding: '1rem' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Version {versions.length - index}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {new Date(version.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => handleRestoreVersion(version.timestamp)}
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Tutorial */}
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
    </div>
  );
}

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
