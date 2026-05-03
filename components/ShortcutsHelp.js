// ========================================
// Keyboard Shortcuts Help Modal
// ========================================

function ShortcutsHelp({ onClose }) {
  const shortcuts = KeyboardShortcuts.getShortcuts();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {shortcuts.map(shortcut => (
              <div key={shortcut.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '0.375rem' }}>
                <span style={{ fontSize: '0.875rem' }}>{shortcut.description}</span>
                <kbd style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '0.25rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
