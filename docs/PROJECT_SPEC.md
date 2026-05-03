# Threat Modeling Web Application - Master Specification

## Project Overview

**Project Name:** ThreatModeler  
**Type:** Static Web Application (GitHub Pages Compatible)  
**Purpose:** Modern, production-ready threat modeling tool for security architects  
**Tech Stack:** HTML5, CSS3, JavaScript (ES6+), React (CDN), D3.js/Cytoscape.js  

---

## Role & Objective

Build a complete modern, production-ready Threat Modeling Web Application that runs entirely on GitHub Pages (static hosting only).

The application must be visually modern, highly interactive, and capable of modeling threats for:

- Web Applications
- Mobile Applications
- APIs / Microservices
- Cloud Architectures
- RAG (Retrieval Augmented Generation) systems
- LLM-based applications
- AI Agent systems

---

## Hard Constraints (CRITICAL)

### Must NOT Have:
- ❌ NO backend
- ❌ NO server-side code
- ❌ NO external APIs required for core functionality

### Must Have:
- ✅ MUST run on GitHub Pages
- ✅ MUST work offline after initial load
- ✅ All logic must run in browser

### Allowed Technologies:
- HTML5, CSS3, JavaScript (ES6+)
- React (CDN only, no build step required)
- D3.js / Cytoscape.js / Chart.js
- jsPDF for PDF export

### Storage:
- localStorage (primary)
- IndexedDB (optional)
- JSON import/export

---

## Core Features

### 1. Template-Driven Threat Modeling

**Pre-built Templates:**
- Web App (3-tier architecture)
- Mobile App (API backend)
- Microservices architecture
- Cloud-native (AWS/Azure style)
- RAG pipeline
- LLM application
- AI Agent system
- CI/CD pipeline
- Zero Trust architecture

**Each Template Includes:**
- Predefined components
- Predefined data flows
- Predefined trust boundaries
- Predefined threat patterns

**User Capabilities:**
- Select template
- Auto-generate threat model
- Modify architecture visually

---

### 2. Automated Threat Generation Engine

**Threat Frameworks:**
- STRIDE
- OWASP Top 10
- OWASP API Top 10
- Cloud security misconfigurations
- AI/LLM threats:
  - Prompt injection
  - Data leakage
  - Model poisoning
  - Tool abuse
  - Agent manipulation

**Each Threat Includes:**
- Description
- Affected component
- STRIDE category
- Risk score
- Mitigation
- Detection idea

---

### 3. Interactive Editing

**User Can:**
- Add/remove components
- Edit threats
- Adjust risk scores
- Add custom threats
- Modify data flows
- Define trust boundaries

---

### 4. Visual Modeling (Like OWASP Threat Dragon)

**Features:**
- Drag-and-drop diagram canvas
- Nodes (services, DBs, users, APIs)
- Edges (data flows)
- Trust boundaries

**Technology:**
- SVG / Canvas
- D3.js or Cytoscape.js

---

### 5. Attack Path Simulation

**Generate:**
- Attack chains
- Lateral movement paths
- Privilege escalation
- Data exfiltration paths

**Representation:**
- Graph format (nodes + edges JSON)

---

### 6. Risk Scoring Engine

**Formula:**
```
Risk = Likelihood (1–5) × Impact (1–5)
```

**Display:**
- Risk heatmap
- Severity levels

---

### 7. Export System (Client-Side Only)

**Export Formats:**
- PDF report (Executive + Technical)
- CSV (threat table)
- JSON (full model)
- Markdown (documentation)
- HTML (shareable report)

**Technology:**
- jsPDF
- Blob downloads

---

### 8. Local User System (NO BACKEND)

**Features:**
- Username + passphrase stored in localStorage
- Profile-based project saving
- Multiple projects per user

**Important:**
- Clearly label as "Local Profile (Not Secure Auth)"
- Optional: GitHub OAuth (client-side only, optional enhancement)

---

### 9. Project Management

**User Can:**
- Create new project
- Load existing project
- Export/import project JSON
- Version snapshots (local)

---

### 10. UI/UX Requirements

**Design Inspiration:**
- Notion + Figma + OWASP Threat Dragon

**Features:**
- Clean dashboard layout
- Dark mode + Light mode
- Sidebar navigation
- Tab-based workflow:
  - Architecture
  - Threats
  - Attack Paths
  - Risk Dashboard
  - Export

---

### 11. Performance Constraints

- No heavy ML models
- No large datasets (>5MB)
- Use Web Workers if needed
- Fast load on GitHub Pages

---

## Project Structure

```
threat-modeler/
├── index.html
├── styles.css
├── app.js
├── components/
│   ├── Dashboard.js
│   ├── ArchitectureCanvas.js
│   ├── ThreatList.js
│   ├── RiskMatrix.js
│   └── ExportPanel.js
├── data/
│   ├── templates.json
│   ├── threat-patterns.json
│   └── stride-mappings.json
├── utils/
│   ├── export.js
│   ├── scoring.js
│   ├── graph.js
│   └── storage.js
├── assets/
│   ├── icons/
│   └── images/
├── docs/
│   ├── PROJECT_SPEC.md
│   ├── DEPLOYMENT.md
│   └── USER_GUIDE.md
└── README.md
```

---

## Development Guidelines

### NO HALLUCINATION RULE
- Do NOT invent CVEs
- Do NOT invent MITRE IDs
- Use generic but realistic threats
- If unsure → mark as "GENERIC THREAT PATTERN"

### Code Quality
- Clean, modular code
- Comments for complex logic
- Consistent naming conventions
- Error handling

---

## Deployment

### Local Development
```bash
# Clone repository
git clone https://github.com/username/threat-modeler.git
cd threat-modeler

# Open in browser
open index.html
# or
python -m http.server 8000
```

### GitHub Pages Deployment
```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository
# Push to GitHub
git remote add origin https://github.com/username/threat-modeler.git
git push -u origin main

# Enable GitHub Pages
# Settings → Pages → Source: main branch
```

### GitHub Actions (Optional)
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## Output Deliverables

1. ✅ Complete working frontend code
2. ✅ Sample templates JSON
3. ✅ Threat generation logic
4. ✅ UI layout
5. ✅ Export functionality
6. ✅ Instructions to run + deploy

---

## Final Goal

Deliver a fully functional:

→ Modern Threat Modeling Web App  
→ Inspired by OWASP Threat Dragon  
→ Supporting AI/LLM/RAG systems  
→ Fully client-side  
→ GitHub Pages deployable  
→ Portfolio-ready Security Architect project  

---

## Success Criteria

- [ ] All templates load and generate threats
- [ ] Visual diagram editor works
- [ ] Risk scoring calculates correctly
- [ ] All export formats work
- [ ] Local storage persists data
- [ ] Works on GitHub Pages
- [ ] Mobile responsive
- [ ] Dark/light mode functional
- [ ] No console errors
- [ ] Professional UI/UX

---

**Last Updated:** 2026-05-03  
**Version:** 1.0  
**Status:** Ready for Implementation
