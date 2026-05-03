# Testing Guide

## Test Structure

```
tests/
├── unit/
│   ├── scoring.test.js
│   ├── storage.test.js
│   └── graph.test.js
├── integration/
│   └── threat-generation.test.js
└── e2e/
    └── user-flows.test.js
```

## Running Tests

```bash
# Install dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Example Tests

### Unit Test (scoring.test.js)
```javascript
describe('Scoring', () => {
  test('calculateRisk returns correct value', () => {
    expect(Scoring.calculateRisk(5, 5)).toBe(25);
    expect(Scoring.calculateRisk(1, 1)).toBe(1);
  });

  test('getRiskLevel categorizes correctly', () => {
    expect(Scoring.getRiskLevel(25)).toBe('CRITICAL');
    expect(Scoring.getRiskLevel(15)).toBe('HIGH');
    expect(Scoring.getRiskLevel(8)).toBe('MEDIUM');
    expect(Scoring.getRiskLevel(3)).toBe('LOW');
  });
});
```

### Integration Test
```javascript
describe('Threat Generation', () => {
  test('generates STRIDE threats for components', () => {
    const component = { id: '1', type: 'API', name: 'User API' };
    const threats = generateThreats([component]);
    
    expect(threats.length).toBeGreaterThan(0);
    expect(threats[0]).toHaveProperty('stride');
    expect(threats[0]).toHaveProperty('title');
  });
});
```

## CI/CD Integration

### GitHub Actions (.github/workflows/test.yml)
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
```

## Coverage Goals

- **Unit Tests:** > 70%
- **Integration Tests:** > 50%
- **Critical Paths:** 100%

## Test Best Practices

1. **Arrange-Act-Assert** pattern
2. **One assertion per test** (when possible)
3. **Descriptive test names**
4. **Mock external dependencies**
5. **Test edge cases**

## Manual Testing Checklist

### Authentication
- [ ] Login with Google
- [ ] Login with GitHub
- [ ] Logout
- [ ] Session persistence

### Project Management
- [ ] Create new project
- [ ] Edit project
- [ ] Delete project
- [ ] Export project
- [ ] Import project
- [ ] Share project link

### Threat Modeling
- [ ] Generate threats
- [ ] Edit threat
- [ ] Delete threat
- [ ] Filter by STRIDE
- [ ] Search threats
- [ ] Filter by severity

### Diagram Import
- [ ] Upload diagram
- [ ] AI detection
- [ ] Manual component addition
- [ ] Component connections

### Export
- [ ] Export to PDF
- [ ] Export to JSON
- [ ] Export to CSV

## Performance Testing

### Metrics to Track
- Page load time: < 2s
- Threat generation: < 1s for 10 components
- Search response: < 100ms
- Export generation: < 3s

## Security Testing

### Checklist
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Input validation
- [ ] Secure storage (localStorage encryption)
- [ ] API key protection
- [ ] Content Security Policy

## Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility Testing

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast (WCAG AA)
- [ ] Focus indicators
- [ ] ARIA labels
