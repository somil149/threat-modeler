// ========================================
// 3D Architecture View Component
// Uses Three.js for 3D visualization
// ========================================

function Architecture3D({ project }) {
  const containerRef = React.useRef(null);
  const sceneRef = React.useRef(null);
  const [view3D, setView3D] = React.useState(false);

  React.useEffect(() => {
    if (!view3D || !containerRef.current || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Create 3D components
    const components = project.components || [];
    const componentMeshes = [];

    components.forEach((comp, index) => {
      // Component type determines shape and color
      let geometry, color;
      
      if (comp.type.toLowerCase().includes('database')) {
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        color = 0x3b82f6; // Blue
      } else if (comp.type.toLowerCase().includes('api') || comp.type.toLowerCase().includes('gateway')) {
        geometry = new THREE.BoxGeometry(1, 1.5, 0.5);
        color = 0x10b981; // Green
      } else if (comp.type.toLowerCase().includes('user') || comp.type.toLowerCase().includes('external')) {
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        color = 0xf59e0b; // Orange
      } else if (comp.type.toLowerCase().includes('firewall') || comp.type.toLowerCase().includes('waf')) {
        geometry = new THREE.BoxGeometry(2, 1, 0.2);
        color = 0xef4444; // Red
      } else {
        geometry = new THREE.BoxGeometry(1, 1, 1);
        color = 0x6366f1; // Purple
      }

      const material = new THREE.MeshPhongMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.2
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position based on 2D coordinates
      const x = ((comp.x || index * 100) / 100) - 5;
      const z = ((comp.y || index * 100) / 100) - 5;
      mesh.position.set(x, 0.5, z);
      
      mesh.userData = { component: comp };
      componentMeshes.push(mesh);
      scene.add(mesh);

      // Add label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#ffffff';
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillText(comp.name, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x, 2, z);
      sprite.scale.set(2, 0.5, 1);
      scene.add(sprite);
    });

    // Create connections
    const flows = project.flows || [];
    flows.forEach(flow => {
      const fromMesh = componentMeshes.find(m => m.userData.component.id === flow.from);
      const toMesh = componentMeshes.find(m => m.userData.component.id === flow.to);

      if (fromMesh && toMesh) {
        const points = [
          fromMesh.position.clone(),
          toMesh.position.clone()
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 2 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
      }
    });

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Rotate scene slowly
      scene.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [view3D, project]);

  return (
    <div className="architecture-3d">
      <div className="panel-header">
        <h2>
          <i className="fas fa-cube" style={{ color: 'var(--accent)', marginRight: '0.5rem' }}></i>
          3D Architecture View
        </h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setView3D(!view3D)}
        >
          <i className={`fas fa-${view3D ? 'eye-slash' : 'eye'}`}></i>
          {view3D ? 'Hide 3D View' : 'Show 3D View'}
        </button>
      </div>

      {!view3D && (
        <div className="empty-state">
          <i className="fas fa-cube" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
          <p>Click "Show 3D View" to visualize your architecture in 3D</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Interactive 3D visualization with component shapes based on type
          </p>
        </div>
      )}

      {view3D && (
        <div 
          ref={containerRef} 
          style={{ 
            width: '100%', 
            height: '600px', 
            borderRadius: '8px', 
            overflow: 'hidden',
            background: '#1a1a2e'
          }}
        />
      )}

      {view3D && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600 }}>Legend:</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#3b82f6', borderRadius: '2px' }}></div>
              <span>Database (Cylinder)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#10b981', borderRadius: '2px' }}></div>
              <span>API/Gateway (Box)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#f59e0b', borderRadius: '50%' }}></div>
              <span>User/External (Sphere)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#ef4444', borderRadius: '2px' }}></div>
              <span>Firewall/WAF (Flat Box)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', background: '#6366f1', borderRadius: '2px' }}></div>
              <span>Other (Cube)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
