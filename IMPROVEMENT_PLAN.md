# ThreatModeler - Phased Improvement Plan

**Status:** Planning Phase  
**Created:** 2026-05-03  
**Current Version:** 1.0 (Production)

---

## Git Branching Strategy

### Branch Structure
```
master (protected)
  ├── phase-4a-collaboration
  ├── phase-4b-threat-library
  ├── phase-4c-ux-improvements
  ├── phase-5a-threat-intel
  ├── phase-5b-ai-prioritization
  ├── phase-6a-testing
  ├── phase-6b-performance
  └── phase-7-pwa
```

### Git Tags for Version Control
```
v1.0.0 - Current production (before any improvements)
v1.1.0 - After Phase 4A
v1.2.0 - After Phase 4B
v1.3.0 - After Phase 4C
v1.4.0 - After Phase 5A
v1.5.0 - After Phase 5B
v1.6.0 - After Phase 6A
v1.7.0 - After Phase 6B
v2.0.0 - After Phase 7 (major version - PWA)
```

### Workflow
1. **Tag current state** before starting (v1.0.0)
2. **Create feature branch** from master
3. **Develop & test** in branch
4. **Demo to user** (preview deployment)
5. **User approval** required
6. **Merge to master** only after approval
7. **Tag new version** (e.g., v1.1.0)
8. **Push tag** to GitHub
9. **Rollback** = revert to previous tag if issues found

### Rollback Strategy

**Option 1: Revert Merge (Recommended)**
```bash
# If Phase 4A has issues after merge:
git revert <merge-commit-hash>
git push origin master
git tag v1.1.1  # Patch version for rollback
git push origin v1.1.1
```

**Option 2: Hard Reset to Tag (Nuclear)**
```bash
# Reset to previous working version:
git reset --hard v1.0.0
git push origin master --force

# WARNING: Only use if revert doesn't work
# Requires force push - use with caution
```

**Option 3: Restore from Branch**
```bash
# Continue work on branch:
git checkout phase-4a-collaboration
git checkout -b phase-4a-fix
# Fix issues, then re-merge
```

### Tag Commands
```bash
# Before starting improvements:
git tag -a v1.0.0 -m "Production release - before Phase 4 improvements"
git push origin v1.0.0

# After each phase approval:
git tag -a v1.1.0 -m "Phase 4A: Collaboration features"
git push origin v1.1.0

# List all tags:
git tag -l

# View tag details:
git show v1.0.0

# Checkout specific version:
git checkout v1.0.0
```

---

## Phase 4A: Collaboration Features
**Priority:** HIGH  
**Effort:** 2-3 hours  
**Risk:** LOW  

### Features
1. **Project Export/Import**
   - Export project as JSON file
   - Import project from JSON file
   - Validate imported data structure
   - Merge with existing projects

2. **Shareable Links**
   - Generate read-only project URL
   - Encode project data in URL hash
   - View-only mode (no editing)
   - Copy link button

3. **Project Templates**
   - Save current project as template
   - Template library (user-created)
   - Quick start from template

### Files to Modify
- `components/Dashboard.js` - Add export/import buttons
- `components/ExportPanel.js` - Add JSON export option
- `utils/storage.js` - Add import/export functions
- `app.js` - Add share route handler

### Testing Checklist
- [ ] Export project to JSON
- [ ] Import JSON file successfully
- [ ] Shareable link works in incognito
- [ ] View-only mode prevents editing
- [ ] Invalid JSON shows error

### Rollback Plan
- Revert merge commit
- No data loss (localStorage unchanged)
- Feature flags to disable if needed

---

## Phase 4B: Enhanced Threat Library
**Priority:** HIGH  
**Effort:** 3-4 hours  
**Risk:** MEDIUM  

### Features
1. **Industry-Specific Threats**
   - OWASP Top 10 (2021) mapping
   - Cloud threats (AWS, Azure, GCP)
   - API security threats
   - Container/K8s threats
   - Supply chain threats

2. **Threat Search & Filter**
   - Search by keyword
   - Filter by STRIDE category
   - Filter by severity
   - Filter by compliance framework

3. **Threat Templates**
   - Pre-filled descriptions
   - Copy from similar components
   - Threat library browser

### Files to Create/Modify
- `data/threat-library.json` - New comprehensive library
- `data/owasp-top10.json` - OWASP mappings
- `data/cloud-threats.json` - Cloud-specific threats
- `components/ThreatLibrary.js` - NEW component
- `components/ThreatList.js` - Add search/filter UI

### Testing Checklist
- [ ] OWASP threats map correctly
- [ ] Cloud threats show for cloud components
- [ ] Search returns relevant results
- [ ] Filters work independently
- [ ] Copy threat works

### Rollback Plan
- Revert merge commit
- Old threat generation still works
- New files can be deleted

---

## Phase 4C: Keyboard Shortcuts & UX
**Priority:** MEDIUM  
**Effort:** 2-3 hours  
**Risk:** LOW  

### Features
1. **Keyboard Shortcuts**
   - `Ctrl+N` - New project
   - `Ctrl+S` - Save project
   - `Ctrl+E` - Export
   - `Ctrl+F` - Search threats
   - `Ctrl+Z` - Undo
   - `Ctrl+Y` - Redo
   - `Esc` - Close modals
   - `?` - Show shortcuts help

2. **Undo/Redo**
   - Track state changes
   - Undo last 10 actions
   - Redo undone actions
   - History panel

3. **Bulk Operations**
   - Select multiple threats (Shift+Click)
   - Bulk status update
   - Bulk delete
   - Bulk export

### Files to Create/Modify
- `utils/keyboard.js` - NEW keyboard handler
- `utils/history.js` - NEW undo/redo manager
- `components/ShortcutsHelp.js` - NEW help modal
- `components/ThreatList.js` - Add bulk selection
- `app.js` - Register keyboard listeners

### Testing Checklist
- [ ] All shortcuts work
- [ ] Undo/redo works correctly
- [ ] Bulk operations work
- [ ] Help modal shows all shortcuts
- [ ] No conflicts with browser shortcuts

### Rollback Plan
- Revert merge commit
- Remove keyboard listeners
- No data impact

---

## Phase 5A: Advanced Threat Intelligence
**Priority:** MEDIUM  
**Effort:** 4-5 hours  
**Risk:** MEDIUM  

### Features
1. **CISA KEV Integration**
   - Known Exploited Vulnerabilities feed
   - Real-time updates
   - Priority flagging

2. **MITRE ATT&CK Mapping**
   - Map threats to ATT&CK techniques
   - Tactic/technique browser
   - Threat actor profiles

3. **Real-Time Feeds**
   - CVE severity updates
   - Exploit availability
   - Patch status

### Files to Create/Modify
- `utils/cisa-kev.js` - NEW CISA API client
- `utils/mitre-attack.js` - NEW ATT&CK mapper
- `data/attack-techniques.json` - NEW ATT&CK data
- `components/ThreatIntelligence.js` - Enhance with new feeds
- `components/AttackTechniques.js` - NEW component

### Testing Checklist
- [ ] CISA KEV data loads
- [ ] ATT&CK mapping works
- [ ] Real-time updates work
- [ ] Performance acceptable
- [ ] Fallback if API fails

### Rollback Plan
- Revert merge commit
- Old NVD integration still works
- New APIs optional

---

## Phase 5B: AI-Powered Prioritization
**Priority:** HIGH  
**Effort:** 3-4 hours  
**Risk:** MEDIUM  

### Features
1. **Gemini Threat Analysis**
   - Analyze threat context
   - Consider exploitability
   - Assess business impact
   - Suggest priority order

2. **Smart Risk Scoring**
   - AI-enhanced CVSS
   - Context-aware scoring
   - Asset value consideration

3. **Mitigation Ordering**
   - Prioritize by risk reduction
   - Consider dependencies
   - Effort vs impact analysis

### Files to Create/Modify
- `utils/ai-prioritization.js` - NEW Gemini integration
- `components/ThreatList.js` - Add AI priority column
- `components/MitigationPlanner.js` - NEW component
- `cloudflare-worker.js` - Add prioritization endpoint

### Testing Checklist
- [ ] AI analysis works
- [ ] Priority scores make sense
- [ ] Mitigation order logical
- [ ] Handles API failures gracefully
- [ ] Rate limiting works

### Rollback Plan
- Revert merge commit
- Manual prioritization still works
- Cloudflare worker backward compatible

---

## Phase 6A: Testing Infrastructure
**Priority:** HIGH  
**Effort:** 4-5 hours  
**Risk:** LOW  

### Features
1. **Unit Tests**
   - Test utility functions
   - Test risk calculations
   - Test data transformations

2. **Integration Tests**
   - Test component interactions
   - Test storage operations
   - Test API calls

3. **CI/CD Pipeline**
   - GitHub Actions workflow
   - Run tests on PR
   - Block merge if tests fail

### Files to Create
- `package.json` - Add test dependencies
- `jest.config.js` - Jest configuration
- `tests/utils/scoring.test.js`
- `tests/utils/storage.test.js`
- `tests/components/ThreatList.test.js`
- `.github/workflows/test.yml` - CI pipeline

### Testing Checklist
- [ ] All tests pass
- [ ] Coverage > 60%
- [ ] CI pipeline runs
- [ ] Tests run in < 30 seconds

### Rollback Plan
- Delete test files
- Remove CI workflow
- No impact on production

---

## Phase 6B: Performance Optimization
**Priority:** MEDIUM  
**Effort:** 3-4 hours  
**Risk:** MEDIUM  

### Features
1. **Lazy Loading**
   - Load 3D view on demand
   - Defer heavy components
   - Code splitting

2. **IndexedDB Migration**
   - Replace localStorage
   - Support larger projects
   - Better performance

3. **Virtual Scrolling**
   - Handle 1000+ threats
   - Render only visible items
   - Smooth scrolling

4. **Web Workers**
   - Offload heavy computations
   - Attack path generation
   - Risk calculations

### Files to Create/Modify
- `utils/indexeddb.js` - NEW IndexedDB wrapper
- `utils/workers/attack-paths.worker.js` - NEW worker
- `components/ThreatList.js` - Add virtual scrolling
- `components/Architecture3D.js` - Lazy load

### Testing Checklist
- [ ] IndexedDB migration works
- [ ] Large projects load fast
- [ ] Virtual scrolling smooth
- [ ] Workers don't block UI

### Rollback Plan
- Revert merge commit
- Fallback to localStorage
- Disable workers if issues

---

## Phase 7: PWA & Offline Support
**Priority:** LOW  
**Effort:** 5-6 hours  
**Risk:** HIGH  

### Features
1. **Progressive Web App**
   - Install as desktop app
   - App manifest
   - App icons

2. **Service Worker**
   - Cache static assets
   - Offline functionality
   - Background sync

3. **Offline Mode**
   - Work without internet
   - Queue API calls
   - Sync when online

### Files to Create
- `manifest.json` - PWA manifest
- `service-worker.js` - Service worker
- `utils/sync.js` - Background sync
- `assets/icons/` - App icons

### Testing Checklist
- [ ] Installs as app
- [ ] Works offline
- [ ] Syncs when online
- [ ] Updates properly

### Rollback Plan
- Unregister service worker
- Remove manifest
- Revert to online-only

---

## Approval Process

### Before Each Phase
1. **Review plan** with user
2. **Get approval** to proceed
3. **Create feature branch**
4. **Develop features**

### After Development
1. **Demo in branch** (local or preview)
2. **User testing**
3. **Get approval** to merge
4. **Merge to master**
5. **Monitor for issues**

### If Issues Found
1. **Immediate rollback** if critical
2. **Create fix branch** if minor
3. **User approval** for fix
4. **Re-deploy**

---

## Risk Mitigation

### Low Risk Phases
- Phase 4A, 4C, 6A
- Can proceed with confidence
- Easy rollback

### Medium Risk Phases
- Phase 4B, 5A, 5B, 6B
- Thorough testing required
- Feature flags recommended

### High Risk Phases
- Phase 7
- Extensive testing needed
- Staged rollout
- Canary deployment

---

## Timeline Estimate

| Phase | Effort | Dependencies | Total Time |
|-------|--------|--------------|------------|
| 4A | 2-3h | None | Week 1 |
| 4B | 3-4h | None | Week 1 |
| 4C | 2-3h | None | Week 2 |
| 5A | 4-5h | 4B | Week 2-3 |
| 5B | 3-4h | 5A | Week 3 |
| 6A | 4-5h | None | Week 4 |
| 6B | 3-4h | 6A | Week 4-5 |
| 7 | 5-6h | 6B | Week 5-6 |

**Total:** ~30 hours over 6 weeks

---

## Success Metrics

### Phase 4A
- [ ] 100% of projects export successfully
- [ ] Shareable links work in all browsers
- [ ] Zero data loss on import

### Phase 4B
- [ ] 200+ threats in library
- [ ] Search returns results in < 100ms
- [ ] 90% of threats have OWASP mapping

### Phase 4C
- [ ] All shortcuts work in all browsers
- [ ] Undo/redo handles 100% of actions
- [ ] Bulk operations 10x faster

### Phase 5A
- [ ] CISA KEV updates daily
- [ ] ATT&CK mapping 80% accurate
- [ ] API response time < 500ms

### Phase 5B
- [ ] AI prioritization 85% accurate
- [ ] Mitigation order makes sense
- [ ] User satisfaction > 4/5

### Phase 6A
- [ ] Test coverage > 60%
- [ ] CI pipeline < 5 minutes
- [ ] Zero false positives

### Phase 6B
- [ ] Load time < 2 seconds
- [ ] Handles 1000+ threats smoothly
- [ ] Memory usage < 100MB

### Phase 7
- [ ] Installs on all platforms
- [ ] Works 100% offline
- [ ] Sync success rate > 95%

---

## Next Steps

1. **Review this plan** with user
2. **Get approval** for Phase 4A
3. **Create branch:** `phase-4a-collaboration`
4. **Start development**

**Ready to proceed?** 🚀
