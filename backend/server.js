const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/sites', express.static('../output-sites'));

// Multer configuration
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

const upload = multer({ storage: storage });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Site Builder API is running' });
});

// Upload image
app.post('/api/upload/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    success: true,
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});

// Upload video
app.post('/api/upload/video', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    success: true,
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});

// Generate static site from page data
app.post('/api/generate/site', (req, res) => {
  try {
    const { projectName, pages } = req.body;
    
    if (!projectName || !pages) {
      return res.status(400).json({ error: 'Missing projectName or pages' });
    }

    const outputDir = path.join(process.env.OUTPUT_DIR || '../output-sites', projectName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate pages
    pages.forEach((page, index) => {
      const htmlContent = generateHTML(page, projectName);
      const filename = page.slug || `page-${index}`;
      fs.writeFileSync(
        path.join(outputDir, `${filename}.html`),
        htmlContent
      );
    });

    // Generate index page
    const indexContent = generateIndex(pages, projectName);
    fs.writeFileSync(
      path.join(outputDir, 'index.html'),
      indexContent
    );

    // Copy CSS
    const cssContent = generateCSS();
    fs.writeFileSync(
      path.join(outputDir, 'styles.css'),
      cssContent
    );

    res.json({
      success: true,
      message: 'Site generated successfully',
      path: `/sites/${projectName}/index.html`,
      directory: outputDir
    });
  } catch (error) {
    console.error('Error generating site:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate HTML
function generateHTML(page, projectName) {
  const content = page.content || [];
  
  let contentHTML = '';
  content.forEach(block => {
    contentHTML += generateContentBlock(block);
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.title)}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        <li><a href="index.html">Home</a></li>
      </ul>
    </nav>
  </header>
  
  <main role="main">
    <h1>${escapeHtml(page.title)}</h1>
    ${contentHTML}
  </main>

  <footer role="contentinfo">
    <p>&copy; 2025 ${escapeHtml(projectName)}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

function generateIndex(pages, projectName) {
  let pageLinks = pages.map(page => 
    `<li><a href="${page.slug || 'page'}.html">${escapeHtml(page.title)}</a></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(projectName)} - Home</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header role="banner">
    <h1>${escapeHtml(projectName)}</h1>
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        ${pageLinks}
      </ul>
    </nav>
  </header>
  
  <main role="main">
    <section aria-labelledby="welcome-heading">
      <h2 id="welcome-heading">Welcome to ${escapeHtml(projectName)}</h2>
      <p>Select a course from the navigation menu to get started.</p>
    </section>
  </main>

  <footer role="contentinfo">
    <p>&copy; 2025 ${escapeHtml(projectName)}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

function generateContentBlock(block) {
  const { type, content, alt, title, url } = block;

  switch(type) {
    case 'text':
      return `<section class="content-block text-block" role="region" aria-label="Text content">
        <p>${escapeHtml(content)}</p>
      </section>`;
    
    case 'heading':
      return `<section class="content-block heading-block" role="region" aria-label="Section heading">
        <h2>${escapeHtml(content)}</h2>
      </section>`;
    
    case 'image':
      return `<section class="content-block image-block" role="region" aria-label="Image content">
        <figure>
          <img src="${url}" alt="${escapeHtml(alt || 'Course image')}" />
          ${title ? `<figcaption>${escapeHtml(title)}</figcaption>` : ''}
        </figure>
      </section>`;
    
    case 'video':
      return `<section class="content-block video-block" role="region" aria-label="Video content">
        <video width="100%" height="auto" controls>
          <source src="${url}" type="video/mp4" />
          Your browser does not support the video tag. <a href="${url}">Download video</a>
        </video>
        ${title ? `<p><strong>${escapeHtml(title)}</strong></p>` : ''}
      </section>`;
    
    default:
      return '';
  }
}

function generateCSS() {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

nav a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
}

nav a:hover {
  color: #3498db;
  text-decoration: underline;
}

nav a:focus {
  outline: 3px solid #3498db;
  outline-offset: 2px;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

main h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 2.5rem;
}

main h2 {
  margin: 1.5rem 0 1rem 0;
  color: #34495e;
  font-size: 1.8rem;
}

.content-block {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.text-block p {
  line-height: 1.8;
  font-size: 1rem;
}

.image-block figure {
  text-align: center;
  margin: 1rem 0;
}

.image-block img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

.image-block figcaption {
  margin-top: 1rem;
  font-style: italic;
  color: #666;
  font-size: 0.95rem;
}

.video-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.video-block video {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 2rem 1rem;
  margin-top: 3rem;
}

/* Accessibility improvements */
:focus-visible {
  outline: 3px solid #3498db;
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #3498db;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  nav ul {
    gap: 1rem;
    flex-direction: column;
  }

  main h1 {
    font-size: 1.8rem;
  }

  main h2 {
    font-size: 1.3rem;
  }

  .content-block {
    padding: 1rem;
  }
}

/* Print styles for accessibility */
@media print {
  nav, footer {
    display: none;
  }

  body {
    background: white;
    color: black;
  }

  a {
    text-decoration: underline;
  }
}`;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Start server
app.listen(PORT, () => {
  console.log(`Site Builder backend running on http://localhost:${PORT}`);
});
