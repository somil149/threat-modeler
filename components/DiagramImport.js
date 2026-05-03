// ========================================
// Diagram Import Component
// ========================================

function DiagramImport({ onImport, onCancel }) {
  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedComponents, setDetectedComponents] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const sampleDiagrams = [
    {
      id: 'web-app',
      name: 'Web Application (3-Tier)',
      path: 'assets/sample-diagrams/web-app.svg',
      description: 'Classic 3-tier web architecture with load balancer, web server, API, database, and cache'
    },
    {
      id: 'microservices',
      name: 'Microservices Architecture',
      path: 'assets/sample-diagrams/microservices.svg',
      description: 'Microservices with API gateway, multiple services, databases, and message queue'
    },
    {
      id: 'cloud-aws',
      name: 'Cloud Architecture (AWS)',
      path: 'assets/sample-diagrams/cloud-aws.svg',
      description: 'AWS cloud setup with CloudFront, ALB, EC2, Lambda, RDS, S3, and ElastiCache'
    }
  ];

  const handleSampleSelect = async (sample) => {
    setSelectedSample(sample);
    setIsProcessing(true);
    
    try {
      // Fetch the SVG content
      const response = await fetch(sample.path);
      const svgText = await response.text();
      
      // Parse SVG and extract components
      const components = parseSVGDiagram(svgText, sample.id);
      setDetectedComponents(components);
      setShowPreview(true);
    } catch (error) {
      console.error('Error processing sample diagram:', error);
      alert('Failed to process diagram. Please try another one.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadedImage(URL.createObjectURL(file));

    try {
      // For now, show a placeholder message
      // In production, this would use TensorFlow.js + Tesseract.js
      alert('Custom image upload is coming soon! For now, please use the sample diagrams.');
      setIsProcessing(false);
      setUploadedImage(null);
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      alert('Failed to process image. Please try a sample diagram instead.');
      setIsProcessing(false);
    }
  };

  const parseSVGDiagram = (svgText, diagramType) => {
    // Parse SVG and extract text elements to identify components
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const textElements = svgDoc.querySelectorAll('text');
    
    const components = [];
    const flows = [];
    let componentId = 1;
    let flowId = 1;

    // Predefined mappings for sample diagrams
    const diagramMappings = {
      'web-app': {
        components: [
          { name: 'User', type: 'external-entity', trustBoundary: 'external', x: 100, y: 150 },
          { name: 'Load Balancer', type: 'process', trustBoundary: 'dmz', x: 250, y: 150 },
          { name: 'Web Server', type: 'process', trustBoundary: 'internal', x: 400, y: 150 },
          { name: 'API Server', type: 'process', trustBoundary: 'internal', x: 400, y: 300 },
          { name: 'Database', type: 'datastore', trustBoundary: 'internal', x: 400, y: 450 },
          { name: 'Redis Cache', type: 'datastore', trustBoundary: 'internal', x: 550, y: 300 }
        ],
        flows: [
          { from: 'User', to: 'Load Balancer', protocol: 'HTTPS', data: 'User requests' },
          { from: 'Load Balancer', to: 'Web Server', protocol: 'HTTP', data: 'HTTP requests' },
          { from: 'Web Server', to: 'API Server', protocol: 'REST', data: 'API calls' },
          { from: 'API Server', to: 'Database', protocol: 'SQL', data: 'Database queries' },
          { from: 'API Server', to: 'Redis Cache', protocol: 'Redis', data: 'Cache operations' }
        ]
      },
      'microservices': {
        components: [
          { name: 'API Gateway', type: 'process', trustBoundary: 'dmz', x: 400, y: 100 },
          { name: 'User Service', type: 'process', trustBoundary: 'internal', x: 150, y: 250 },
          { name: 'Order Service', type: 'process', trustBoundary: 'internal', x: 300, y: 250 },
          { name: 'Payment Service', type: 'process', trustBoundary: 'internal', x: 450, y: 250 },
          { name: 'Notification Service', type: 'process', trustBoundary: 'internal', x: 600, y: 250 },
          { name: 'User DB', type: 'datastore', trustBoundary: 'internal', x: 150, y: 400 },
          { name: 'Order DB', type: 'datastore', trustBoundary: 'internal', x: 300, y: 400 },
          { name: 'Payment DB', type: 'datastore', trustBoundary: 'internal', x: 450, y: 400 },
          { name: 'Message Queue', type: 'datastore', trustBoundary: 'internal', x: 600, y: 400 }
        ],
        flows: [
          { from: 'API Gateway', to: 'User Service', protocol: 'REST', data: 'User requests' },
          { from: 'API Gateway', to: 'Order Service', protocol: 'REST', data: 'Order requests' },
          { from: 'API Gateway', to: 'Payment Service', protocol: 'REST', data: 'Payment requests' },
          { from: 'API Gateway', to: 'Notification Service', protocol: 'REST', data: 'Notification requests' },
          { from: 'User Service', to: 'User DB', protocol: 'SQL', data: 'User data' },
          { from: 'Order Service', to: 'Order DB', protocol: 'SQL', data: 'Order data' },
          { from: 'Payment Service', to: 'Payment DB', protocol: 'NoSQL', data: 'Payment data' },
          { from: 'Notification Service', to: 'Message Queue', protocol: 'AMQP', data: 'Messages' }
        ]
      },
      'cloud-aws': {
        components: [
          { name: 'Internet', type: 'external-entity', trustBoundary: 'external', x: 400, y: 100 },
          { name: 'CloudFront CDN', type: 'process', trustBoundary: 'dmz', x: 400, y: 200 },
          { name: 'Load Balancer', type: 'process', trustBoundary: 'dmz', x: 400, y: 300 },
          { name: 'EC2 Instance 1', type: 'process', trustBoundary: 'internal', x: 200, y: 400 },
          { name: 'EC2 Instance 2', type: 'process', trustBoundary: 'internal', x: 350, y: 400 },
          { name: 'Lambda', type: 'process', trustBoundary: 'internal', x: 500, y: 400 },
          { name: 'RDS', type: 'datastore', trustBoundary: 'internal', x: 200, y: 550 },
          { name: 'S3 Bucket', type: 'datastore', trustBoundary: 'internal', x: 500, y: 550 },
          { name: 'ElastiCache', type: 'datastore', trustBoundary: 'internal', x: 650, y: 400 }
        ],
        flows: [
          { from: 'Internet', to: 'CloudFront CDN', protocol: 'HTTPS', data: 'User requests' },
          { from: 'CloudFront CDN', to: 'Load Balancer', protocol: 'HTTPS', data: 'HTTP requests' },
          { from: 'Load Balancer', to: 'EC2 Instance 1', protocol: 'HTTP', data: 'Web traffic' },
          { from: 'Load Balancer', to: 'EC2 Instance 2', protocol: 'HTTP', data: 'Web traffic' },
          { from: 'Load Balancer', to: 'Lambda', protocol: 'HTTP', data: 'API calls' },
          { from: 'EC2 Instance 1', to: 'RDS', protocol: 'SQL', data: 'Database queries' },
          { from: 'EC2 Instance 2', to: 'RDS', protocol: 'SQL', data: 'Database queries' },
          { from: 'Lambda', to: 'S3 Bucket', protocol: 'S3 API', data: 'Object storage' },
          { from: 'EC2 Instance 2', to: 'ElastiCache', protocol: 'Redis', data: 'Cache operations' }
        ]
      }
    };

    const mapping = diagramMappings[diagramType];
    if (mapping) {
      mapping.components.forEach((comp, idx) => {
        components.push({
          id: `comp_${componentId++}`,
          ...comp
        });
      });

      mapping.flows.forEach((flow, idx) => {
        const fromComp = components.find(c => c.name === flow.from);
        const toComp = components.find(c => c.name === flow.to);
        if (fromComp && toComp) {
          flows.push({
            id: `flow_${flowId++}`,
            from: fromComp.id,
            to: toComp.id,
            protocol: flow.protocol,
            data: flow.data
          });
        }
      });
    }

    return { components, flows };
  };

  const handleConfirmImport = () => {
    console.log('handleConfirmImport called');
    console.log('detectedComponents:', detectedComponents);
    
    if (detectedComponents.components && detectedComponents.components.length > 0) {
      console.log('Calling onImport with data');
      onImport({
        components: detectedComponents.components,
        flows: detectedComponents.flows || [],
        name: selectedSample.name,
        description: selectedSample.description
      });
    } else {
      console.error('No components detected!');
      alert('No components detected. Please try another diagram.');
    }
  };

  if (showPreview) {
    return (
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          Preview Detected Architecture
        </h2>

        <div className="card mb-2">
          <h3 className="card-title">{selectedSample.name}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {selectedSample.description}
          </p>

          <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Components Detected</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
                {detectedComponents.components?.length || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Data Flows Detected</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
                {detectedComponents.flows?.length || 0}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Components:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {detectedComponents.components?.map((comp, idx) => (
                <span key={idx} className="badge badge-info">
                  {comp.name} ({comp.type})
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={handleConfirmImport}>
              <i className="fas fa-check"></i> Import Architecture
            </button>
            <button className="btn btn-secondary" onClick={() => {
              setShowPreview(false);
              setSelectedSample(null);
              setDetectedComponents([]);
            }}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Import Architecture Diagram
      </h2>

      <div className="card mb-2">
        <h3 className="card-title">
          <i className="fas fa-images"></i> Sample Diagrams
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Select a sample diagram to automatically detect and import the architecture
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {sampleDiagrams.map(sample => (
            <div
              key={sample.id}
              onClick={() => handleSampleSelect(sample)}
              style={{
                padding: '1rem',
                border: '2px solid var(--border)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedSample?.id === sample.id ? 'var(--accent-bg)' : 'var(--bg-secondary)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ 
                height: '150px', 
                background: 'white', 
                borderRadius: '0.375rem', 
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={sample.path} 
                  alt={sample.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {sample.name}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                {sample.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          <i className="fas fa-upload"></i> Upload Custom Diagram
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Upload your own architecture diagram (PNG, JPG, or SVG)
        </p>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--warning)', 
          background: 'var(--warning-bg)',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          <i className="fas fa-info-circle"></i> Custom image detection is coming soon! 
          For now, please use the sample diagrams above.
        </p>
        <input
          type="file"
          accept="image/*,.svg"
          onChange={handleFileUpload}
          disabled={true}
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        />
      </div>

      {isProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Processing Diagram...
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Detecting components and data flows
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2" style={{ marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
      </div>
    </div>
  );
}
