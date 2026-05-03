# ThreatModeler - Complete Project Documentation

## Project Overview
**Live URL:** https://somil149.github.io/threat-modeler/
**Repository:** https://github.com/somil149/threat-modeler
**Status:** Production-ready, fully deployed

## Architecture

### Frontend (GitHub Pages)
- Pure static site - no backend required
- React (CDN) + D3.js + Three.js + Chart.js
- Firebase Authentication (multi-provider)
- localStorage for data persistence

### Serverless Backend
- **Cloudflare Worker:** `https://threat-modeler.goyal-somil2011.workers.dev`
- Proxies requests to Google Gemini API
- Handles CORS and API key management

## Key Features

### 1. Authentication
- **Firebase Project:** threat-modeler2026
- **Providers:** Google, GitHub, Microsoft, Twitter
- **User Isolation:** Each user's data is completely isolated
- **Config:** `utils/firebase-auth.js`

### 2. Templates (20 Total)
1. Custom Architecture
2. Web Application (3-Tier)
3. Mobile Application
4. Microservices Architecture
5. RAG Pipeline
6. LLM Application
7. AI Agent System
8. Cloud-Native (AWS)
9. CI/CD Pipeline
10. Zero Trust Architecture
11. Single Page Application (SPA)
12. Serverless Architecture
13. Payment Gateway
14. IoT Device Management
15. Single Sign-On (SSO)
16. E-commerce Platform
17. ML Training Pipeline
18. GraphQL API
19. Event-Driven Architecture
20. Data Lake Architecture

### 3. AI-Powered Diagram Import
- **Model:** Google Gemini 2.5 Flash
- **Cloudflare Worker:** Proxies API calls
- **Free Tier:** 1500 requests/day
- **Cost:** $0.00025 per image (if exceeding free tier)
- **Rate Limit:** 5 uses/day per user (demo)

### 4. Threat Modeling
- **STRIDE Framework:** All 6 categories
- **Auto-generation:** 5-10 threats per component
- **Custom threats:** User can add/edit
- **Status tracking:** Not Started, In Progress, Completed, Accepted

### 5. Advanced Features
- **Threat Intelligence:** NVD API integration (CVE matching)
- **AI Suggestions:** Rule-based security recommendations
- **3D Visualization:** Three.js interactive view
- **Attack Paths:** Graph-based attack chain analysis
- **Mitigations:** Expandable mitigation section per attack path
- **Risk Matrix:** Visual risk assessment
- **Compliance:** OWASP, NIST, PCI-DSS, GDPR, ISO 27001
- **Export:** PDF, JSON, CSV

## Technical Stack

### Frontend Libraries
```html
<!-- React -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Babel for JSX -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- Visualization -->
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Export -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
```

### File Structure
```
threat-modeler/
├── index.html                          # Main entry point
├── app.js                              # React app with routing
├── styles.css                          # Dark/light theme
├── components/
│   ├── Dashboard.js                    # Project list
│   ├── DiagramImport.js                # AI-powered import
│   ├── CustomArchitectureBuilder.js    # Canvas editor
│   ├── ArchitectureCanvas.js           # Template viewer
│   ├── ThreatList.js                   # Threat management
│   ├── ThreatIntelligence.js           # NVD CVE integration
│   ├── AISuggestions.js                # Security recommendations
│   ├── Architecture3D.js               # Three.js 3D view
│   ├── AttackPaths.js                  # Attack chain analysis
│   ├── RiskMatrix.js                   # Risk visualization
│   ├── Compliance.js                   # Framework mapping
│   ├── ExportPanel.js                  # Export functionality
│   ├── SearchFilter.js                 # Search/filter UI
│   └── Tutorial.js                     # Onboarding
├── utils/
│   ├── firebase-auth.js                # Multi-provider auth
│   ├── storage.js                      # User-isolated storage
│   ├── scoring.js                      # Risk calculations
│   ├── graph.js                        # Attack path generation
│   └── export.js                       # Export utilities
├── data/
│   ├── templates.json                  # 20 architecture templates
│   ├── threat-patterns.json            # STRIDE patterns
│   ├── compliance.json                 # Framework mappings
│   └── component-library.json          # 60+ components
├── assets/
│   └── sample-diagrams/                # 3 sample SVG diagrams
│       ├── web-app.svg
│       ├── microservices.svg
│       └── cloud-aws.svg
├── cloudflare-worker.js                # Gemini API proxy
├── wrangler.toml                       # Cloudflare config
└── docs/
    ├── README.md
    ├── TESTING.md
    ├── USER_GUIDE.md
    ├── OAUTH_SETUP.md
    ├── DEPLOYMENT.md
    └── TEMPLATE_EXPANSION.md
```

## Configuration

### Firebase (Authentication)
```javascript
// Project: threat-modeler2026
{
  apiKey: "AIzaSyDyTiagxBNth4Vf-yCySRnrMBh71vEygFM",
  authDomain: "threat-modeler2026.firebaseapp.com",
  projectId: "threat-modeler2026",
  storageBucket: "threat-modeler2026.firebasestorage.app",
  messagingSenderId: "750163991791",
  appId: "1:750163991791:web:2452c3fd2e3a17db604f1a"
}
```

### Cloudflare Worker
- **URL:** https://threat-modeler.goyal-somil2011.workers.dev
- **Environment Variables:**
  - `GEMINI_API_KEY`: Your Google Gemini API key
- **Model:** gemini-2.5-flash
- **Auto-deploys:** From GitHub on push to master

### Google Gemini API
- **API Key:** Get from https://aistudio.google.com/app/apikey
- **Free Tier:** 1500 requests/day
- **Paid:** $0.00025 per image
- **Model:** gemini-2.5-flash (vision-capable)

## Key Workflows

### 1. Custom Architecture
1. Select "Custom Architecture" template
2. Add components from library (60+ available)
3. Connect components (Connect mode)
4. Delete unwanted (Delete mode)
5. Click "Save & Finalize"
6. Threats auto-generated (5-10 per component)
7. Can "Unlock & Edit" to modify
8. Re-finalize to regenerate threats

### 2. AI Diagram Import
1. Click "Import Diagram"
2. Upload diagram image (PNG/JPG/SVG)
3. Choose:
   - **Try Demo** (5/day limit)
   - **Use My Key** (unlimited with your Gemini key)
   - **Skip AI** (8-component starter template)
4. AI detects components and flows
5. Preview and confirm
6. Import to canvas
7. Customize and finalize

### 3. Threat Analysis
1. Generate threats (auto or manual)
2. Review in Threat List
3. Check Threat Intelligence for CVEs
4. Review AI Suggestions
5. Analyze Attack Paths with mitigations
6. View Risk Matrix
7. Map to Compliance frameworks
8. Export report

## Important Code Patterns

### User Data Isolation
```javascript
// Storage keys are namespaced by user ID
getUserKey(baseKey) {
  const userId = FirebaseAuth.getUser()?.id;
  return `${baseKey}_user_${userId}`;
}
// Examples:
// threatmodeler_projects_user_abc123
// threatmodeler_current_user_abc123
```

### Threat-Component Mapping
```javascript
// Threats use component.id for matching
{
  id: `threat_${component.id}_spoofing`,
  component: component.id,  // ID for matching
  componentName: component.name,  // Name for display
  stride: 'S',
  // ...
}
```

### Attack Path Generation
```javascript
// Entry points: trustBoundary='external' OR type/name contains user/browser/mobile
// Targets: type/name contains database/api/service/storage
// Matching: threats.filter(t => path.includes(t.component))
```

## Deployment

### GitHub Pages
```bash
# Automatic deployment on push to master
git push origin master
# Wait 1-2 minutes for GitHub Actions to build
# Live at: https://somil149.github.io/threat-modeler/
```

### Cloudflare Worker
```bash
# Automatic deployment from GitHub
# Or manual: npx wrangler deploy
```

## Troubleshooting

### Common Issues

**1. Attack Paths Not Generating**
- Ensure threats have `component` field with component ID
- Check console for "Attack chain analysis" logs
- Verify components have proper trust boundaries

**2. AI Detection Fails**
- Check Cloudflare Worker logs
- Verify GEMINI_API_KEY environment variable is set
- Ensure API key has Generative Language API enabled
- Model must be: gemini-2.5-flash

**3. Authentication Issues**
- Check Firebase console for enabled providers
- Verify authorized domains include: somil149.github.io
- Clear localStorage and re-login

**4. Threats Not Auto-Generating**
- Custom architecture: Auto-generates on "Save & Finalize"
- Pre-built templates: Click "Generate Threats" button
- Check component types match detection logic

## Future Enhancements

### Planned Features
- Real-time collaboration
- Team workspaces
- Advanced AI with LLM integration
- Custom compliance frameworks
- Mobile app
- Offline support with service workers
- IndexedDB for large projects
- Template categories UI with search
- More templates (target: 40-50 total)

### Performance Optimizations
- Lazy loading for 3D view
- Optimize NVD API calls
- Service worker for offline support
- IndexedDB for large projects

## Maintenance

### Regular Tasks
- Monitor Gemini API usage
- Update templates based on user feedback
- Keep threat patterns current
- Update CVE database integration
- Review and update compliance mappings

### Security
- Rotate API keys periodically
- Monitor Cloudflare Worker logs
- Review Firebase Auth settings
- Keep dependencies updated

## Support & Resources

### Documentation
- Main README: `/README.md`
- Testing Guide: `/docs/TESTING.md`
- User Guide: `/docs/USER_GUIDE.md`
- OAuth Setup: `/docs/OAUTH_SETUP.md`
- Deployment: `/docs/DEPLOYMENT.md`
- Template Expansion: `/docs/TEMPLATE_EXPANSION.md`

### External Resources
- Firebase Console: https://console.firebase.google.com/
- Cloudflare Dashboard: https://dash.cloudflare.com/
- Google AI Studio: https://aistudio.google.com/
- GitHub Repository: https://github.com/somil149/threat-modeler

## Credits
- Built with React, D3.js, Three.js, Chart.js
- Powered by Google Gemini AI
- Hosted on GitHub Pages
- Serverless proxy on Cloudflare Workers
- Authentication by Firebase

---

**Last Updated:** 2026-05-03
**Version:** 1.0
**Status:** Production Ready ✅
