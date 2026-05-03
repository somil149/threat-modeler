# ThreatModeler - Deployment Guide

## Quick Start (Local)

### Option 1: Direct File Open
```bash
# Simply open index.html in your browser
open index.html
# or
start index.html  # Windows
```

### Option 2: Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000

# Visit: http://localhost:8000
```

---

## GitHub Pages Deployment

### Step 1: Create GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: ThreatModeler application"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/threat-modeler.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** section
4. Under **Source**, select **main** branch
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Step 3: Access Your App
```
https://YOUR_USERNAME.github.io/threat-modeler/
```

---

## GitHub Actions (Automated Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## Custom Domain (Optional)

### Step 1: Add CNAME File
Create `CNAME` file in root:
```
threatmodeler.yourdomain.com
```

### Step 2: Configure DNS
Add DNS records at your domain provider:
```
Type: CNAME
Name: threatmodeler
Value: YOUR_USERNAME.github.io
```

### Step 3: Enable HTTPS
1. Go to repository Settings → Pages
2. Check **Enforce HTTPS**

---

## Troubleshooting

### Issue: Blank Page
**Solution:** Check browser console for errors. Ensure all CDN links are accessible.

### Issue: Data Not Loading
**Solution:** Use a local server instead of opening file directly. Browsers block file:// protocol for security.

### Issue: Charts Not Rendering
**Solution:** Verify Chart.js CDN is loaded. Check console for errors.

### Issue: Export Not Working
**Solution:** Ensure jsPDF CDN is loaded. Check browser compatibility.

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Performance Tips

1. **Clear localStorage** if app becomes slow:
   ```javascript
   localStorage.clear()
   ```

2. **Limit threats** to <100 per project for best performance

3. **Use modern browser** for best D3.js performance

---

## Security Notes

⚠️ **Important:** This app stores data in browser localStorage only.

- Data is NOT encrypted
- Data is NOT backed up
- Data is device-specific
- Use export feature to backup projects

**For production use:**
- Export projects regularly
- Don't store sensitive real-world data
- Label as "Local Profile (Not Secure Auth)" in UI

---

## Updating the App

```bash
# Pull latest changes
git pull origin main

# Make your changes
# ...

# Commit and push
git add .
git commit -m "Update: description"
git push origin main

# GitHub Pages will auto-deploy
```

---

## File Structure

```
threat-modeler/
├── index.html              # Entry point
├── styles.css              # Styling
├── app.js                  # Main React app
├── components/             # React components
│   ├── Dashboard.js
│   ├── ArchitectureCanvas.js
│   ├── ThreatList.js
│   ├── RiskMatrix.js
│   └── ExportPanel.js
├── data/                   # Templates & patterns
│   ├── templates.json
│   └── threat-patterns.json
├── utils/                  # Utilities
│   ├── storage.js
│   ├── scoring.js
│   ├── graph.js
│   └── export.js
└── docs/                   # Documentation
    ├── PROJECT_SPEC.md
    └── DEPLOYMENT.md
```

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all CDN links are accessible
3. Try clearing localStorage
4. Use a local server instead of file://

---

## License

MIT License - See LICENSE file

---

**🎉 Your ThreatModeler is now deployed!**

Visit: `https://YOUR_USERNAME.github.io/threat-modeler/`
