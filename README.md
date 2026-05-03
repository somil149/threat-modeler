# 🛡️ ThreatModeler

> Modern, client-side threat modeling web application for security architects

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://yourusername.github.io/threat-modeler)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Overview

ThreatModeler is a production-ready, fully client-side threat modeling application that runs entirely on GitHub Pages. No backend required.

**Supports threat modeling for:**
- Web Applications
- Mobile Applications
- APIs & Microservices
- Cloud Architectures
- RAG (Retrieval Augmented Generation) systems
- LLM-based applications
- AI Agent systems

## ✨ Features

- 🎨 **Visual Modeling** - Drag-and-drop architecture diagrams
- 🤖 **Automated Threat Generation** - STRIDE, OWASP Top 10, AI/LLM threats
- 📊 **Risk Scoring** - Deterministic risk calculation and heatmaps
- 📦 **Templates** - Pre-built templates for common architectures
- 🔄 **Attack Path Simulation** - Visualize attack chains
- 📤 **Export** - PDF, CSV, JSON, Markdown, HTML
- 💾 **Local Storage** - No backend, all data stored locally
- 🌓 **Dark/Light Mode** - Modern, clean UI
- 📱 **Responsive** - Works on desktop and mobile

## 🚀 Quick Start

### Option 1: Use Live Demo
Visit: [https://yourusername.github.io/threat-modeler](https://yourusername.github.io/threat-modeler)

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/threat-modeler.git
cd threat-modeler

# Open in browser
open index.html

# Or use a local server
python -m http.server 8000
# Visit http://localhost:8000
```

## 📁 Project Structure

```
threat-modeler/
├── index.html              # Main entry point
├── styles.css              # Global styles
├── app.js                  # Main application logic
├── components/             # UI components
│   ├── Dashboard.js
│   ├── ArchitectureCanvas.js
│   ├── ThreatList.js
│   ├── RiskMatrix.js
│   └── ExportPanel.js
├── data/                   # Templates and patterns
│   ├── templates.json
│   ├── threat-patterns.json
│   └── stride-mappings.json
├── utils/                  # Utility functions
│   ├── export.js
│   ├── scoring.js
│   ├── graph.js
│   └── storage.js
└── docs/                   # Documentation
    ├── PROJECT_SPEC.md
    ├── DEPLOYMENT.md
    └── USER_GUIDE.md
```

## 🎓 How to Use

1. **Select a Template** - Choose from pre-built architecture templates
2. **Customize Architecture** - Add/remove components, define data flows
3. **Generate Threats** - Auto-generate threats using STRIDE and OWASP
4. **Review & Edit** - Adjust risk scores, add custom threats
5. **Analyze Attack Paths** - Visualize potential attack chains
6. **Export Report** - Generate PDF, CSV, or other formats

## 🔧 Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **UI Framework:** React (CDN-based, no build step)
- **Visualization:** D3.js / Cytoscape.js
- **Export:** jsPDF
- **Storage:** localStorage / IndexedDB
- **Hosting:** GitHub Pages

## 📊 Threat Frameworks

- **STRIDE** - Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege
- **OWASP Top 10** - Web application security risks
- **OWASP API Top 10** - API security risks
- **Cloud Security** - Misconfigurations and vulnerabilities
- **AI/LLM Threats** - Prompt injection, data leakage, model poisoning

## 🚢 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source: `main` branch
4. Save and wait for deployment
5. Access at: `https://yourusername.github.io/threat-modeler`

### Custom Domain

1. Add `CNAME` file with your domain
2. Configure DNS settings
3. Enable HTTPS in GitHub Pages settings

## 📖 Documentation

- [Project Specification](docs/PROJECT_SPEC.md) - Complete feature specification
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment instructions
- [User Guide](docs/USER_GUIDE.md) - How to use the application

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Inspired by [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/)
- Built for security architects and developers
- Designed for GitHub Pages compatibility

## 📧 Contact

- **Author:** Your Name
- **Email:** your.email@example.com
- **LinkedIn:** [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **Portfolio:** [Your Portfolio](https://yourportfolio.com)

---

**⭐ Star this repository if you find it useful!**
