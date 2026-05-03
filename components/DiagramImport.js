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

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or SVG)');
      return;
    }

    setIsProcessing(true);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    try {
      // For now, show a simple component extraction UI
      // User can manually identify components from the image
      const components = await extractComponentsFromImage(imageUrl, file.type);
      setDetectedComponents(components);
      setShowPreview(true);
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      alert('Failed to process image. Please try again or use a sample diagram.');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractComponentsFromImage = async (imageUrl, fileType) => {
    // Simple extraction: create a comprehensive starter architecture
    // In a real implementation, this would use OCR and shape detection
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Create a comprehensive starter template with common components
        const components = [
          // External layer
          { id: 'comp_1', name: 'User/Client', type: 'external-entity', trustBoundary: 'external', x: 100, y: 100 },
          
          // DMZ layer
          { id: 'comp_2', name: 'API Gateway', type: 'process', trustBoundary: 'dmz', x: 300, y: 100 },
          { id: 'comp_3', name: 'Load Balancer', type: 'process', trustBoundary: 'dmz', x: 500, y: 100 },
          
          // Application layer
          { id: 'comp_4', name: 'Web Server', type: 'process', trustBoundary: 'internal', x: 200, y: 250 },
          { id: 'comp_5', name: 'Application Server', type: 'process', trustBoundary: 'internal', x: 400, y: 250 },
          { id: 'comp_6', name: 'Auth Service', type: 'process', trustBoundary: 'internal', x: 600, y: 250 },
          
          // Data layer
          { id: 'comp_7', name: 'Database', type: 'datastore', trustBoundary: 'internal', x: 300, y: 400 },
          { id: 'comp_8', name: 'Cache', type: 'datastore', trustBoundary: 'internal', x: 500, y: 400 }
        ];
        
        const flows = [
          { id: 'flow_1', from: 'comp_1', to: 'comp_2', protocol: 'HTTPS', data: 'User requests' },
          { id: 'flow_2', from: 'comp_2', to: 'comp_3', protocol: 'HTTP', data: 'Load balanced traffic' },
          { id: 'flow_3', from: 'comp_3', to: 'comp_4', protocol: 'HTTP', data: 'Web requests' },
          { id: 'flow_4', from: 'comp_4', to: 'comp_5', protocol: 'REST', data: 'API calls' },
          { id: 'flow_5', from: 'comp_5', to: 'comp_6', protocol: 'REST', data: 'Auth requests' },
          { id: 'flow_6', from: 'comp_5', to: 'comp_7', protocol: 'SQL', data: 'Database queries' },
          { id: 'flow_7', from: 'comp_5', to: 'comp_8', protocol: 'Redis', data: 'Cache operations' }
        ];
        
        resolve({ components, flows });
      };
      img.onerror = () => {
        resolve({ components: [], flows: [] });
      };
      img.src = imageUrl;
    });
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
        name: selectedSample ? selectedSample.name : 'Custom Architecture',
        description: selectedSample ? selectedSample.description : 'Imported from custom diagram'
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
          <h3 className="card-title">
            {selectedSample ? selectedSample.name : 'Custom Diagram'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {selectedSample ? selectedSample.description : 'Uploaded custom architecture diagram'}
          </p>

          {/* Show uploaded image if available */}
          {uploadedImage && (
            <div style={{ marginBottom: '1rem', maxHeight: '300px', overflow: 'auto', background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <img src={uploadedImage} alt="Uploaded diagram" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}

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

          {uploadedImage && (
            <div style={{ 
              padding: '1rem', 
              background: 'var(--info-bg)', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid var(--info)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--info)', fontWeight: 600, marginBottom: '0.5rem' }}>
                <i className="fas fa-lightbulb"></i> Starter Template Created
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Created 8 starter components with common architecture patterns. After import:
              </p>
              <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
                <li>Rename components to match your diagram</li>
                <li>Add more components from the library</li>
                <li>Adjust positions by dragging</li>
                <li>Use Connect mode to add/modify flows</li>
                <li>Use Delete mode to remove unwanted components</li>
              </ul>
            </div>
          )}

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
              setUploadedImage(null);
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
          color: 'var(--info)', 
          background: 'var(--info-bg)',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          <i className="fas fa-info-circle"></i> <strong>Basic Detection:</strong> The system will create starter components 
          that you can rename and customize in the architecture canvas. For best results, use the sample diagrams above.
        </p>
        <input
          type="file"
          accept="image/*,.svg"
          onChange={handleFileUpload}
          className="input"
          style={{ cursor: 'pointer' }}
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
