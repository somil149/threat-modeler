// ========================================
// About Component
// ========================================

function About() {
  const features = [
    { icon: 'fa-project-diagram', label: 'Visual Architecture Builder', desc: '60+ components across 7 categories with drag-and-drop canvas' },
    { icon: 'fa-exclamation-triangle', label: 'STRIDE Threat Engine', desc: 'Auto-generates threats from your architecture using STRIDE framework' },
    { icon: 'fa-shield-virus', label: 'Real-Time Threat Intel', desc: 'Live CVE data from NVD matched to your specific threats' },
    { icon: 'fa-magic', label: 'AI-Powered Suggestions', desc: 'Rule-based analysis detects security gaps and missing controls' },
    { icon: 'fa-cube', label: '3D Architecture View', desc: 'Interactive Three.js visualization of your system components' },
    { icon: 'fa-check-circle', label: 'Compliance Mapping', desc: 'Maps threats to NIST CSF, ISO 27001, PCI-DSS, and OWASP' },
    { icon: 'fa-route', label: 'Attack Path Analysis', desc: 'Visualizes attack chains and calculates risk scores' },
    { icon: 'fa-file-export', label: 'Multi-Format Export', desc: 'Export reports as PDF, CSV, JSON, Markdown, or HTML' },
    { icon: 'fa-wifi', label: 'Offline-First PWA', desc: 'Install as a desktop/mobile app — works without internet' },
    { icon: 'fa-lock', label: 'Zero Backend', desc: 'All data stays in your browser — no servers, no data leaks' },
  ];

  const stack = [
    { name: 'React 18', icon: 'fa-atom', color: '#61dafb', desc: 'UI framework (CDN + Babel)' },
    { name: 'D3.js v7', icon: 'fa-chart-line', color: '#f9a03c', desc: 'Architecture canvas & graphs' },
    { name: 'Three.js', icon: 'fa-cube', color: '#049ef4', desc: '3D visualization' },
    { name: 'Chart.js', icon: 'fa-chart-bar', color: '#ff6384', desc: 'Risk matrix charts' },
    { name: 'Firebase Auth', icon: 'fa-fire', color: '#ffca28', desc: 'Multi-provider authentication' },
    { name: 'NVD API', icon: 'fa-database', color: '#10b981', desc: 'Real-time CVE threat intel' },
    { name: 'jsPDF', icon: 'fa-file-pdf', color: '#ef4444', desc: 'PDF report generation' },
    { name: 'GitHub Pages', icon: 'fab fa-github', color: '#9ca3af', desc: 'Static hosting' },
  ];

  const roadmap = [
    { status: 'done', label: 'PWA & Offline Support (v2.0.0)' },
    { status: 'done', label: 'Enhanced Threat Library — 60+ threats' },
    { status: 'done', label: 'Keyboard Shortcuts & UX polish' },
    { status: 'planned', label: 'Real-time collaboration & team workspaces' },
    { status: 'planned', label: 'MITRE ATT&CK framework mapping' },
    { status: 'planned', label: 'CISA KEV integration' },
    { status: 'planned', label: 'AI-powered threat prioritization' },
    { status: 'planned', label: 'Custom compliance frameworks' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', overflowY: 'auto', height: '100%' }}>

      {/* Hero */}
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))' }}>
        <i className="fas fa-shield-alt" style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem', display: 'block' }}></i>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>ThreatModeler</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
          Modern, production-ready threat modeling — entirely in your browser
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: 'var(--accent)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>v2.0.0</span>
          <span style={{ background: 'var(--success)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem' }}>PWA Ready</span>
          <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>MIT License</span>
          <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>Zero Backend</span>
        </div>
      </div>

      {/* Problem */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-exclamation-circle" style={{ color: 'var(--danger)' }}></i> The Problem
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
          Threat modeling is one of the most effective security practices — yet most teams skip it. Existing tools are either expensive enterprise software, require complex setup, or demand security expertise that most developers don't have.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Security vulnerabilities are increasingly costly. The average data breach costs <strong style={{ color: 'var(--text-primary)' }}>$4.45M</strong> (IBM 2023), and most breaches exploit threats that could have been identified during design — not after deployment.
        </p>
      </div>

      {/* Solution */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-lightbulb" style={{ color: 'var(--warning)' }}></i> How We Solve It
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { icon: 'fa-eye', color: 'var(--accent)', title: 'Visual-First', desc: 'Draw your architecture, threats are generated automatically — no security expertise required to get started.' },
            { icon: 'fa-brain', color: 'var(--success)', title: 'STRIDE + AI', desc: 'Industry-standard STRIDE methodology combined with rule-based AI to surface gaps you might miss.' },
            { icon: 'fa-bolt', color: 'var(--warning)', title: 'Instant & Free', desc: 'No signup friction, no SaaS fees, no data leaving your machine. Open in browser and start in seconds.' },
            { icon: 'fa-globe', color: 'var(--info)', title: 'Works Everywhere', desc: 'PWA support means it installs as a native-like app and works fully offline — even on a plane.' },
          ].map(item => (
            <div key={item.title} style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '1rem' }}>
              <i className={`fas ${item.icon}`} style={{ color: item.color, fontSize: '1.25rem', marginBottom: '0.5rem', display: 'block' }}></i>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-star" style={{ color: 'var(--warning)' }}></i> Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {features.map(f => (
            <div key={f.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <i className={`fas ${f.icon}`} style={{ color: 'var(--accent)', marginTop: '2px', width: '16px', flexShrink: 0 }}></i>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-flask" style={{ color: 'var(--info)' }}></i> Methodology
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>STRIDE Framework</h3>
            {[
              { letter: 'S', label: 'Spoofing', desc: 'Identity verification threats' },
              { letter: 'T', label: 'Tampering', desc: 'Data integrity threats' },
              { letter: 'R', label: 'Repudiation', desc: 'Non-repudiation threats' },
              { letter: 'I', label: 'Information Disclosure', desc: 'Confidentiality threats' },
              { letter: 'D', label: 'Denial of Service', desc: 'Availability threats' },
              { letter: 'E', label: 'Elevation of Privilege', desc: 'Authorization threats' },
            ].map(s => (
              <div key={s.letter} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ background: 'var(--accent)', color: '#fff', width: '22px', height: '22px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{s.letter}</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', minWidth: '140px' }}>{s.label}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.desc}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Risk Scoring</h3>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <div style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Risk Score = Likelihood × Impact</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Both rated 1–5</div>
            </div>
            {[
              { level: 'CRITICAL', range: '≥ 20', color: 'var(--danger)' },
              { level: 'HIGH', range: '≥ 12', color: '#f97316' },
              { level: 'MEDIUM', range: '≥ 6', color: 'var(--warning)' },
              { level: 'LOW', range: '< 6', color: 'var(--success)' },
            ].map(r => (
              <div key={r.level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <span style={{ background: r.color, color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, minWidth: '70px', textAlign: 'center' }}>{r.level}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Score {r.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-layer-group" style={{ color: 'var(--accent)' }}></i> Tech Stack
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {stack.map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <i className={`fas ${t.icon}`} style={{ color: t.color, fontSize: '1.1rem', width: '18px' }}></i>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Built By */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-user-circle" style={{ color: 'var(--success)' }}></i> Built By
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <img
            src="https://github.com/somil149.png"
            alt="somil149"
            style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid var(--accent)' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.15rem' }}>Somil Goyal</div>
            <div style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Senior Security Architect</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
              Aiming to solve real-world security problems and scale without investing too much on paid security toolings — strategically. ThreatModeler was built to make professional threat modeling accessible to every developer and security team.
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="mailto:goyal.somil2011@gmail.com"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>
                <i className="fas fa-envelope"></i> goyal.somil2011@gmail.com
              </a>
              <a href="https://github.com/somil149/threat-modeler" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                <i className="fab fa-github"></i> GitHub
              </a>
              <a href="https://somil149.github.io/threat-modeler/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                <i className="fas fa-external-link-alt"></i> Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-map-signs" style={{ color: 'var(--warning)' }}></i> Roadmap
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {roadmap.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className={`fas ${item.status === 'done' ? 'fa-check-circle' : 'fa-circle'}`}
                style={{ color: item.status === 'done' ? 'var(--success)' : 'var(--border)', fontSize: '0.9rem', width: '16px' }}></i>
              <span style={{ color: item.status === 'done' ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Open Source */}
      <div className="card" style={{ textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))' }}>
        <i className="fas fa-heart" style={{ color: 'var(--danger)', fontSize: '1.5rem', marginBottom: '0.75rem', display: 'block' }}></i>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Open Source & Free Forever</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
          ThreatModeler is MIT licensed. Use it, fork it, contribute to it. Built with ❤️ for the security community.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://github.com/somil149/threat-modeler" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent)', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            <i className="fab fa-github"></i> View on GitHub
          </a>
          <a href="https://github.com/somil149/threat-modeler/issues" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '0.6rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', border: '1px solid var(--border)' }}>
            <i className="fas fa-bug"></i> Report an Issue
          </a>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '1.5rem 0' }}>
        ThreatModeler v2.0.0 · MIT License · Built for the security community
      </div>
    </div>
  );
}
