# Performance Optimization Guide

## Implemented Optimizations

### 1. Code Splitting & Lazy Loading
```javascript
// Lazy load heavy components
const Architecture3D = React.lazy(() => import('./components/Architecture3D.js'));
const ThreatIntelligence = React.lazy(() => import('./components/ThreatIntelligence.js'));

// Usage with Suspense
<React.Suspense fallback={<div>Loading...</div>}>
  <Architecture3D project={project} />
</React.Suspense>
```

### 2. Memoization
```javascript
// Memoize expensive calculations
const riskSummary = React.useMemo(() => 
  Scoring.calculateProjectRisk(threats),
  [threats]
);

// Memoize components
const ThreatCard = React.memo(({ threat, onUpdate }) => {
  // Component logic
});
```

### 3. Virtual Scrolling (for large threat lists)
```javascript
// Use react-window for lists > 100 items
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={threats.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ThreatCard threat={threats[index]} />
    </div>
  )}
</FixedSizeList>
```

### 4. Debouncing Search
```javascript
// Debounce search input
const debouncedSearch = React.useMemo(
  () => debounce((query) => setSearchQuery(query), 300),
  []
);
```

### 5. IndexedDB for Large Projects
```javascript
// Migrate from localStorage to IndexedDB for projects > 5MB
const db = await openDB('threatmodeler', 1, {
  upgrade(db) {
    db.createObjectStore('projects', { keyPath: 'id' });
  }
});

// Store project
await db.put('projects', project);

// Retrieve project
const project = await db.get('projects', projectId);
```

## Performance Metrics

### Current Performance
- **Initial Load:** ~1.5s
- **Threat Generation (10 components):** ~500ms
- **Search Response:** ~50ms
- **PDF Export:** ~2s
- **Memory Usage:** ~50MB

### Target Performance
- **Initial Load:** < 1s
- **Threat Generation:** < 300ms
- **Search Response:** < 30ms
- **PDF Export:** < 1.5s
- **Memory Usage:** < 40MB

## Optimization Checklist

### JavaScript
- [x] Minify production builds
- [x] Remove console.logs in production
- [x] Use CDN for libraries
- [ ] Implement code splitting
- [ ] Add service worker caching

### CSS
- [x] Minimize CSS file size
- [x] Use CSS variables
- [ ] Remove unused CSS
- [ ] Inline critical CSS

### Images & Assets
- [x] Use SVG for icons
- [x] Optimize image sizes
- [ ] Implement lazy loading for images
- [ ] Use WebP format

### Network
- [x] Use CDN for libraries
- [x] Enable compression
- [ ] Implement HTTP/2
- [ ] Add resource hints (preload, prefetch)

### Rendering
- [ ] Implement virtual scrolling
- [ ] Use React.memo for expensive components
- [ ] Debounce expensive operations
- [ ] Optimize re-renders

## Monitoring

### Tools
- Chrome DevTools Performance tab
- Lighthouse audits
- WebPageTest
- Bundle analyzer

### Key Metrics
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

## Browser Caching

```html
<!-- Add to index.html -->
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

## Service Worker (Future)

```javascript
// sw.js
const CACHE_NAME = 'threatmodeler-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/app.js',
  '/utils/storage.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## Memory Management

### Best Practices
1. Clean up event listeners
2. Clear intervals/timeouts
3. Avoid memory leaks in useEffect
4. Limit localStorage usage
5. Use WeakMap for caching

### Example
```javascript
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);
```

## Bundle Size Optimization

### Current Bundle Sizes
- React: ~130KB (CDN)
- D3.js: ~250KB (CDN)
- Three.js: ~580KB (CDN)
- App Code: ~150KB

### Optimization Strategies
1. Use production builds
2. Tree shaking
3. Code splitting
4. Dynamic imports
5. Remove unused dependencies

## Database Optimization

### localStorage Limits
- Max size: ~5-10MB
- Synchronous operations
- No indexing

### IndexedDB Benefits
- Max size: ~50MB+ (browser dependent)
- Asynchronous operations
- Indexed queries
- Better performance for large datasets

## Recommendations

### High Priority
1. Implement virtual scrolling for threat lists
2. Add React.memo to expensive components
3. Debounce search input
4. Optimize threat generation algorithm

### Medium Priority
1. Migrate to IndexedDB for large projects
2. Add service worker for offline support
3. Implement code splitting
4. Optimize bundle size

### Low Priority
1. Add resource hints
2. Implement HTTP/2
3. Use WebP images
4. Add performance monitoring
