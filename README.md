# E-Learning Site Builder - Proof of Concept

A modern, accessible web application for creating 508-compliant e-learning training websites using drag-and-drop. The builder generates static HTML/CSS sites that can be hosted on any server.

## 🎯 Key Features

### 1. **Drag-and-Drop Editor**
- Intuitive visual interface for building courses
- Supports Text, Headings, Images, and Videos
- Real-time preview of content
- Easy block reordering and management

### 2. **508 Compliance (WCAG 2.1 AA)**
- Semantic HTML5 structure with proper ARIA labels
- Mandatory alt text for images
- Video description requirements
- Keyboard navigation support (Tab, Enter, Space)
- High contrast color schemes
- Focus indicators on all interactive elements
- Screen reader optimized
- Skip links and navigation landmarks
- Responsive design for all devices

### 3. **Static Site Generation**
- Export complete websites as standalone HTML/CSS
- No dependencies or server required for hosting
- Perfect for local deployment or CDN distribution
- Optimized CSS with minimal footprint

### 4. **Professional Features**
- Multi-page course support
- Project management
- Local file upload support
- Responsive mobile-first design

## 🏗️ Project Structure

```
site-builder/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment configuration
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main application
│   │   ├── index.js       # Entry point
│   │   └── *.css          # Styling
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── output-sites/          # Generated static websites
├── templates/             # Site templates (future)
├── ACCESSIBILITY.md       # 508 compliance guide
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- A modern web browser

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

The backend server will start on `http://localhost:5000`

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000 npm start
```

The frontend will open at `http://localhost:3000`

## 💡 Using the Builder

### Creating a Course

1. **Welcome Screen**: Click "Create Your First Course"
2. **Project Setup**: Enter your course name
3. **Editor Mode**: 
   - Use the toolbar to add content blocks (Text, Heading, Image, Video)
   - Click blocks to select and edit properties
   - Drag arrows to reorder blocks
   - Click the delete button to remove blocks

### Adding Content

#### Text Block
- Click the "Text" button in the toolbar
- Edit the content in the Properties Panel
- Supports paragraphs and longer descriptions

#### Heading Block
- Click the "Heading" button
- Edit the heading text
- Creates semantic `<h2>` elements for proper document structure

#### Image Block
- Click the "Image" button
- Enter the image URL
- **Required**: Add descriptive alt text for 508 compliance
- Optionally add a title/caption

#### Video Block
- Click the "Video" button
- Enter the video URL (MP4 format recommended)
- **Required**: Add video description for 508 compliance
- Supports `<video>` controls for playback

### Exporting Your Site

1. Click the **"↓ Export Site"** button in the header
2. The system generates a static HTML website
3. View your site at `http://localhost:5000/sites/[course-name]/index.html`

## ♿ Accessibility Features

### Built-in 508 Compliance

See `ACCESSIBILITY.md` for complete details. Highlights include:

- **WCAG 2.1 Level AA** conformance
- **Semantic HTML5**: Proper use of `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`
- **ARIA Labels**: All interactive elements have descriptive labels
- **Alt Text Requirements**: Images require alt text before export
- **Keyboard Navigation**: 
  - Tab through all interactive elements
  - Enter/Space to activate buttons
  - Focus indicators on all elements
- **Color Contrast**: White text on dark backgrounds (> 7:1 ratio)
- **Responsive**: Scales from mobile to desktop
- **Skip Links**: Allow keyboard users to skip navigation
- **Form Labels**: All inputs have associated labels
- **Focus Management**: Visible focus indicators on all interactive elements

### Testing Your Site

After exporting, you can test accessibility with:

- **Axe DevTools** (Chrome/Firefox extension)
- **WAVE** accessibility browser extension
- **NVDA** or **JAWS** screen readers
- Chrome DevTools Lighthouse audit

## 📡 API Endpoints

### Backend Routes

- `GET /api/health` - Health check
- `POST /api/upload/image` - Upload image
- `POST /api/upload/video` - Upload video
- `POST /api/generate/site` - Generate static site

### Generate Site Payload

```json
{
  "projectName": "My Course",
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
          "content": "Learn the basics..."
        },
        {
          "id": 1234567892,
          "type": "image",
          "url": "http://localhost:5000/uploads/image-123.jpg",
          "alt": "Course overview diagram",
          "title": "Overview"
        }
      ]
    }
  ]
}
```

## 🎨 Customization

### Modifying Styles

Edit the CSS in generated `styles.css`:

```css
/* Main content area */
main {
  max-width: 1200px; /* Adjust content width */
  margin: 2rem auto;
  padding: 0 1rem;
}

/* Header styling */
header {
  background-color: #2c3e50; /* Change brand color */
  color: white;
}
```

### Extending Functionality

1. **Add new block types**: Edit `generateContentBlock()` in `backend/server.js`
2. **Custom components**: Add React components in `frontend/src/components/`
3. **Enhanced editor features**: Modify `Editor.js` and related components

## 📦 Deployment

### Local Server
Your generated sites are ready to serve from any HTTP server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (http-server package)
npx http-server output-sites/my-course -p 8000
```

### Cloud Hosting Options
- Netlify (drag & drop static files)
- Vercel (GitHub integration)
- AWS S3 + CloudFront
- GitHub Pages
- Any traditional web hosting

## 🔒 Security Considerations

For production deployment:

1. **Input Sanitization**: Validate all user inputs server-side
2. **File Upload Limits**: Restrict file types and sizes
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS appropriately for your domain
5. **Content Security Policy**: Implement CSP headers

## 📋 Known Limitations

- Currently supports single-level course structure (extensible)
- Media uploads are stored locally (recommend cloud storage for production)
- No built-in authentication (add for multi-user scenarios)
- No backup/version control (recommend Git integration)

## 🛠️ Troubleshooting

### "Cannot GET /sites/course-name/index.html"
- Ensure you've clicked "Export Site" button
- Check that the backend is running on port 5000
- Verify the project name matches

### Images/Videos not loading
- Check URL is publicly accessible
- Verify file format is supported
- Test URL in browser directly

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check for CSS file in generated site directory
- Verify file permissions (readable by web server)

## 🤝 Contributing

To extend this POC:

1. Add new content block types
2. Implement multi-page editor
3. Add image optimization
4. Create theme system
5. Build user authentication
6. Add database backend

## 📄 License

This proof of concept is provided as-is for demonstration purposes.

## 📞 Support

For issues or questions, check the troubleshooting section or review the component documentation in the code.

---

**Built with accessibility-first principles** ♿✨