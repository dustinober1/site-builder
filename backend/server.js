const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const scormCompliance = require('./scorm-compliance');

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

// Generate SCORM 1.2 package
app.post('/api/generate/scorm-12', (req, res) => {
  try {
    const { projectName, pages } = req.body;
    
    if (!projectName || !pages) {
      return res.status(400).json({ error: 'Missing projectName or pages' });
    }

    const outputDir = path.join(process.env.OUTPUT_DIR || '../output-sites', `${projectName}-scorm12`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create js directory for SCORM API
    const jsDir = path.join(outputDir, 'js');
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }

    // Generate SCORM API
    const scormApi = scormCompliance.generateSCORMAPI();
    fs.writeFileSync(path.join(jsDir, 'scorm-api.js'), scormApi);

    // Generate SCORM 1.2 manifest
    scormCompliance.generateSCORM12Manifest(projectName, pages, outputDir);

    // Generate pages with SCORM wrapper
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
      message: 'SCORM 1.2 package generated successfully',
      path: `/sites/${projectName}-scorm12/index.html`,
      directory: outputDir,
      scormVersion: '1.2'
    });
  } catch (error) {
    console.error('Error generating SCORM 1.2 package:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate SCORM 2004 package
app.post('/api/generate/scorm-2004', (req, res) => {
  try {
    const { projectName, pages } = req.body;
    
    if (!projectName || !pages) {
      return res.status(400).json({ error: 'Missing projectName or pages' });
    }

    const outputDir = path.join(process.env.OUTPUT_DIR || '../output-sites', `${projectName}-scorm2004`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create js directory for SCORM API
    const jsDir = path.join(outputDir, 'js');
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }

    // Generate SCORM API
    const scormApi = scormCompliance.generateSCORMAPI();
    fs.writeFileSync(path.join(jsDir, 'scorm-api.js'), scormApi);

    // Generate SCORM 2004 manifest
    scormCompliance.generateSCORM2004Manifest(projectName, pages, outputDir);

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
      message: 'SCORM 2004 package generated successfully',
      path: `/sites/${projectName}-scorm2004/index.html`,
      directory: outputDir,
      scormVersion: '2004'
    });
  } catch (error) {
    console.error('Error generating SCORM 2004 package:', error);
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
  <meta name="description" content="${escapeHtml(page.title)} - Course material">
  <title>${escapeHtml(page.title)}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        <li><a href="index.html" aria-current="page">Home</a></li>
      </ul>
    </nav>
  </header>
  
  <main id="main-content" role="main">
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
  let pageLinks = pages.map((page, idx) => 
    `<li><a href="${page.slug || `page-${idx}`}.html">${escapeHtml(page.title)}</a></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Home page for ${escapeHtml(projectName)} course">
  <title>${escapeHtml(projectName)} - Home</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <header role="banner">
    <h1>${escapeHtml(projectName)}</h1>
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        ${pageLinks}
      </ul>
    </nav>
  </header>
  
  <main id="main-content" role="main">
    <section aria-labelledby="welcome-heading">
      <h2 id="welcome-heading">Welcome to ${escapeHtml(projectName)}</h2>
      <p>Select a lesson from the navigation menu to get started.</p>
    </section>
    
    <section aria-labelledby="lessons-heading">
      <h2 id="lessons-heading">Available Lessons</h2>
      <ul>
        ${pageLinks}
      </ul>
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
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #001f3d;
  background-color: #f9f9f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Improved contrast for readability */
header {
  background-color: #001f3d;
  color: white;
  padding: 2rem 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 700;
}

nav {
  background-color: #151983;
  padding: 0.5rem 0;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 0 1rem;
}

nav li {
  margin: 0.5rem 0;
}

nav a {
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
}

nav a:hover,
nav a:focus {
  background-color: #1863d6;
  text-decoration: underline;
}

nav a:focus-visible {
  outline: 3px solid #b6cbe1;
  outline-offset: 2px;
}

main {
  flex: 1;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  width: 100%;
}

main h1 {
  margin-bottom: 2rem;
  color: #001f3d;
  font-size: 2.5rem;
  font-weight: 700;
}

main h2 {
  margin: 1.5rem 0 1rem 0;
  color: #151983;
  font-size: 1.8rem;
  font-weight: 600;
}

main h3 {
  margin: 1.2rem 0 0.8rem 0;
  color: #151983;
  font-size: 1.4rem;
  font-weight: 600;
}

.content-block {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-left: 4px solid #1863d6;
}

.text-block p {
  line-height: 1.8;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.text-block p:last-child {
  margin-bottom: 0;
}

.heading-block h2 {
  color: #001f3d;
  font-size: 1.5rem;
  font-weight: 600;
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
  border: 1px solid #b6cbe1;
}

.image-block figcaption {
  margin-top: 1rem;
  font-style: italic;
  color: #333333;
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
  border: 1px solid #b6cbe1;
}

footer {
  background-color: #001f3d;
  color: white;
  text-align: center;
  padding: 2rem 1rem;
  margin-top: 3rem;
}

footer p {
  margin: 0.5rem 0;
}

/* Accessibility improvements */
:focus-visible {
  outline: 3px solid #1863d6;
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #3498db;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 4px 0;
  font-weight: 600;
}

.skip-link:focus {
  top: 0;
}

/* Better text selection */
::selection {
  background-color: #3498db;
  color: white;
}

::-moz-selection {
  background-color: #3498db;
  color: white;
}

/* High contrast mode support */
@media (prefers-contrast: more) {
  body {
    color: #000;
  }
  
  .content-block {
    border-left-width: 6px;
    border: 2px solid #000;
  }
  
  nav a:focus-visible {
    outline-width: 4px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
  
  nav ul {
    gap: 0.5rem;
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
  
  header {
    padding: 1.5rem 1rem;
  }
  
  header h1 {
    font-size: 1.5rem;
  }
}

/* Large text support */
@media (min-width: 1400px) {
  html {
    font-size: 18px;
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
  
  .content-block {
    page-break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
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
