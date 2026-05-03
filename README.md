# ThreatModeler 🛡️

**Modern, production-ready threat modeling platform with PWA support**

Built for security architects, developers, and security teams. Runs entirely client-side with offline capabilities.

**🚀 Live Demo:** https://somil149.github.io/threat-modeler/  
**📦 Current Version:** v2.0.0  
**⭐ Latest:** PWA-enabled with offline support

---

## ✨ What's New in v2.0.0

### **🎉 Major Features**
- ✅ **PWA Support** - Install as desktop/mobile app
- ✅ **Offline Mode** - Works without internet connection
- ✅ **60+ Industry Threats** - OWASP Top 10, Cloud, API, Container security
- ✅ **Enhanced Search** - Search threats by keyword with severity filters
- ✅ **Collaboration** - Export/Import projects, shareable read-only links
- ✅ **Keyboard Shortcuts** - Ctrl+S to save, Ctrl+/ for help
- ✅ **10 Sample Diagrams** - Modern architectures ready to import

### **📚 New Threat Libraries**
- **OWASP Top 10 2021** - 30+ web application threats
- **Cloud Security** - AWS, Azure, GCP, Kubernetes threats
- **API Security** - OWASP API Top 10
- **Container Security** - Docker, K8s vulnerabilities

---

## 🚀 Features

### **Phase 1: Quick Wins**
- ✅ **Version History** - Save and restore up to 10 versions of your threat model
- ✅ **Template Builder** - Save projects as reusable templates
- ✅ **Search & Filter** - Fuzzy search across projects, threats, and components
- ✅ **Threat Heatmap** - Color-coded risk visualization on architecture diagram

### **Phase 2: Core Features**
- ✅ **Custom Architecture Builder** - 60+ components across 7 categories
  - Infrastructure, Compute, Data, AI/ML, Security, External, Monitoring
- ✅ **Drag-and-Drop Editor** - Visual architecture design with connect/delete modes
- ✅ **Attack Path Visualization** - See attack chains with risk scores
- ✅ **Compliance Mapping** - NIST CSF, ISO 27001, PCI-DSS
- ✅ **Interactive Tutorial** - 9-step guided walkthrough
- ✅ **Threat Status Tracking** - Mark threats as Open/Mitigated with comments

### **Phase 3: Advanced Features**
- ✅ **Threat Intelligence** - Real-time CVE data from NVD API
  - Filters by severity (HIGH/CRITICAL/MEDIUM 7.0+)
  - Matches CVEs to your specific threats
  - Relevance scoring with recency weighting
- ✅ **AI-Powered Suggestions** - Rule-based security recommendations
  - Missing security components
  - Threat coverage gaps
  - Unencrypted data flows
  - Incomplete mitigations
- ✅ **3D Architecture View** - Interactive Three.js visualization
  - Component shapes based on type
  - Auto-rotating 3D scene
  - Visual connections

### **Authentication & Security**
- ✅ **Firebase Authentication** - Multi-provider social login
  - Google, GitHub, Microsoft, Twitter
- ✅ **User Data Isolation** - Each user sees only their own projects
- ✅ **Secure Storage** - Data encrypted in localStorage

### **Export & Integration**
- ✅ **Multi-Format Export** - PDF, CSV, JSON, Markdown, HTML
- ✅ **Offline Support** - Works without internet (except Threat Intel)
- ✅ **Dark/Light Theme** - Toggle between themes

---

## 🎯 Use Cases

- **Web Applications** - API security, authentication flows, data protection
- **Mobile Apps** - Client-server communication, data storage, API integration
- **Microservices** - Service-to-service auth, API gateways, message queues
- **Cloud Architectures** - AWS/Azure/GCP deployments, serverless, containers
- **AI/ML Systems** - RAG pipelines, LLM applications, vector databases
- **Agent Systems** - Multi-agent orchestration, tool calling, memory stores

---

## 📋 Architecture Templates

1. **Custom Architecture** - Build from scratch with 60+ components
2. **Web Application** - Classic 3-tier web app
3. **Mobile App** - Mobile client with backend API
4. **API Gateway** - Microservices with API gateway
5. **Microservices** - Distributed microservices architecture
6. **Cloud Architecture** - Cloud-native deployment
7. **RAG System** - Retrieval-Augmented Generation pipeline
8. **LLM Application** - Large Language Model integration
9. **AI Agent System** - Multi-agent orchestration

---

## 🛠️ Technology Stack

- **Frontend:** React (CDN), Babel Standalone
- **Visualization:** D3.js, Three.js, Chart.js
- **Authentication:** Firebase Auth
- **Export:** jsPDF
- **APIs:** NVD CVE Database
- **Storage:** localStorage (with IndexedDB ready)
- **PWA:** Service Worker, Web App Manifest
- **Hosting:** GitHub Pages (static)

---

## 🚀 Quick Start

### **1. Access the App**
Visit: https://somil149.github.io/threat-modeler/

### **2. Install as App (Optional)**
**Desktop:** Click install icon (⊕) in address bar  
**Mobile:** Menu → "Add to Home Screen"

### **3. Login**
- Click "Continue with Google" (or other provider)
- Authenticate with your account

### **4. Create Your First Threat Model**

**Option A: Import Sample Diagram**
1. Click "Import Diagram"
2. Choose from 10 modern architectures
3. AI detects components automatically
4. Review and generate threats

**Option B: Build from Scratch**
1. Click "New Project"
2. Choose a template or "Custom Architecture"
3. Add components from 60+ library
4. Connect components with data flows
5. Click "Generate Threats"
6. Review and mitigate threats

### **5. Explore Advanced Features**
- **Search Threats:** Filter by keyword or severity
- **Threat Intel:** Get real-time CVE data
- **AI Suggestions:** Get security recommendations
- **3D View:** Visualize in 3D
- **Compliance:** Map to frameworks
- **Export:** Download reports (PDF/JSON/CSV)
- **Share:** Generate read-only link
- **Keyboard Shortcuts:** Press Ctrl+/ for help

---

## 🎯 Sample Architectures

**10 ready-to-use diagrams in `assets/sample-diagrams/`:**
1. E-commerce Microservices
2. AWS Serverless Architecture
3. Kubernetes Platform
4. IoT Platform
5. Banking System
6. AI/ML Platform
7. Healthcare System (HIPAA)
8. Social Media Platform
9. Video Streaming Platform
10. Blockchain DeFi Platform

---

## 🎓 Tutorial

Built-in interactive tutorial covers:
1. Creating projects
2. Adding components
3. Connecting flows
4. Generating threats
5. Risk assessment
6. Mitigation strategies
7. Compliance mapping
8. Export options
9. Advanced features

Click the **?** icon in the top right to start!

---

## 🔒 Security & Privacy

- **Client-Side Only:** All processing happens in your browser
- **No Backend:** No server-side code or databases
- **Data Ownership:** Your data stays in your browser
- **Firebase Auth:** Industry-standard authentication
- **User Isolation:** Each user's data is completely isolated
- **Open Source:** Full transparency, audit the code

---

## 🌟 Key Highlights

- **🎨 20 Architecture Templates** - Pre-built threat models
- **🧩 60+ Components** across 7 categories
- **🔍 100+ Threat Patterns** - STRIDE framework
- **📚 60+ Industry Threats** - OWASP, Cloud, API, Container
- **🔐 Real-time CVE Data** from NVD
- **🤖 AI-Powered Analysis** for security gaps
- **🎮 3D Visualization** with Three.js
- **🔑 Multi-Provider Auth** (Google, GitHub, Microsoft, Twitter)
- **✅ Compliance Ready** (NIST, ISO 27001, PCI-DSS, GDPR, OWASP)
- **📱 PWA Support** - Install as app, works offline
- **🔗 Collaboration** - Export/Import/Share projects
- **⌨️ Keyboard Shortcuts** - Power user features
- **🚀 Zero Backend** - Pure static hosting
- **📊 10 Sample Diagrams** - Modern architectures

---

## 📊 Threat Modeling Methodology

### **STRIDE Framework**
- **S**poofing - Identity verification threats
- **T**ampering - Data integrity threats
- **R**epudiation - Non-repudiation threats
- **I**nformation Disclosure - Confidentiality threats
- **D**enial of Service - Availability threats
- **E**levation of Privilege - Authorization threats

### **Risk Scoring**
```
Risk Score = Likelihood (1-5) × Impact (1-5)

Risk Levels:
- CRITICAL: >= 20
- HIGH: >= 12
- MEDIUM: >= 6
- LOW: < 6
```

---

## 🤝 Contributing

This is a production-ready application. For issues or feature requests:
1. Open an issue on GitHub
2. Describe the problem or feature
3. Include steps to reproduce (for bugs)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **NVD API** - National Vulnerability Database
- **Firebase** - Authentication platform
- **Three.js** - 3D visualization
- **D3.js** - Data visualization
- **React** - UI framework

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues
- **Testing:** See `docs/TESTING.md`

---

## 🎯 Roadmap

### **Completed ✅**
- **v1.0.0** - Phase 1-3: Core Features
- **v1.1.0** - Phase 4A: Collaboration (Export/Import/Share)
- **v1.2.0** - Phase 4B: Enhanced Threat Library (60+ threats)
- **v1.3.0** - Phase 4C: Keyboard Shortcuts & UX
- **v1.6.0** - Phase 6A: Testing Infrastructure
- **v1.7.0** - Phase 6B: Performance Optimization
- **v2.0.0** - Phase 7: PWA & Offline Support

### **Future Enhancements 🚀**
- Real-time collaboration
- Team workspaces
- CISA KEV integration
- MITRE ATT&CK mapping
- AI-powered threat prioritization
- Custom compliance frameworks
- Mobile app (native)

---

## 📚 Documentation

- **[Release Summary](RELEASE_SUMMARY.md)** - Complete v2.0.0 release notes
- **[Improvement Plan](IMPROVEMENT_PLAN.md)** - Phased development plan
- **[Testing Guide](docs/TESTING.md)** - Comprehensive test plan
- **[Performance Guide](docs/PERFORMANCE.md)** - Optimization strategies
- **[OAuth Setup](docs/OAUTH_SETUP.md)** - Firebase Auth configuration
- **[Deployment](docs/DEPLOYMENT.md)** - GitHub Pages deployment

---

## ⌨️ Keyboard Shortcuts

- **Ctrl+/** - Show shortcuts help
- **Ctrl+S** - Save project
- **Ctrl+E** - Export project
- **Ctrl+F** - Search threats
- **Escape** - Close modals

---

**Built with ❤️ for the security community**

**Live at:** https://somil149.github.io/threat-modeler/
