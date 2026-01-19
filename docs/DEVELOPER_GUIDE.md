# Site Builder - Developer Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Setup and Installation](#setup-and-installation)
3. [Frontend Development](#frontend-development)
4. [Backend Development](#backend-development)
5. [API Reference](#api-reference)
6. [Adding Features](#adding-features)
7. [Testing](#testing)
8. [Deployment](#deployment)

## Architecture Overview

### Technology Stack

**Frontend:**
- React 18.x
- CSS3 (no framework, custom styles)
- Local Storage API for persistence

**Backend:**
- Node.js 16+
- Express.js
- Multer (file uploads)
- SCORM compliance utilities

**File Structure:**
```
site-builder/
├── backend/
│   ├── server.js              # Express server
│   ├── scorm-compliance.js    # SCORM generation
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main app component
│   │   ├── App.css            # Global styles
│   │   ├── index.js           # Entry point
│   │   ├── index.css          # Base styles
│   │   ├── components/        # React components
│   │   │   ├── Canvas.js      # Main editing canvas
│   │   │   ├── ContentBlock.js # Individual block
│   │   │   ├── Editor.js      # Editor container
│   │   │   ├── PreviewModal.js # Preview functionality
│   │   │   ├── ProjectList.js # Project management
│   │   │   ├── PropertiesPanel.js # Block properties
│   │   │   ├── TemplateGallery.js # Templates
│   │   │   ├── Toolbar.js     # Block toolbar
│   │   │   └── WelcomeScreen.js # Landing page
│   │   └── utils/
│   │       └── projectStorage.js # LocalStorage API
│   ├── public/
│   │   └── index.html
│   └── package.json
├── output-sites/              # Generated sites
├── templates/                 # Template courses
└── docs/                      # Documentation
```

### Data Flow

1. **User creates/edits content** → State managed in React
2. **Auto-save** → LocalStorage via `projectStorage.js`
3. **Generate site** → POST to backend API
4. **Backend processes** → Creates HTML/CSS files
5. **Static files served** → Available at `/sites/[project-name]/`

## Setup and Installation

### Prerequisites

```bash
node --version  # v16 or higher
npm --version   # v7 or higher
```

### Clone and Install

```bash
# Clone repository
git clone <repo-url>
cd site-builder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Configuration

Create `.env` in `backend/` directory:

```bash
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
OUTPUT_DIR=../output-sites
```

### Running Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

## Frontend Development

### Component Architecture

#### State Management

Projects are stored in localStorage, no Redux needed for this POC:

```javascript
// projectStorage.js
export const saveProject = (project) => {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === project.id);
  
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem('site-builder-projects', JSON.stringify(projects));
};
```

#### Component Hierarchy

```
App
├── WelcomeScreen
├── ProjectList
│   ├── ProjectCard (multiple)
│   └── CreateProjectForm
└── Editor
    ├── Toolbar
    ├── Canvas
    │   └── ContentBlock (multiple)
    ├── PropertiesPanel
    └── PreviewModal
```

### Adding a New Content Block Type

1. **Define block type** in `Toolbar.js`:

```javascript
const addBlock = (type) => {
  const newBlock = {
    id: Date.now(),
    type: type,
    content: '',
    // Add type-specific properties
  };
  
  const updatedPage = {
    ...currentPage,
    content: [...currentPage.content, newBlock]
  };
  
  onUpdatePage(updatedPage);
};
```

2. **Add rendering logic** in `ContentBlock.js`:

```javascript
const renderBlockPreview = () => {
  switch (block.type) {
    case 'newType':
      return (
        <div className="preview-newtype">
          {block.content || 'New block content'}
        </div>
      );
    // ... other cases
  }
};
```

3. **Add properties form** in `PropertiesPanel.js`:

```javascript
{block.type === 'newType' && (
  <div className="form-group">
    <label>Content</label>
    <textarea
      value={block.content}
      onChange={(e) => handleUpdate('content', e.target.value)}
    />
  </div>
)}
```

4. **Add generation logic** in `backend/server.js`:

```javascript
function generateContentBlock(block) {
  switch (block.type) {
    case 'newType':
      return `
        <div class="content-block newtype-block">
          ${escapeHtml(block.content)}
        </div>
      `;
    // ... other cases
  }
}
```

### Styling Guidelines

- Use CSS variables for colors (defined in `App.css`)
- Follow BEM naming convention
- Keep component styles in separate `.css` files
- Maintain consistent spacing (8px grid system)

```css
/* Good */
.editor-header {
  background: var(--midnight-blue);
  padding: 1rem 2rem;
}

.editor-header__title {
  font-size: 1.5rem;
}

/* Avoid */
.header {
  background: #001f3d;  /* Use variable instead */
  padding: 16px 32px;   /* Use rem instead */
}
```

## Backend Development

### Server Structure

```javascript
// Middleware stack
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(logger);  // Custom logging
app.use(errorHandler);  // Error handling

// Routes
app.get('/api/health', ...);
app.post('/api/upload/image', ...);
app.post('/api/upload/video', ...);
app.post('/api/generate/site', ...);
app.post('/api/generate/scorm-12', ...);
app.post('/api/generate/scorm-2004', ...);
```

### Adding New API Endpoints

```javascript
// Add validation
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Validation logic
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors }
      });
    }
    next();
  };
};

// Create endpoint
app.post('/api/new-endpoint', 
  validateRequest({
    requiredField: { required: true, type: 'string' }
  }),
  (req, res, next) => {
    try {
      // Your logic here
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);
```

### File Upload Configuration

```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg|mp4|webm|ogg/;
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.test(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});
```

## API Reference

### Pedagogical Analysis (`frontend/src/utils/pedagogicalAnalysis.js`)
- `analyzeContentFlow(blocks)`: Returns a score and list of issues based on content structure.
- `detectLearningGaps(blocks, objectives)`: Identifies objectives not covered by content.
- `mapObjectivesAlignment(blocks, objectives)`: Maps blocks to objectives and calculates coverage.

### Quality Metrics (`frontend/src/utils/qualityMetrics.js`)
- `calculateQualityMetrics(projectData)`: Returns accessibility, readability, and overall quality scores.

### Learner Simulation (`frontend/src/utils/learnerSimulation.js`)
- `simulateLearner(blocks, persona)`: Predicts learner outcomes based on persona profiles.

### Collaboration (`backend/collaboration.js`)
- WebSocket-based real-time commenting and presence system.

### Health Check

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "status": "OK",
  "message": "Site Builder API is running",
  "timestamp": "2025-10-17T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Upload Image

**Endpoint:** `POST /api/upload/image`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
- `image`: File (multipart)

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "/uploads/image-1234567890.jpg",
    "filename": "image-1234567890.jpg",
    "size": 125432,
    "mimeType": "image/jpeg"
  }
}
```

### Generate Site

**Endpoint:** `POST /api/generate/site`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "projectName": "my-course",
  "pages": [
    {
      "id": 1,
      "title": "Welcome",
      "slug": "welcome",
      "content": [
        {
          "id": 1234567890,
          "type": "heading",
          "content": "Welcome to the Course"
        },
        {
          "id": 1234567891,
          "type": "text",
          "content": "This is the introduction..."
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Site generated successfully",
  "data": {
    "path": "/sites/my-course/index.html",
    "directory": "/full/path/to/output-sites/my-course",
    "pagesGenerated": 1,
    "timestamp": "2025-10-17T10:30:00.000Z"
  }
}
```

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": ["Additional info"],
    "timestamp": "2025-10-17T10:30:00.000Z",
    "path": "/api/endpoint"
  }
}
```

## Adding Features

### Adding a New Page Type

1. Update `projectStorage.js` schema
2. Add UI in `ProjectList.js`
3. Handle in `Editor.js`
4. Update backend generation

### Adding Templates

1. Create template JSON in `templates/`
2. Add to `TemplateGallery.js`
3. Load template on selection

Example template:

```json
{
  "name": "Basic Course",
  "description": "Simple single-page course",
  "pages": [
    {
      "id": 1,
      "title": "Welcome",
      "slug": "welcome",
      "content": [
        { "id": 1, "type": "heading", "content": "Course Title" },
        { "id": 2, "type": "text", "content": "Course description..." }
      ]
    }
  ]
}
```

### Adding User Authentication

For multi-user support:

1. Add backend authentication (JWT, OAuth)
2. Update API endpoints with auth middleware
3. Add login UI in frontend
4. Store user token in localStorage
5. Associate projects with users

## Testing

### Manual Testing

```bash
# Test backend endpoints
curl http://localhost:5000/api/health

# Test file upload
curl -X POST -F "image=@test.jpg" http://localhost:5000/api/upload/image
```

### Unit Testing (Coming Soon)

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Accessibility Testing

1. Use browser DevTools Lighthouse
2. Test with keyboard only (no mouse)
3. Use screen reader (NVDA, JAWS, VoiceOver)
4. Check color contrast ratios
5. Validate HTML semantics

## Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Creates optimized build in frontend/build/
```

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy backend
COPY backend/ ./backend/
RUN cd backend && npm install --production

# Copy frontend build
COPY frontend/build/ ./frontend/build/

EXPOSE 5000

CMD ["node", "backend/server.js"]
```

Build and run:

```bash
docker build -t site-builder .
docker run -p 5000:5000 site-builder
```

### Environment Variables (Production)

```bash
PORT=5000
NODE_ENV=production
UPLOAD_DIR=/var/data/uploads
OUTPUT_DIR=/var/data/output-sites
MAX_FILE_SIZE=52428800  # 50MB in bytes
CORS_ORIGIN=https://yourdomain.com
```

### Security Checklist

- [ ] Enable HTTPS
- [ ] Set secure CORS policy
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Sanitize user content
- [ ] Use environment variables for secrets
- [ ] Implement authentication
- [ ] Add logging and monitoring
- [ ] Regular dependency updates
- [ ] File upload restrictions

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Memoize expensive components
- Optimize images before upload
- Use production React build

### Backend
- Enable gzip compression
- Cache static assets
- Use CDN for uploads
- Database for projects (vs localStorage)
- Implement pagination

## Contributing

### Code Style

- Use ES6+ features
- Follow Airbnb JavaScript style guide
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Commit Message Format

```
feat: Add new content block type
fix: Resolve image upload issue
docs: Update API documentation
style: Format code according to style guide
refactor: Simplify block generation logic
test: Add unit tests for API endpoints
chore: Update dependencies
```

---

**Need Help?** Check the troubleshooting section or open an issue on GitHub.

*Last updated: October 2025*
