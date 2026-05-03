// ========================================
// Custom Architecture Builder Component
// ========================================

function CustomArchitectureBuilder({ project, onUpdate }) {
  const svgRef = React.useRef(null);
  const [componentLibrary, setComponentLibrary] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('infrastructure');
  const [searchQuery, setSearchQuery] = useState('');
  const [components, setComponents] = useState(project.components || []);
  const [flows, setFlows] = useState(project.flows || []);
  const [connectMode, setConnectMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState(null);
  const [isFinalized, setIsFinalized] = useState(project.isFinalized || false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    fetch('data/component-library.json')
      .then(res => res.json())
      .then(data => setComponentLibrary(data))
      .catch(err => console.error('Failed to load component library:', err));
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    renderDiagram();
  }, [components, flows, connectMode, deleteMode, connectFrom, isFinalized]);

  const renderDiagram = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Draw flows
    flows.forEach(flow => {
      const from = components.find(c => c.id === flow.from);
      const to = components.find(c => c.id === flow.to);
      if (from && to) {
        svg.append('line')
          .attr('x1', from.x)
          .attr('y1', from.y)
          .attr('x2', to.x)
          .attr('y2', to.y)
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrow)');
      }
    });

    // Draw components
    components.forEach(comp => {
      const g = svg.append('g')
        .attr('transform', `translate(${comp.x}, ${comp.y})`)
        .style('cursor', connectMode ? 'pointer' : 'move');

      g.append('rect')
        .attr('x', -50)
        .attr('y', -30)
        .attr('width', 100)
        .attr('height', 60)
        .attr('fill', 'var(--bg-secondary)')
        .attr('stroke', connectFrom === comp.id ? '#f59e0b' : deleteMode ? '#ef4444' : 'var(--accent)')
        .attr('stroke-width', connectFrom === comp.id ? 4 : deleteMode ? 3 : 2)
        .attr('rx', 5)
        .style('filter', connectFrom === comp.id ? 'drop-shadow(0 0 10px #f59e0b)' : deleteMode ? 'drop-shadow(0 0 8px #ef4444)' : 'none');

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -5)
        .attr('fill', 'var(--text-primary)')
        .attr('font-size', '20px')
        .text(comp.icon);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 20)
        .attr('fill', 'var(--text-primary)')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .text(comp.name);

      // Click handler for connect/delete mode
      g.on('click', (event) => {
        event.stopPropagation();
        if (connectMode) {
          handleComponentClick(comp.id);
        } else if (deleteMode) {
          handleDeleteComponent(comp.id);
        }
      });

      // Drag behavior (disabled in connect/delete mode)
      if (!connectMode && !deleteMode && !isFinalized) {
        const drag = d3.drag()
          .on('drag', function(event) {
            const newX = event.x;
            const newY = event.y;
            d3.select(this).attr('transform', `translate(${newX}, ${newY})`);
          })
          .on('end', function(event) {
            updateComponentPosition(comp.id, event.x, event.y);
          });

        g.call(drag);
      }

    });

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 8)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3, 0 6')
      .attr('fill', 'var(--accent)');
  };

  const handleComponentClick = (id) => {
    console.log('Component clicked:', id, 'connectMode:', connectMode, 'connectFrom:', connectFrom);
    
    if (!connectMode) return;

    if (!connectFrom) {
      console.log('Setting connectFrom to:', id);
      setConnectFrom(id);
    } else {
      if (connectFrom !== id) {
        console.log('Creating flow from', connectFrom, 'to', id);
        const newFlow = {
          from: connectFrom,
          to: id,
          label: 'Data Flow',
          protocol: 'HTTPS'
        };
        const updatedFlows = [...flows, newFlow];
        setFlows(updatedFlows);
        onUpdate({ components, flows: updatedFlows });
        console.log('Flow created, total flows:', updatedFlows.length);
      }
      setConnectFrom(null);
      setConnectMode(false);
    }
  };

  const handleAddComponent = (libComponent) => {
    const newComponent = {
      id: `${libComponent.id}_${Date.now()}`,
      name: libComponent.name,
      type: libComponent.type,
      icon: libComponent.icon,
      trustBoundary: 'internal',
      x: 400 + Math.random() * 200,
      y: 250 + Math.random() * 100
    };
    const updated = [...components, newComponent];
    setComponents(updated);
    onUpdate({ components: updated, flows });
  };

  const updateComponentPosition = (id, x, y) => {
    const updated = components.map(c => c.id === id ? { ...c, x, y } : c);
    setComponents(updated);
    onUpdate({ components: updated, flows });
  };

  const handleDeleteComponent = (id) => {
    console.log('Deleting component:', id);
    const updatedComponents = components.filter(c => c.id !== id);
    const updatedFlows = flows.filter(f => f.from !== id && f.to !== id);
    console.log('Components after delete:', updatedComponents.length, 'Flows after delete:', updatedFlows.length);
    setComponents(updatedComponents);
    setFlows(updatedFlows);
    onUpdate({ components: updatedComponents, flows: updatedFlows });
  };

  const handleSaveAndFinalize = () => {
    if (components.length === 0) {
      alert('Please add at least one component before finalizing');
      return;
    }
    setShowSaveDialog(true);
  };

  const confirmFinalize = () => {
    setIsFinalized(true);
    const updatedProject = { 
      ...project,
      components, 
      flows, 
      isFinalized: true 
    };
    onUpdate(updatedProject);
    setShowSaveDialog(false);
    
    // Generate threats automatically
    setTimeout(() => {
      generateThreats(updatedProject);
    }, 500);
  };

  const handleUnlock = () => {
    if (confirm('Unlock architecture for editing? This will allow you to modify components and flows.')) {
      setIsFinalized(false);
      onUpdate({ ...project, components, flows, isFinalized: false });
    }
  };

  const generateThreats = (projectData) => {
    // Load threat patterns
    fetch('data/threat-patterns.json')
      .then(res => res.json())
      .then(patterns => {
        const threats = [];
        const comps = projectData.components || components;
        
        // Generate STRIDE threats for each component
        comps.forEach(component => {
          const componentType = component.type.toLowerCase();
          
          // Spoofing
          if (componentType.includes('api') || componentType.includes('auth') || componentType.includes('user')) {
            threats.push({
              id: `threat_${component.id}_spoofing`,
              title: `Spoofing Identity - ${component.name}`,
              description: `Attacker could impersonate legitimate users or services to access ${component.name}`,
              component: component.name,
              stride: 'S',
              likelihood: 3,
              impact: 4,
              mitigation: 'Implement strong authentication (MFA, certificates)',
              detection: 'Monitor for unusual authentication patterns'
            });
          }
          
          // Tampering
          if (componentType.includes('database') || componentType.includes('storage') || componentType.includes('api')) {
            threats.push({
              id: `threat_${component.id}_tampering`,
              title: `Data Tampering - ${component.name}`,
              description: `Attacker could modify data in ${component.name} without authorization`,
              component: component.name,
              stride: 'T',
              likelihood: 3,
              impact: 4,
              mitigation: 'Implement integrity checks, digital signatures, and access controls',
              detection: 'Monitor for unauthorized data modifications'
            });
          }
          
          // Information Disclosure
          if (componentType.includes('database') || componentType.includes('api') || componentType.includes('storage')) {
            threats.push({
              id: `threat_${component.id}_disclosure`,
              title: `Information Disclosure - ${component.name}`,
              description: `Sensitive data in ${component.name} could be exposed to unauthorized parties`,
              component: component.name,
              stride: 'I',
              likelihood: 3,
              impact: 5,
              mitigation: 'Encrypt data at rest and in transit, implement proper access controls',
              detection: 'Monitor for data exfiltration attempts'
            });
          }
          
          // Denial of Service
          threats.push({
            id: `threat_${component.id}_dos`,
            title: `Denial of Service - ${component.name}`,
            description: `Attacker could overwhelm ${component.name} making it unavailable`,
            component: component.name,
            stride: 'D',
            likelihood: 3,
            impact: 3,
            mitigation: 'Implement rate limiting, auto-scaling, and DDoS protection',
            detection: 'Monitor resource usage and availability metrics'
          });
          
          // Elevation of Privilege
          if (componentType.includes('api') || componentType.includes('service') || componentType.includes('auth')) {
            threats.push({
              id: `threat_${component.id}_privilege`,
              title: `Elevation of Privilege - ${component.name}`,
              description: `Attacker could gain unauthorized elevated access to ${component.name}`,
              component: component.name,
              stride: 'E',
              likelihood: 2,
              impact: 5,
              mitigation: 'Implement least privilege, proper authorization checks',
              detection: 'Monitor for privilege escalation attempts'
            });
          }
        });
        
        // Update project with threats
        const finalProject = {
          ...projectData,
          threats: threats
        };
        onUpdate(finalProject);
        
        alert(`Generated ${threats.length} threats! Go to Threats view to review them.`);
      })
      .catch(err => {
        console.error('Failed to generate threats:', err);
        alert('Failed to generate threats. Please try again.');
      });
  };

  if (!componentLibrary) return <div>Loading...</div>;

  const categories = componentLibrary.categories;
  const currentCategory = categories[selectedCategory];
  
  // Filter components by search
  const filteredComponents = currentCategory.components.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '600px', gap: '1rem' }}>
      {/* Component Palette */}
      <div style={{ width: '300px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1rem', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Component Library</h3>
        
        {/* Search */}
        <input
          type="text"
          className="input"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '1rem', fontSize: '0.875rem' }}
        />

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {Object.keys(categories).map(key => (
            <button
              key={key}
              className={`btn btn-sm ${selectedCategory === key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(key)}
              style={{ justifyContent: 'flex-start' }}
            >
              <i className={`fas ${categories[key].icon}`}></i>
              {categories[key].name}
            </button>
          ))}
        </div>

        {/* Components */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredComponents.map(comp => (
            <div
              key={comp.id}
              onClick={() => handleAddComponent(comp)}
              style={{
                padding: '0.75rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <span style={{ fontSize: '1.5rem' }}>{comp.icon}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{comp.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {!isFinalized && (
            <>
              <button
                className={`btn btn-sm ${connectMode ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  setConnectMode(!connectMode);
                  setDeleteMode(false);
                  setConnectFrom(null);
                }}
                disabled={isFinalized}
              >
                <i className="fas fa-link"></i>
                {connectMode ? 'Exit Connect' : 'Connect'}
              </button>
              
              <button
                className={`btn btn-sm ${deleteMode ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => {
                  setDeleteMode(!deleteMode);
                  setConnectMode(false);
                  setConnectFrom(null);
                }}
                disabled={isFinalized}
              >
                <i className="fas fa-trash"></i>
                {deleteMode ? 'Exit Delete' : 'Delete'}
              </button>

              <div style={{ flex: 1 }}></div>

              <button
                className="btn btn-sm btn-primary"
                onClick={handleSaveAndFinalize}
                disabled={components.length === 0}
              >
                <i className="fas fa-check"></i>
                Save & Finalize
              </button>
            </>
          )}

          {isFinalized && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.5rem 1rem', background: 'var(--success)', color: 'white', borderRadius: '0.375rem', fontWeight: 600 }}>
                <i className="fas fa-lock"></i> Architecture Finalized
              </div>
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleUnlock}
                title="Unlock to edit architecture"
              >
                <i className="fas fa-unlock"></i>
                Unlock & Edit
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isFinalized && (
          <div style={{ marginBottom: '1rem' }}>
            {connectMode && !connectFrom && (
              <div style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600 }}>
                <i className="fas fa-hand-pointer"></i> Click first component to start connection
              </div>
            )}
            {connectMode && connectFrom && (
              <div style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: 600 }}>
                <i className="fas fa-arrow-right"></i> Now click target component to complete connection
              </div>
            )}
            {deleteMode && (
              <div style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 600 }}>
                <i className="fas fa-trash"></i> Click any component to delete it
              </div>
            )}
            {!connectMode && !deleteMode && (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <i className="fas fa-mouse"></i> Drag components to reposition • Use Connect/Delete buttons for actions
              </div>
            )}
          </div>
        )}

        <div style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '0.5rem', position: 'relative' }}>
          {components.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-mouse-pointer" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                <p>Click components from the library to add them to your architecture</p>
              </div>
            </div>
          )}
          <svg ref={svgRef} width="100%" height="100%"></svg>
        </div>
      </div>

      {/* Save & Finalize Dialog */}
      {showSaveDialog && (
        <div className="modal-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Finalize Architecture?</h2>
              <button onClick={() => setShowSaveDialog(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '1rem' }}>
                You are about to finalize this architecture with:
              </p>
              <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>{components.length}</strong> components</li>
                <li><strong>{flows.length}</strong> data flows</li>
              </ul>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Once finalized, you won't be able to add/remove components. You'll be prompted to discover threats next.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmFinalize}>
                <i className="fas fa-check"></i>
                Finalize & Discover Threats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
