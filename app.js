// ========================================
// Main Application - ThreatModeler
// ========================================

const { useState, useEffect } = React;

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentProject, setCurrentProject] = useState(null);
  const [theme, setTheme] = useState(Storage.getTheme());
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    // Wait for FirebaseAuth to initialize
    const checkAuth = () => {
      if (typeof FirebaseAuth === 'undefined') {
        setTimeout(checkAuth, 100);
        return;
      }

      // Listen for auth state changes
      const handleAuthChange = (event) => {
        const user = event.detail;
        setUser(user);
        if (user) {
          setShowLogin(false);
        } else {
          setShowLogin(true);
        }
      };

      window.addEventListener('authStateChanged', handleAuthChange);

      // Check existing auth
      if (FirebaseAuth.isAuthenticated()) {
        const existingUser = FirebaseAuth.getUser();
        setUser(existingUser);
        setShowLogin(false);
      } else {
        setShowLogin(true);
      }
    };

    checkAuth();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('authStateChanged', () => {});
      }
    };
  }, []);

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

    // Handle shareable links
    const hash = window.location.hash;
    if (hash.startsWith('#share/')) {
      const shareData = Storage.parseShareableLink(hash);
      if (shareData) {
        if (confirm(`Import shared project "${shareData.name}"?`)) {
          const imported = Storage.importFromShare(shareData);
          setCurrentProject(imported);
          Storage.setCurrentProject(imported.id);
          setCurrentView('architecture');
          // Clear hash
          window.location.hash = '';
        }
      } else {
        alert('Invalid share link');
        window.location.hash = '';
      }
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
    // Allow dashboard and diagramimport without a project
    if (!currentProject && currentView !== 'dashboard' && currentView !== 'diagramimport') {
      return <Dashboard 
        onProjectSelect={handleProjectSelect} 
        onImportDiagram={() => setCurrentView('diagramimport')}
      />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          onProjectSelect={handleProjectSelect} 
          onImportDiagram={() => setCurrentView('diagramimport')}
        />;
      case 'diagramimport':
        return <DiagramImport 
          onImport={(data) => {
            console.log('DiagramImport - onImport called with data:', data);
            
            // Create new project from imported diagram
            const projectData = {
              name: data.name,
              description: data.description,
              template: 'custom',
              components: data.components,
              flows: data.flows,
              threats: []
            };
            
            console.log('Creating project with data:', projectData);
            const newProject = Storage.createProject(projectData);
            console.log('Project created:', newProject);
            
            // Set project first, then switch view in next tick
            setCurrentProject(newProject);
            setTimeout(() => {
              console.log('Switching to architecture view');
              setCurrentView('architecture');
            }, 0);
          }}
          onCancel={() => setCurrentView('dashboard')}
        />;
      case 'architecture':
        // Use CustomArchitectureBuilder for custom template
        if (currentProject && currentProject.template === 'custom') {
          return <CustomArchitectureBuilder project={currentProject} onUpdate={handleProjectUpdate} />;
        }
        return <ArchitectureCanvas project={currentProject} onUpdate={handleProjectUpdate} />;
      case 'threats':
        return <ThreatList project={currentProject} onUpdate={handleProjectUpdate} />;
      case 'intelligence':
        return <ThreatIntelligence project={currentProject} />;
      case 'aisuggestions':
        return <AISuggestions project={currentProject} onApplySuggestion={null} />;
      case 'risk':
        return <RiskMatrix project={currentProject} />;
      case 'attackpaths':
        return <AttackPaths project={currentProject} />;
      case 'compliance':
        return <Compliance project={currentProject} />;
      case '3dview':
        return <Architecture3D project={currentProject} />;
      case 'export':
        return <ExportPanel project={currentProject} />;
      default:
        return <Dashboard 
        onProjectSelect={handleProjectSelect} 
        onImportDiagram={() => setCurrentView('diagramimport')}
      />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>


      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-shield-alt" style={{ color: 'var(--accent)', marginRight: '0.5rem' }}></i>
                Welcome to ThreatModeler
              </h2>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                Sign in to access your threat models
              </p>
              
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await FirebaseAuth.loginWithGoogle();
                  } catch (error) {
                    alert('Google login failed: ' + error.message);
                  }
                }}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginBottom: '0.75rem', background: '#4285f4' }}
              >
                <i className="fab fa-google" style={{ marginRight: '0.5rem' }}></i>
                Continue with Google
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await FirebaseAuth.loginWithGitHub();
                  } catch (error) {
                    alert('GitHub login failed: ' + error.message);
                  }
                }}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginBottom: '0.75rem', background: '#24292e' }}
              >
                <i className="fab fa-github" style={{ marginRight: '0.5rem' }}></i>
                Continue with GitHub
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await FirebaseAuth.loginWithMicrosoft();
                  } catch (error) {
                    alert('Microsoft login failed: ' + error.message);
                  }
                }}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginBottom: '0.75rem', background: '#00a4ef' }}
              >
                <i className="fab fa-microsoft" style={{ marginRight: '0.5rem' }}></i>
                Continue with Microsoft
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await FirebaseAuth.loginWithTwitter();
                  } catch (error) {
                    alert('Twitter login failed: ' + error.message);
                  }
                }}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', background: '#1da1f2' }}
              >
                <i className="fab fa-twitter" style={{ marginRight: '0.5rem' }}></i>
                Continue with Twitter
              </button>

              <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Your data is stored locally and encrypted. Login is required to access the app.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
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
                className={`nav-item ${currentView === 'intelligence' ? 'active' : ''}`}
                onClick={() => setCurrentView('intelligence')}
              >
                <i className="fas fa-shield-virus"></i>
                <span>Threat Intel</span>
              </button>

              <button
                className={`nav-item ${currentView === 'aisuggestions' ? 'active' : ''}`}
                onClick={() => setCurrentView('aisuggestions')}
              >
                <i className="fas fa-magic"></i>
                <span>AI Suggestions</span>
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
                className={`nav-item ${currentView === '3dview' ? 'active' : ''}`}
                onClick={() => setCurrentView('3dview')}
              >
                <i className="fas fa-cube"></i>
                <span>3D View</span>
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
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
                  <button
                    onClick={() => FirebaseAuth.logout()}
                    style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
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
