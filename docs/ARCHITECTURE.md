# System Architecture

## High-Level Overview

The E-Learning Site Builder is a full-stack application with three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (3000)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Welcome    │  │  Projects    │  │   Editor     │        │
│  │   Screen     │  │   Manager    │  │   Interface  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                          │                                     │
│  Drag-and-Drop Canvas │ Properties Panel │ Toolbar           │
└──────────────────────┼─────────────────────────────────────────┘
                       │ HTTP/JSON
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Express.js Backend (5000)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes                                          │   │
│  │  • Health Check                                      │   │
│  │  • Image Upload                                      │   │
│  │  • Video Upload                                      │   │
│  │  • Generate Static Site                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                       │                                       │
│  HTML Generator │ CSS Generator │ File System Writer         │
└───────────────────────┼───────────────────────────────────────┘
                        │ File I/O
                        ▼
            ┌─────────────────────────────┐
            │  Output: Static HTML/CSS    │
            │  ┌──────────────────────┐   │
            │  │ output-sites/        │   │
            │  │ ├── index.html       │   │
            │  │ ├── page.html        │   │
            │  │ ├── styles.css       │   │
            │  │ └── uploads/         │   │
            │  └──────────────────────┘   │
            └─────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │   Any Web Server / CDN        │
        │   (GitHub Pages, S3, etc)     │
        └───────────────────────────────┘
```

## Component Breakdown

### Frontend (React)

#### App.js
- Main application component
- Manages view state (welcome, projects, editor)
- Routes between screens

#### Components

**WelcomeScreen.js**
- Landing page with features
- Call-to-action for creating courses

**ProjectList.js**
- Create new projects
- Manage existing projects
- Simple project persistence (localStorage for POC)

**Editor.js**
- Main editing interface
- Manages page and block state
- Handles site export

**Canvas.js**
- Displays content blocks
- Allows block selection
- Shows reordering controls

**ContentBlock.js**
- Individual block display
- Shows preview of content
- Block controls (move, delete)

**Toolbar.js**
- Add new content blocks
- Tips and hints
- Accessibility information

**PropertiesPanel.js**
- Edit block content
- Input fields for block properties
- Alt text enforcement
- Delete block functionality

### Backend (Node.js/Express)

#### server.js
Main server file with:

**API Endpoints**
- `GET /api/health` - Health check
- `POST /api/upload/image` - Image upload
- `POST /api/upload/video` - Video upload
- `POST /api/generate/site` - Generate static site

**Helper Functions**
- `generateHTML()` - Creates semantic HTML pages
- `generateIndex()` - Creates landing page
- `generateContentBlock()` - Renders individual content blocks
- `generateCSS()` - Creates accessible stylesheet
- `escapeHtml()` - Prevents XSS attacks

**File Storage**
- Multer: Handles file uploads
- Local filesystem: Stores generated sites

## Data Flow

### Creating Content

1. **User adds block**
   ```
   Toolbar → Editor.js → setBlocks() → Canvas.js
   ```

2. **User edits block**
   ```
   Select Block → PropertiesPanel → handleUpdateBlock() → setBlocks() → Canvas
   ```

3. **User reorders blocks**
   ```
   Move Buttons → handleMoveBlock() → setBlocks() → Canvas
   ```

### Exporting Site

1. **User clicks Export**
   ```
   Editor.js → axios.post(/api/generate/site)
   ```

2. **Backend processes**
   ```
   POST Request
   → Extract pages and blocks
   → Generate HTML for each page
   → Generate CSS
   → Write files to disk
   → Return success message
   ```

3. **Site accessible**
   ```
   http://localhost:5000/sites/[project-name]/
   ```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client
- **CSS** - Styling (no CSS framework for minimal dependencies)
- **HTML5** - Semantic markup

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Multer** - File upload handling
- **Sharp** - Image processing (future)
- **Dotenv** - Environment configuration

### DevTools
- **nodemon** - Development file watcher
- **react-scripts** - Build and dev server

## Accessibility Architecture

### Frontend Accessibility
- Semantic HTML components
- ARIA labels on all interactive elements
- Keyboard navigation throughout
- Focus management
- High contrast colors

### Generated Site Accessibility
- W3C compliant HTML structure
- ARIA roles and labels
- Semantic heading hierarchy
- Image alt text enforcement
- Video description requirement
- Responsive CSS with media queries
- Keyboard accessible forms

## Security Considerations

### Current Implementation
- HTML escaping to prevent XSS
- CORS enabled for local development
- File upload to local filesystem

### Production Recommendations
- Input validation on all fields
- File type and size restrictions
- HTTPS enforcement
- Content Security Policy headers
- Sanitize HTML before storage
- Implement user authentication
- Use cloud storage (S3, Azure) for files

## Scalability Considerations

### Current Limitations
- Single-server deployment
- Local file storage
- In-memory state management
- No database

### Future Improvements
- Database for project persistence
- User authentication system
- Multi-user collaboration
- Advanced role-based access
- CDN integration for media
- Version control for courses
- Analytics and reporting

## Development Workflow

### Adding New Features

1. **UI Changes**
   - Create/modify component in `frontend/src/components/`
   - Add styling in corresponding `.css` file
   - Update parent component state handling

2. **Backend Changes**
   - Add route in `backend/server.js`
   - Create helper function if needed
   - Test with Postman or curl

3. **Generated Site Changes**
   - Modify `generateHTML()` or `generateCSS()` in `backend/server.js`
   - Test by exporting a course
   - Verify accessibility compliance

### Testing

**Frontend Testing**
```bash
npm test
```

**Backend Testing**
```bash
# Test endpoint
curl http://localhost:5000/api/health
```

**Accessibility Testing**
- Browser: Axe DevTools
- Screen Reader: NVDA or VoiceOver
- Keyboard: Tab navigation only
- Contrast: Color Contrast Analyzer

## File Organization

### Modular Structure

```
Each component has:
- ComponentName.js    (React component)
- ComponentName.css   (Component styles)
```

### Separation of Concerns

- **Components**: UI and user interaction
- **App.js**: State management and routing
- **Backend**: Data processing and file generation
- **Styles**: Presentation layer (CSS)

## Performance Considerations

### Frontend
- Component-based rendering
- Efficient state updates
- Lazy loading of components
- CSS minimization

### Backend
- Streaming file responses
- Asynchronous file operations
- Input sanitization
- Error handling

### Generated Sites
- Minimal CSS (no framework bloat)
- HTML5 semantic structure
- No JavaScript required for basic content
- Responsive images and videos
- Print-friendly styles

---

This architecture balances simplicity (for POC) with scalability (for production upgrades).
