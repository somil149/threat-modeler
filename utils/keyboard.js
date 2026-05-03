// ========================================
// Keyboard Shortcuts Manager
// ========================================

const KeyboardShortcuts = {
  shortcuts: {
    'ctrl+n': { action: 'newProject', description: 'New Project' },
    'ctrl+s': { action: 'saveProject', description: 'Save Project' },
    'ctrl+e': { action: 'exportProject', description: 'Export Project' },
    'ctrl+f': { action: 'searchThreats', description: 'Search Threats' },
    'ctrl+/': { action: 'showHelp', description: 'Show Shortcuts' },
    'escape': { action: 'closeModal', description: 'Close Modal' }
  },

  handlers: {},

  init() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  },

  handleKeyPress(e) {
    const key = this.getKeyCombo(e);
    const shortcut = this.shortcuts[key];
    
    if (shortcut && this.handlers[shortcut.action]) {
      e.preventDefault();
      this.handlers[shortcut.action]();
    }
  },

  getKeyCombo(e) {
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    
    const key = e.key.toLowerCase();
    if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
      parts.push(key);
    }
    
    return parts.join('+');
  },

  register(action, handler) {
    this.handlers[action] = handler;
  },

  unregister(action) {
    delete this.handlers[action];
  },

  getShortcuts() {
    return Object.entries(this.shortcuts).map(([key, data]) => ({
      key: key.toUpperCase().replace('CTRL', '⌘/Ctrl'),
      ...data
    }));
  }
};
