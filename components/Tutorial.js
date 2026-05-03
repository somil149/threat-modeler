// ========================================
// Tutorial Component
// ========================================

function Tutorial({ onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to ThreatModeler!",
      content: "This interactive tutorial will guide you through creating your first threat model.",
      icon: "fa-shield-alt"
    },
    {
      title: "Step 1: Create a Project",
      content: "Click 'New Project' on the Dashboard. Choose a template that matches your architecture (Web App, Mobile, Microservices, RAG, LLM, etc.).",
      icon: "fa-plus"
    },
    {
      title: "Step 2: View Architecture",
      content: "The Architecture tab shows your system diagram. Components are connected by data flows. Use 'Edit Mode' to drag components around.",
      icon: "fa-project-diagram"
    },
    {
      title: "Step 3: Generate Threats",
      content: "Click 'Generate Threats' to automatically identify security threats using STRIDE, OWASP, and AI/LLM threat patterns.",
      icon: "fa-magic"
    },
    {
      title: "Step 4: Review Threats",
      content: "Go to the Threats tab to review identified threats. Each threat includes risk level, mitigation, and detection strategies.",
      icon: "fa-exclamation-triangle"
    },
    {
      title: "Step 5: Analyze Risk",
      content: "The Risk Matrix shows threat distribution and risk levels. Use the heatmap to identify high-risk components.",
      icon: "fa-chart-bar"
    },
    {
      title: "Step 6: Check Compliance",
      content: "Map threats to compliance frameworks (NIST, ISO 27001, PCI-DSS) to ensure regulatory coverage.",
      icon: "fa-check-circle"
    },
    {
      title: "Step 7: Export Report",
      content: "Export your threat model as PDF, CSV, JSON, Markdown, or HTML for documentation and sharing.",
      icon: "fa-file-export"
    },
    {
      title: "You're Ready!",
      content: "Start creating professional threat models. Use Version History to track changes and Template Builder to save custom templates.",
      icon: "fa-rocket"
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>
            <i className={`fas ${currentStep.icon}`} style={{ marginRight: '0.5rem', color: 'var(--accent)' }}></i>
            {currentStep.title}
          </h2>
          <button onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            {currentStep.content}
          </p>

          {/* Progress */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Step {step + 1} of {steps.length}</span>
              <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
            </div>
            <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'var(--accent)',
                width: `${((step + 1) / steps.length) * 100}%`,
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
              <i className="fas fa-arrow-left"></i>
              Previous
            </button>
          )}
          {step < steps.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              Next
              <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              <i className="fas fa-check"></i>
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
