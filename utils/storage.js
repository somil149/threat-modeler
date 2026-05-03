// ========================================
// Storage Utility - localStorage Management
// ========================================

const Storage = {
  // Keys
  KEYS: {
    PROJECTS: 'threatmodeler_projects',
    CURRENT_PROJECT: 'threatmodeler_current',
    USER_PROFILE: 'threatmodeler_user',
    THEME: 'threatmodeler_theme'
  },

  // Get current user ID for data isolation
  getCurrentUserId() {
    const user = GitHubAuth?.getUser();
    return user ? user.id : 'anonymous';
  },

  // Get user-specific storage key
  getUserKey(baseKey) {
    const userId = this.getCurrentUserId();
    return `${baseKey}_user_${userId}`;
  },

  // Get all projects for current user
  getProjects() {
    const key = this.getUserKey(this.KEYS.PROJECTS);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  // Save all projects for current user
  saveProjects(projects) {
    const key = this.getUserKey(this.KEYS.PROJECTS);
    localStorage.setItem(key, JSON.stringify(projects));
  },

  // Get project by ID
  getProject(id) {
    const projects = this.getProjects();
    return projects.find(p => p.id === id);
  },

  // Create new project
  createProject(project) {
    const projects = this.getProjects();
    const newProject = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...project
    };
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  },

  // Update project
  updateProject(id, updates) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      // Save version history
      const currentVersion = { ...projects[index] };
      this.saveVersion(id, currentVersion);
      
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveProjects(projects);
      return projects[index];
    }
    return null;
  },

  // Version History (user-specific)
  saveVersion(projectId, snapshot) {
    const key = this.getUserKey(`${this.KEYS.PROJECTS}_versions_${projectId}`);
    const versions = JSON.parse(localStorage.getItem(key) || '[]');
    versions.push({
      timestamp: new Date().toISOString(),
      snapshot: snapshot
    });
    // Keep last 10 versions
    if (versions.length > 10) versions.shift();
    localStorage.setItem(key, JSON.stringify(versions));
  },

  getVersions(projectId) {
    const key = this.getUserKey(`${this.KEYS.PROJECTS}_versions_${projectId}`);
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  restoreVersion(projectId, timestamp) {
    const versions = this.getVersions(projectId);
    const version = versions.find(v => v.timestamp === timestamp);
    if (version) {
      return this.updateProject(projectId, version.snapshot);
    }
    return null;
  },

  // Delete project
  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    this.saveProjects(filtered);
  },

  // Current project (user-specific)
  getCurrentProject() {
    const key = this.getUserKey(this.KEYS.CURRENT_PROJECT);
    const id = localStorage.getItem(key);
    return id ? this.getProject(id) : null;
  },

  setCurrentProject(id) {
    const key = this.getUserKey(this.KEYS.CURRENT_PROJECT);
    localStorage.setItem(key, id);
  },

  // User profile
  getUserProfile() {
    const data = localStorage.getItem(this.KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  saveUserProfile(profile) {
    localStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Theme
  getTheme() {
    return localStorage.getItem(this.KEYS.THEME) || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
  },

  // Export project as JSON
  exportProject(project) {
    const dataStr = JSON.stringify(project, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Import project from JSON
  importProject(jsonString) {
    try {
      const project = JSON.parse(jsonString);
      return this.createProject(project);
    } catch (error) {
      console.error('Failed to import project:', error);
      return null;
    }
  },

  // Template Builder (user-specific)
  saveAsTemplate(project) {
    const templates = this.getCustomTemplates();
    const template = {
      id: `custom_${Date.now()}`,
      name: project.name + ' Template',
      description: 'Custom template',
      components: project.components,
      flows: project.flows,
      createdAt: new Date().toISOString()
    };
    templates.push(template);
    const key = this.getUserKey('threatmodeler_custom_templates');
    localStorage.setItem(key, JSON.stringify(templates));
    return template;
  },

  getCustomTemplates() {
    const key = this.getUserKey('threatmodeler_custom_templates');
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  deleteTemplate(id) {
    const templates = this.getCustomTemplates();
    const filtered = templates.filter(t => t.id !== id);
    const key = this.getUserKey('threatmodeler_custom_templates');
    localStorage.setItem(key, JSON.stringify(filtered));
  }
};
