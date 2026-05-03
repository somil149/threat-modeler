// ========================================
// Search & Filter Component
// ========================================

function SearchFilter({ projects, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = [];
    const lowerQuery = query.toLowerCase();

    projects.forEach(project => {
      // Search in project name
      if (project.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          type: 'project',
          project: project,
          title: project.name,
          subtitle: 'Project'
        });
      }

      // Search in threats
      project.threats?.forEach(threat => {
        if (threat.title.toLowerCase().includes(lowerQuery) ||
            threat.description.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'threat',
            project: project,
            title: threat.title,
            subtitle: `Threat in ${project.name}`
          });
        }
      });

      // Search in components
      project.components?.forEach(comp => {
        if (comp.name.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'component',
            project: project,
            title: comp.name,
            subtitle: `Component in ${project.name}`
          });
        }
      });
    });

    setResults(searchResults.slice(0, 10));
    setShowResults(true);
  }, [query, projects]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="input"
          placeholder="Search projects, threats, components..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          style={{ paddingLeft: '2.5rem' }}
        />
        <i className="fas fa-search" style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)'
        }}></i>
      </div>

      {showResults && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          {results.map((result, index) => (
            <div
              key={index}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                borderBottom: index < results.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.2s'
              }}
              onClick={() => {
                onSelect(result.project);
                setQuery('');
                setShowResults(false);
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {result.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {result.subtitle}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
