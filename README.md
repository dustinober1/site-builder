# 🎓 E-Learning Site Builder

> A modern, accessible web application for creating 508-compliant e-learning training websites with drag-and-drop simplicity.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-61dafb.svg)](https://reactjs.org/)

## ✨ Overview

Site Builder is a professional e-learning authoring tool that enables anyone to create beautiful, accessible training courses without coding knowledge. Generate static HTML/CSS sites that are WCAG 2.1 AA compliant and can be deployed anywhere.

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

## � Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete user manual
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Technical documentation
- **[Changelog](docs/CHANGELOG.md)** - Version history

## 🛠️ Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /sites/..." | Click "Generate Site" button first |
| Images not loading | Verify URL is publicly accessible |
| Projects not saving | Check browser localStorage isn't full |
| Port already in use | Kill process or use different port |

## 🗺️ Roadmap

- [ ] Real-time collaboration
- [ ] Template marketplace
- [ ] AI-powered content suggestions
- [ ] LMS integrations (Canvas, Moodle)
- [ ] Analytics dashboard
- [ ] Video editor integration
- [ ] Multi-language support
- [ ] Theme customization UI

## 🤝 Contributing

We welcome contributions! Please see our [Developer Guide](docs/DEVELOPER_GUIDE.md) for details on:
- Setting up development environment
- Code style guidelines
- Adding new features
- Submitting pull requests

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## � Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/yourusername/site-builder/issues)
- 💡 [Request Features](https://github.com/yourusername/site-builder/issues/new)

## 🙏 Acknowledgments

Built with accessibility-first principles to ensure inclusive e-learning experiences for all users.

---

<div align="center">

**Made with ❤️ for accessible education**

[⬆ back to top](#-e-learning-site-builder)

</div>