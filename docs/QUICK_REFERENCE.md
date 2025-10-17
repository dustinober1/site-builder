# Developer Quick Reference

## Project Setup

```bash
# Clone and setup
git clone <repo>
cd site-builder

# Install all dependencies
bash setup.sh

# Or manual setup
cd backend && npm install && npm start
# In another terminal:
cd frontend && npm install && npm start
```

## Directory Structure

```
backend/          - Express.js API server (port 5000)
frontend/         - React web app (port 3000)
output-sites/     - Generated static courses
templates/        - Course templates
```

## Key Files

| File | Purpose | LOC |
|------|---------|-----|
| backend/server.js | Main API & HTML generator | 250 |
| frontend/src/App.js | Main React component | 60 |
| frontend/src/components/Editor.js | Editor interface | 150 |
| frontend/src/components/Canvas.js | Content display | 40 |
| frontend/src/components/PropertiesPanel.js | Content editing | 100 |

## API Endpoints

```javascript
GET  /api/health                    // Status check
POST /api/upload/image              // Image upload
POST /api/upload/video              // Video upload
POST /api/generate/site             // Generate static site
GET  /uploads/:filename             // Access uploads
GET  /sites/:sitename/*             // Access generated sites
```

## React Component Hierarchy

```
App
├── WelcomeScreen
├── ProjectList
└── Editor
    ├── Toolbar
    ├── Canvas
    │   └── ContentBlock (repeated)
    └── PropertiesPanel
```

## Content Block Types

```javascript
{
  id: 1234567890,           // Unique ID
  type: 'text|heading|image|video',
  content: 'Block content',
  url: 'https://...',       // For image/video
  alt: 'Alt text',          // For image/video
  title: 'Optional title'
}
```

## Adding New Content Block Type

### 1. Frontend: Add button in Toolbar.js

```javascript
const blockTypes = [
  // ... existing
  { type: 'custom', label: 'Custom', icon: '🎨' }
];
```

### 2. Frontend: Add component in PropertiesPanel.js

```javascript
{block.type === 'custom' && (
  <div className="form-group">
    {/* Edit controls */}
  </div>
)}
```

### 3. Backend: Update generateContentBlock() in server.js

```javascript
case 'custom':
  return `<section class="custom-block">
    ${escapeHtml(block.content)}
  </section>`;
```

## Common Tasks

### Modify CSS

Edit `backend/server.js` function `generateCSS()` to change:
- Colors: `#2c3e50` (primary), `#3498db` (accent)
- Spacing: `1rem`, `2rem`, etc.
- Fonts: System fonts at top of CSS

### Change Colors

Find in `backend/server.js`:
```javascript
background-color: #2c3e50;  // Dark blue - change here
color: #3498db;             // Light blue - change here
```

### Add New Font

In `generateCSS()`:
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
font-family: 'Roboto', sans-serif;
```

### Increase Max File Size

In `backend/server.js`:
```javascript
app.use(express.json({ limit: '100mb' }));  // Change limit
```

## Testing

### Frontend Component Testing

```bash
cd frontend
npm test
```

### Backend API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Generate site
curl -X POST http://localhost:5000/api/generate/site \
  -H "Content-Type: application/json" \
  -d '{"projectName":"test","pages":[...]}'
```

### Accessibility Testing

- Keyboard: Tab through entire interface
- Screen reader: Use NVDA (Windows) or VoiceOver (Mac)
- Color contrast: Use axe DevTools extension
- Responsive: Resize browser to 320px width

## Debugging

### Frontend Errors

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API failures
4. Verify REACT_APP_API_URL is set correctly

### Backend Errors

1. Check terminal where `npm start` is running
2. Look for 500 errors in console
3. Check file permissions (output-sites folder)
4. Verify uploads folder exists

### File Not Found

1. Check backend is running on :5000
2. Verify uploads folder: `backend/uploads/`
3. Verify output-sites folder exists
4. Check file permissions: `chmod 755`

## Performance Tips

### Frontend
- Components are already optimized
- Use React DevTools Profiler if needed
- Avoid inline functions in render

### Backend
- HTML generation is fast (< 100ms)
- Use gzip compression in production
- Consider caching generated sites

### Generated Sites
- Already optimized CSS
- Minimal HTML (no framework)
- Images should be pre-optimized
- No JavaScript bloat

## Deployment Checklist

- [ ] Backend running on correct port
- [ ] Frontend .env has REACT_APP_API_URL
- [ ] CORS configured for your domain
- [ ] output-sites folder writable
- [ ] File permissions set correctly
- [ ] SSL/HTTPS configured
- [ ] Backup strategy in place

## Environment Variables

### Backend (.env)

```
PORT=5000
UPLOAD_DIR=./uploads
OUTPUT_DIR=../output-sites
MAX_FILE_SIZE=50000000
NODE_ENV=development
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-content-type

# Make changes
git add .
git commit -m "Add custom content type"

# Push to remote
git push origin feature/new-content-type

# Create pull request
# → Review and merge
```

## Resources

- React: https://react.dev
- Express: https://expressjs.com
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Accessibility: https://webaim.org
- MDN Web Docs: https://developer.mozilla.org

## Quick Links

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health
- Generated Sites: http://localhost:5000/sites/

## File Size Guidelines

| Type | Recommended | Max |
|------|------------|-----|
| Images | < 500KB | 5MB |
| Videos | < 10MB | 100MB |
| Total course | < 50MB | 500MB |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Standards

- ✅ WCAG 2.1 Level AA
- ✅ Section 508 compliant
- ✅ Keyboard accessible
- ✅ Screen reader friendly

---

**Need more info?** See README.md, GETTING_STARTED.md, or ACCESSIBILITY.md
