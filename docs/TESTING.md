# ThreatModeler Testing Guide

## Test Environment
- **URL:** https://somil149.github.io/threat-modeler/
- **Browser:** Chrome/Firefox/Edge (latest)
- **Requirements:** Firebase Auth enabled (Google provider)

---

## Phase 1: Quick Wins Testing

### ✅ Test 1: Version History
1. Create a new project
2. Add 2-3 components
3. Click version history icon (top right)
4. Make changes to the project
5. Save and check version history again
6. Restore a previous version
7. **Expected:** Project reverts to previous state

### ✅ Test 2: Template Builder
1. Create a custom architecture
2. Add 5+ components and connect them
3. Click "Save as Template" icon
4. Go to Dashboard
5. Create new project from your custom template
6. **Expected:** New project has same architecture

### ✅ Test 3: Search & Filter
1. Create multiple projects
2. Use search bar to find specific project
3. Search for component names
4. Search for threat keywords
5. **Expected:** Fuzzy search returns relevant results

### ✅ Test 4: Threat Heatmap
1. Open a project with threats
2. Generate threats if none exist
3. Toggle "Show Heatmap" button
4. **Expected:** Components colored by risk level (red=high, yellow=medium, green=low)

---

## Phase 2: Core Features Testing

### ✅ Test 5: Custom Architecture Builder
1. Create new project → Select "Custom Architecture"
2. Browse component library (7 categories)
3. Click components to add to canvas
4. Drag components to reposition
5. Click "Connect" → Select source → Select target
6. Click "Delete" → Click component to remove
7. Click "Save & Finalize"
8. **Expected:** Architecture saved, prompted to generate threats

### ✅ Test 6: Attack Path Visualization
1. Open project with threats
2. Navigate to "Attack Paths" view
3. Review attack chains
4. Check risk scores
5. **Expected:** Visual graph showing attack progression

### ✅ Test 7: Compliance Mapping
1. Navigate to "Compliance" view
2. Review NIST CSF mappings
3. Check ISO 27001 controls
4. Review PCI-DSS requirements
5. **Expected:** Threats mapped to compliance frameworks

### ✅ Test 8: Interactive Tutorial
1. Click tutorial icon (top right)
2. Follow 9-step walkthrough
3. Complete each step
4. **Expected:** Guided tour of all features

### ✅ Test 9: Threat Status Tracking
1. Open "Threats" view
2. Select a threat
3. Change status to "Mitigated"
4. Add mitigation comment
5. Save changes
6. **Expected:** Threat marked as mitigated with comment

---

## Phase 3: Advanced Features Testing

### ✅ Test 10: Image Upload → Auto Mapping
1. Navigate to Architecture view
2. Click "Upload Image" (if available)
3. Upload architecture diagram
4. **Expected:** Components auto-detected and mapped

### ✅ Test 11: Threat Intelligence
1. Generate threats for a project
2. Navigate to "Threat Intel" view
3. Click "Fetch Latest CVEs"
4. Wait 30-60 seconds
5. Review CVE results
6. Check severity filters
7. Click CVE link to view on NVD
8. **Expected:** Relevant HIGH/CRITICAL CVEs displayed

### ✅ Test 12: AI-Powered Suggestions
1. Navigate to "AI Suggestions" view
2. Click "Generate Suggestions"
3. Review architecture suggestions
4. Check threat coverage suggestions
5. Review data flow recommendations
6. Filter by category
7. **Expected:** Actionable security recommendations with priority levels

### ✅ Test 13: 3D Architecture View
1. Navigate to "3D View"
2. Click "Show 3D View"
3. Observe 3D rendering
4. Check component shapes (cylinders=DB, spheres=users, etc.)
5. View connections between components
6. Watch auto-rotation
7. **Expected:** Interactive 3D visualization

---

## Authentication Testing

### ✅ Test 14: Firebase Auth
1. Visit app (logged out)
2. See login modal
3. Click "Continue with Google"
4. Authenticate with Google
5. **Expected:** Logged in, see user avatar in topbar

### ✅ Test 15: User Data Isolation
1. Login as User A
2. Create 2 projects
3. Logout
4. Login as User B
5. **Expected:** Empty dashboard (User A's projects not visible)
6. Create different projects
7. Logout and login as User A
8. **Expected:** Only User A's projects visible

### ✅ Test 16: Multi-Provider Auth
1. Test Google login
2. Test GitHub login (if enabled)
3. Test Microsoft login (if enabled)
4. **Expected:** All enabled providers work

---

## Export & Integration Testing

### ✅ Test 17: Export Functionality
1. Navigate to "Export" view
2. Export as PDF
3. Export as CSV
4. Export as JSON
5. Export as Markdown
6. **Expected:** All formats download successfully

### ✅ Test 18: Data Persistence
1. Create project with threats
2. Close browser
3. Reopen app
4. **Expected:** Project data persists in localStorage

---

## Performance Testing

### ✅ Test 19: Large Project
1. Create project with 20+ components
2. Add 50+ threats
3. Generate threat intelligence
4. View 3D visualization
5. **Expected:** App remains responsive

### ✅ Test 20: Offline Functionality
1. Load app
2. Disconnect internet
3. Create/edit projects
4. **Expected:** App works offline (except Threat Intel)

---

## Browser Compatibility

### ✅ Test 21: Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest)
- **Expected:** Consistent behavior across browsers

---

## Known Issues & Limitations

1. **Threat Intelligence:** May show some hardware CVEs due to generic keywords
2. **3D View:** Performance may degrade with 50+ components
3. **NVD API:** Rate limited to 5 requests per 30 seconds
4. **Firebase Auth:** Requires internet connection
5. **localStorage:** 5-10MB limit per domain

---

## Bug Reporting

If you find issues:
1. Open browser console (F12)
2. Note any error messages
3. Document steps to reproduce
4. Create GitHub issue with details

---

## Test Results Summary

| Phase | Feature | Status | Notes |
|-------|---------|--------|-------|
| 1 | Version History | ⏳ | Pending test |
| 1 | Template Builder | ⏳ | Pending test |
| 1 | Search & Filter | ⏳ | Pending test |
| 1 | Threat Heatmap | ⏳ | Pending test |
| 2 | Custom Builder | ⏳ | Pending test |
| 2 | Attack Paths | ⏳ | Pending test |
| 2 | Compliance | ⏳ | Pending test |
| 2 | Tutorial | ⏳ | Pending test |
| 2 | Threat Status | ⏳ | Pending test |
| 3 | Image Upload | ⏳ | Pending test |
| 3 | Threat Intel | ⏳ | Pending test |
| 3 | AI Suggestions | ⏳ | Pending test |
| 3 | 3D View | ⏳ | Pending test |
| Auth | Firebase Auth | ⏳ | Pending test |
| Auth | Data Isolation | ⏳ | Pending test |

**Update this table as you complete tests!**
