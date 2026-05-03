# ThreatModeler User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating Your First Threat Model](#creating-your-first-threat-model)
3. [Custom Architecture Builder](#custom-architecture-builder)
4. [Threat Management](#threat-management)
5. [Advanced Features](#advanced-features)
6. [Export & Reporting](#export--reporting)
7. [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### Login
1. Visit https://somil149.github.io/threat-modeler/
2. Click "Continue with Google" (or other provider)
3. Authenticate with your account
4. You'll see the Dashboard

### Dashboard Overview
- **New Project** button - Create a new threat model
- **Project Cards** - Your existing projects
- **Search Bar** - Find projects quickly
- **Theme Toggle** - Switch dark/light mode

---

## Creating Your First Threat Model

### Step 1: Choose a Template
1. Click "New Project"
2. Enter project name
3. Select a template:
   - **Custom Architecture** - Build from scratch
   - **Web Application** - 3-tier web app
   - **Mobile App** - Mobile + backend
   - **Microservices** - Distributed services
   - **RAG System** - AI/LLM pipeline
   - And more...

### Step 2: View Architecture
- Components appear on canvas
- Data flows shown as arrows
- Trust boundaries indicated

### Step 3: Generate Threats
1. Click "Generate Threats" button
2. STRIDE-based threats created automatically
3. Review threats in "Threats" view

### Step 4: Assess Risk
- Each threat has Likelihood (1-5) and Impact (1-5)
- Risk Score = Likelihood × Impact
- Color-coded: Red (Critical), Orange (High), Yellow (Medium), Green (Low)

### Step 5: Add Mitigations
1. Select a threat
2. Add mitigation strategy
3. Add detection method
4. Mark as "Mitigated" when complete

---

## Custom Architecture Builder

### Adding Components
1. Select "Custom Architecture" template
2. Browse component library (7 categories):
   - **Infrastructure:** Load Balancer, Firewall, WAF, CDN, Proxy, VPN, API Gateway
   - **Compute:** Web Server, App Server, Container, Kubernetes, Lambda, VM, Microservice
   - **Data:** SQL, NoSQL, Cache, Data Lake, Vector DB, S3, Queue, Blob Storage
   - **AI/ML:** LLM API, RAG Pipeline, Vector Search, Model Serving, Training, Agent, Embedding
   - **Security:** Identity Provider, Auth, Secrets Manager, HSM, SIEM, DLP, MFA
   - **External:** User, Mobile App, Browser, Third-Party API, Payment, Email, SMS
   - **Monitoring:** Logging, Metrics, APM, Alerting, Tracing
3. Click component to add to canvas
4. Drag to reposition

### Connecting Components
1. Click "Connect" button
2. Click source component
3. Click target component
4. Connection created with arrow
5. Click "Connect" again to exit mode

### Deleting Components
1. Click "Delete" button
2. Click component to remove
3. Component and its connections deleted
4. Click "Delete" again to exit mode

### Saving
1. Click "Save & Finalize"
2. Confirm in dialog
3. Architecture locked
4. Prompted to generate threats

---

## Threat Management

### Viewing Threats
- Navigate to "Threats" view
- See all identified threats
- Filter by STRIDE category
- Sort by risk score

### Threat Details
Each threat shows:
- **Title** - Brief description
- **Component** - Affected component
- **STRIDE** - Category (S/T/R/I/D/E)
- **Likelihood** - 1-5 scale
- **Impact** - 1-5 scale
- **Risk Score** - Calculated value
- **Description** - Detailed explanation
- **Mitigation** - How to prevent
- **Detection** - How to detect

### Updating Threat Status
1. Select threat
2. Choose status:
   - **Open** - Not yet addressed
   - **Mitigated** - Controls in place
3. Add comment explaining mitigation
4. Save changes

### Threat Heatmap
1. Go to "Architecture" view
2. Click "Show Heatmap"
3. Components colored by risk:
   - Red = High risk
   - Yellow = Medium risk
   - Green = Low risk

---

## Advanced Features

### Threat Intelligence
1. Navigate to "Threat Intel" view
2. Click "Fetch Latest CVEs"
3. Wait 30-60 seconds (fetches from NVD API)
4. Review CVEs matching your threats
5. Click CVE ID to view details on NVD
6. Use search to filter results

**What it shows:**
- HIGH/CRITICAL/MEDIUM (7.0+) severity CVEs
- Matched to your specific threats
- Sorted by relevance score
- Published dates and CVSS scores

### AI-Powered Suggestions
1. Navigate to "AI Suggestions" view
2. Click "Generate Suggestions"
3. Review recommendations:
   - **Architecture** - Missing security components
   - **Threats** - Coverage gaps
   - **Data Flow** - Unencrypted connections
   - **Mitigation** - Incomplete strategies
4. Filter by category
5. Apply suggestions (if available)

**Priority Levels:**
- **Critical** - Immediate action required
- **High** - Address soon
- **Medium** - Plan to address
- **Low** - Nice to have

### 3D Architecture View
1. Navigate to "3D View"
2. Click "Show 3D View"
3. Interactive 3D visualization appears
4. Auto-rotates for full view
5. Component shapes indicate type:
   - **Cylinders** - Databases
   - **Spheres** - Users/External
   - **Flat Boxes** - Firewalls/WAF
   - **Tall Boxes** - APIs/Gateways
   - **Cubes** - Other components

### Attack Paths
1. Navigate to "Attack Paths" view
2. See attack chain visualization
3. Review risk scores for each path
4. Identify critical paths to secure

### Compliance Mapping
1. Navigate to "Compliance" view
2. Select framework:
   - **NIST CSF** - Cybersecurity Framework
   - **ISO 27001** - Information Security
   - **PCI-DSS** - Payment Card Industry
3. See threats mapped to controls
4. Export compliance report

---

## Export & Reporting

### Export Formats
1. Navigate to "Export" view
2. Choose format:
   - **PDF** - Professional report
   - **CSV** - Spreadsheet data
   - **JSON** - Machine-readable
   - **Markdown** - Documentation
   - **HTML** - Web page
3. Click "Export"
4. File downloads automatically

### What's Included
- Project overview
- Architecture diagram
- All threats with details
- Risk matrix
- Mitigation strategies
- Compliance mappings

---

## Tips & Best Practices

### Threat Modeling
1. **Start Simple** - Use templates, customize later
2. **Focus on Data Flows** - Where data crosses trust boundaries
3. **Think Like an Attacker** - What would you exploit?
4. **Prioritize by Risk** - Address high-risk threats first
5. **Document Mitigations** - Be specific and actionable

### Using Components
1. **Trust Boundaries** - Group related components
2. **Label Clearly** - Use descriptive names
3. **Show All Flows** - Don't skip connections
4. **Include External** - Users, APIs, third-parties

### Threat Analysis
1. **Cover All STRIDE** - Don't skip categories
2. **Be Realistic** - Likelihood based on actual risk
3. **Consider Impact** - Business and technical
4. **Add Context** - Explain why it matters
5. **Track Status** - Keep mitigations updated

### Version Control
1. **Save Versions** - Before major changes
2. **Use Templates** - For similar projects
3. **Export Regularly** - Backup your work
4. **Document Changes** - Add comments

### Collaboration
1. **Export Reports** - Share with team
2. **Use Compliance** - Align with standards
3. **Review Regularly** - Threat models evolve
4. **Update Mitigations** - As controls change

---

## Keyboard Shortcuts

- **Ctrl/Cmd + S** - Save project
- **Ctrl/Cmd + F** - Search
- **Esc** - Exit connect/delete mode
- **?** - Open tutorial

---

## Troubleshooting

### App Not Loading
1. Clear browser cache (Ctrl+Shift+R)
2. Check internet connection
3. Try different browser
4. Check browser console (F12) for errors

### Login Issues
1. Ensure Firebase Auth is enabled
2. Check popup blockers
3. Try different provider
4. Clear cookies and retry

### Threat Intel Not Working
1. Check internet connection (requires NVD API)
2. Wait for rate limit (6 seconds between requests)
3. Check browser console for errors
4. Try again in a few minutes

### 3D View Not Rendering
1. Ensure WebGL is enabled in browser
2. Update graphics drivers
3. Try different browser
4. Check browser console for errors

### Data Not Saving
1. Check localStorage quota (5-10MB limit)
2. Clear old projects
3. Export important data
4. Check browser privacy settings

---

## FAQ

**Q: Is my data secure?**
A: Yes, all data is stored locally in your browser. Firebase Auth is only for identity.

**Q: Can I use offline?**
A: Yes, except Threat Intelligence (requires NVD API).

**Q: How many projects can I create?**
A: Limited by browser localStorage (typically 5-10MB).

**Q: Can I collaborate with others?**
A: Not yet - each user has isolated data. Export/import for sharing.

**Q: Is it free?**
A: Yes, completely free and open source.

**Q: What browsers are supported?**
A: Chrome, Firefox, Edge, Safari (latest versions).

**Q: Can I customize threat patterns?**
A: Not yet - uses built-in STRIDE patterns.

**Q: How often is CVE data updated?**
A: Real-time from NVD API when you fetch.

---

## Support

- **Documentation:** `/docs` folder
- **Issues:** GitHub Issues
- **Testing:** `docs/TESTING.md`

---

**Happy Threat Modeling! 🛡️**
