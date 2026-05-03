// ========================================
// Architecture Canvas Component
// ========================================

function ArchitectureCanvas({ project, onUpdate }) {
  const svgRef = React.useRef(null);
  const [threatPatterns, setThreatPatterns] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    // Load threat patterns
    fetch('data/threat-patterns.json')
      .then(res => res.json())
      .then(data => setThreatPatterns(data))
      .catch(err => console.error('Failed to load threat patterns:', err));
  }, []);

  useEffect(() => {
    if (!project || !svgRef.current) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Draw flows (edges)
    project.flows?.forEach(flow => {
      const fromComp = project.components.find(c => c.id === flow.from);
      const toComp = project.components.find(c => c.id === flow.to);
      
      if (fromComp && toComp) {
        svg.append('line')
          .attr('x1', fromComp.x)
          .attr('y1', fromComp.y)
          .attr('x2', toComp.x)
          .attr('y2', toComp.y)
          .attr('stroke', 'var(--border)')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrowhead)');

        // Label
        svg.append('text')
          .attr('x', (fromComp.x + toComp.x) / 2)
          .attr('y', (fromComp.y + toComp.y) / 2 - 5)
          .attr('fill', 'var(--text-secondary)')
          .attr('font-size', '10px')
          .text(flow.label);
      }
    });

    // Draw components (nodes)
    project.components?.forEach(comp => {
      // Calculate risk for this component
      const compThreats = project.threats?.filter(t => t.component === comp.id) || [];
      const avgRisk = compThreats.length > 0
        ? compThreats.reduce((sum, t) => sum + Scoring.calculateRisk(t.likelihood, t.impact), 0) / compThreats.length
        : 0;
      const riskLevel = Scoring.getRiskLevel(Math.round(avgRisk));
      const riskColor = showHeatmap ? Scoring.getRiskColor(riskLevel) : 'var(--accent)';

      const g = svg.append('g')
        .attr('transform', `translate(${comp.x}, ${comp.y})`)
        .attr('class', 'component-node')
        .style('cursor', editMode ? 'move' : 'pointer');

      g.append('rect')
        .attr('x', -50)
        .attr('y', -30)
        .attr('width', 100)
        .attr('height', 60)
        .attr('fill', showHeatmap ? `${riskColor}20` : 'var(--bg-secondary)')
        .attr('stroke', riskColor)
        .attr('stroke-width', 2)
        .attr('rx', 5);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 5)
        .attr('fill', 'var(--text-primary)')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(comp.name);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 20)
        .attr('fill', 'var(--text-secondary)')
        .attr('font-size', '10px')
        .text(comp.type);

      // Show threat count if heatmap enabled
      if (showHeatmap && compThreats.length > 0) {
        g.append('circle')
          .attr('cx', 40)
          .attr('cy', -20)
          .attr('r', 12)
          .attr('fill', riskColor);

        g.append('text')
          .attr('x', 40)
          .attr('y', -16)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text(compThreats.length);
      }

      // Add drag behavior if in edit mode
      if (editMode) {
        let startX = comp.x;
        let startY = comp.y;
        
        const drag = d3.drag()
          .on('start', function(event) {
            startX = comp.x;
            startY = comp.y;
            d3.select(this).raise().style('cursor', 'grabbing');
          })
          .on('drag', function(event) {
            const newX = startX + event.x;
            const newY = startY + event.y;
            d3.select(this).attr('transform', `translate(${newX}, ${newY})`);
          })
          .on('end', function(event) {
            d3.select(this).style('cursor', 'move');
            const newX = startX + event.x;
            const newY = startY + event.y;
            // Update component position
            const updatedComponents = project.components.map(c => 
              c.id === comp.id ? { ...c, x: newX, y: newY } : c
            );
            onUpdate({ components: updatedComponents });
          });

        g.call(drag);
      }
    });

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 8)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 3, 0 6')
      .attr('fill', 'var(--border)');

  }, [project, editMode, showHeatmap]);

  const handleGenerateThreats = () => {
    if (!threatPatterns || !project) return;

    const newThreats = [];

    // Generate threats based on components
    project.components?.forEach(comp => {
      // STRIDE threats
      Object.keys(threatPatterns.stride).forEach(category => {
        const patterns = threatPatterns.stride[category];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        newThreats.push({
          id: Date.now() + Math.random(),
          title: pattern.title,
          description: pattern.description,
          component: comp.id,
          stride: category,
          likelihood: pattern.likelihood,
          impact: pattern.impact,
          mitigation: pattern.mitigation,
          detection: pattern.detection
        });
      });
    });

    // Add AI/LLM threats if applicable
    if (project.template?.includes('llm') || project.template?.includes('rag') || project.template?.includes('agent')) {
      threatPatterns.ai_llm_threats.forEach(pattern => {
        newThreats.push({
          id: Date.now() + Math.random(),
          title: pattern.title,
          description: pattern.description,
          component: project.components[0]?.id,
          stride: pattern.stride,
          likelihood: pattern.likelihood,
          impact: pattern.impact,
          mitigation: pattern.mitigation,
          detection: pattern.detection
        });
      });
    }

    onUpdate({ threats: newThreats });
    alert(`Generated ${newThreats.length} threats!`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Architecture Diagram</h2>
        <div className="flex gap-1">
          <button
            className={`btn btn-sm ${editMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setEditMode(!editMode)}
          >
            <i className="fas fa-edit"></i>
            {editMode ? 'Done Editing' : 'Edit Mode'}
          </button>
          <button
            className={`btn btn-sm ${showHeatmap ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            <i className="fas fa-fire"></i>
            Threat Heatmap
          </button>
          <button className="btn btn-primary" onClick={handleGenerateThreats}>
            <i className="fas fa-magic"></i>
            Generate Threats
          </button>
        </div>
      </div>

      <div className="canvas-container">
        {editMode && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--accent)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 10
          }}>
            <i className="fas fa-edit"></i> Edit Mode Active - Drag components to move
          </div>
        )}
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>

      <div className="card mt-2">
        <h3 className="card-title">Components</h3>
        <div className="grid grid-4">
          {project.components?.map(comp => (
            <div key={comp.id} style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '0.375rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{comp.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{comp.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
