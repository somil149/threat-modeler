# ThreatModeler 🛡️

Modern, production-ready threat modeling web application that runs entirely on GitHub Pages. Built for security architects, developers, and security teams.

**Live Demo:** https://somil149.github.io/threat-modeler/

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
- **Storage:** localStorage, IndexedDB
- **Hosting:** GitHub Pages (static)

---

## 🚀 Quick Start

### **1. Access the App**
Visit: https://somil149.github.io/threat-modeler/

### **2. Login**
- Click "Continue with Google" (or other provider)
- Authenticate with your account

### **3. Create Your First Threat Model**
1. Click "New Project"
2. Choose a template or "Custom Architecture"
3. Add components from the library
4. Connect components with data flows
5. Click "Generate Threats"
6. Review and mitigate threats

### **4. Explore Advanced Features**
- **Threat Intel:** Get real-time CVE data
- **AI Suggestions:** Get security recommendations
- **3D View:** Visualize in 3D
- **Compliance:** Map to frameworks
- **Export:** Download reports

---

## 📖 Documentation

- **[Testing Guide](docs/TESTING.md)** - Comprehensive test plan
- **[OAuth Setup](docs/OAUTH_SETUP.md)** - Firebase Auth configuration
- **[Deployment](docs/DEPLOYMENT.md)** - GitHub Pages deployment
- **[Project Spec](docs/PROJECT_SPEC.md)** - Full specification

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

- **60+ Components** across 7 categories
- **15+ Major Features** across 3 phases
- **Real-time CVE Data** from NVD
- **AI-Powered Analysis** for security gaps
- **3D Visualization** with Three.js
- **Multi-Provider Auth** (Google, GitHub, Microsoft, Twitter)
- **Compliance Ready** (NIST, ISO 27001, PCI-DSS)
- **Fully Offline** (except Threat Intel)
- **Zero Backend** - Pure static hosting

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
- Phase 1: Quick Wins
- Phase 2: Core Features
- Phase 3: Advanced Features
- Firebase Authentication
- User Data Isolation

### **Future Enhancements 🚀**
- Real-time collaboration
- Team workspaces
- Advanced AI with LLM integration
- Custom compliance frameworks
- API for integrations
- Mobile app

---

**Built with ❤️ for the security community**

**Live at:** https://somil149.github.io/threat-modeler/
