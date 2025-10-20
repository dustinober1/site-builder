const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const scormCompliance = require('./scorm-compliance');

const app = express();
const PORT = process.env.PORT || 5000;

// Logging Middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      timestamp,
      path: req.url
    }
  });
};

// Request Validator Middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      if (rules.required && !value) {
        errors.push(`Field '${field}' is required`);
      }
      
      if (rules.type && value && typeof value !== rules.type) {
        errors.push(`Field '${field}' must be of type ${rules.type}`);
      }
      
      if (rules.minLength && value && value.length < rules.minLength) {
        errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors
        }
      });
    }
    
    next();
  };
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(logger);
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

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|svg/;
  const allowedVideoTypes = /mp4|webm|ogg/;
  
  const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
  
  if (file.fieldname === 'image' && allowedImageTypes.test(extname)) {
    cb(null, true);
  } else if (file.fieldname === 'video' && allowedVideoTypes.test(extname)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${extname}. Allowed types: ${file.fieldname === 'image' ? 'jpeg, jpg, png, gif, svg' : 'mp4, webm, ogg'}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'Site Builder API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Upload image
app.post('/api/upload/image', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: {
          message: 'No file uploaded',
          hint: 'Please select an image file to upload'
        }
      });
    }
    
    console.log(`Image uploaded successfully: ${req.file.filename}`);
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload video
app.post('/api/upload/video', upload.single('video'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: {
          message: 'No file uploaded',
          hint: 'Please select a video file to upload'
        }
      });
    }
    
    console.log(`Video uploaded successfully: ${req.file.filename}`);
    
    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (error) {
    next(error);
  }
});

// Generate static site from page data
app.post('/api/generate/site', validateRequest({
  projectName: { required: true, type: 'string', minLength: 1 },
  pages: { required: true, type: 'object' }
}), (req, res, next) => {
  try {
    const { projectName, pages } = req.body;
    
    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: {
          message: 'Pages must be a non-empty array'
        }
      });
    }

    console.log(`Generating site for project: ${projectName}`);

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
      console.log(`Generated page: ${filename}.html`);
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

    console.log(`Site generated successfully at: ${outputDir}`);

    res.json({
      success: true,
      message: 'Site generated successfully',
      data: {
        path: `/sites/${projectName}/index.html`,
        directory: outputDir,
        pagesGenerated: pages.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
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

// Hosted publishing endpoint
app.post('/api/publish/hosted', async (req, res) => {
  try {
    const { projectName, pages, customDomain, password } = req.body;
    
    if (!projectName || !pages) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing projectName or pages' 
      });
    }

    // In a real implementation, this would:
    // 1. Upload files to a cloud hosting service
    // 2. Set up custom domain if provided
    // 3. Configure password protection if requested
    // 4. Return a public URL
    
    // For now, we'll simulate the process
    const outputDir = path.join(process.env.OUTPUT_DIR || '../output-sites', `${projectName}-hosted`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create js directory for xAPI API
    const jsDir = path.join(outputDir, 'js');
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }

    // Generate xAPI API
    const xapiApi = scormCompliance.generateXAPIAPI();
    fs.writeFileSync(path.join(jsDir, 'xapi-api.js'), xapiApi);

    // Generate pages with xAPI integration
    pages.forEach((page, index) => {
      const htmlContent = generateHTML(page, projectName, pages);
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

    // Simulate upload to hosting service
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({
      success: true,
      message: 'Course published successfully',
      url: `https://${customDomain || projectName.toLowerCase().replace(/\s+/g, '-')}.mycourses.com`,
      customDomain: customDomain,
      passwordProtected: !!password
    });
  } catch (error) {
    console.error('Error publishing course:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Generate xAPI package
app.post('/api/generate/xapi', (req, res) => {
  try {
    const { projectName, pages } = req.body;
    
    if (!projectName || !pages) {
      return res.status(400).json({ error: 'Missing projectName or pages' });
    }

    const outputDir = path.join(process.env.OUTPUT_DIR || '../output-sites', `${projectName}-xapi`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create js directory for xAPI API
    const jsDir = path.join(outputDir, 'js');
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }

    // Generate xAPI API
    const xapiApi = scormCompliance.generateXAPIAPI();
    fs.writeFileSync(path.join(jsDir, 'xapi-api.js'), xapiApi);

    // Generate pages with xAPI integration
    pages.forEach((page, index) => {
      const htmlContent = generateHTML(page, projectName, pages);
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
      message: 'xAPI package generated successfully',
      path: `/sites/${projectName}-xapi/index.html`,
      directory: outputDir,
      xapiVersion: '1.0.3'
    });
  } catch (error) {
    console.error('Error generating xAPI package:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate HTML
function generateHTML(page, projectName, allPages = []) {
  const content = page.content || [];
  
  let contentHTML = '';
  content.forEach(block => {
    contentHTML += generateContentBlock(block);
  });
  
  // Generate navigation with prerequisites
  const navigationHTML = generateNavigation(page, allPages);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(page.title)} - Course material">
  <title>${escapeHtml(page.title)}</title>
  <link rel="stylesheet" href="styles.css">
  <script>
    // Learning path functionality
    function checkPrerequisites(pageId, prereqIds) {
      // In a real implementation, you would check if prerequisites are completed
      // For now, we'll just return true to allow navigation
      return true;
    }
    
    function navigateToPage(url, prereqIds) {
      if (prereqIds && prereqIds.length > 0) {
        if (checkPrerequisites(url, prereqIds)) {
          window.location.href = url;
        } else {
          alert('You must complete the prerequisite pages first.');
        }
      } else {
        window.location.href = url;
      }
    }
  </script>
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
    ${navigationHTML}
  </main>

  <footer role="contentinfo">
    <p>&copy; 2025 ${escapeHtml(projectName)}. All rights reserved.</p>
  </footer>
  
  <!-- xAPI Integration -->
  <script src="js/xapi-api.js"></script>
  <script>
    // Track page viewed
    document.addEventListener('DOMContentLoaded', function() {
      if (window.xAPI && window.xAPI.initialized) {
        window.xAPI.sendStatement({
          actor: {
            mbox: 'mailto:learner@example.com',
            name: 'Learner',
            objectType: 'Agent'
          },
          verb: {
            id: 'http://adlnet.gov/expapi/verbs/attempted',
            display: { 'en-US': 'attempted' }
          },
          object: {
            id: window.location.href,
            definition: {
              name: { 'en-US': '${escapeHtml(page.title)}' },
              description: { 'en-US': 'A page in the ${escapeHtml(projectName)} course' },
              type: 'http://adlnet.gov/expapi/activities/lesson'
            }
          }
        });
      }
    });
    
    // Track assessment interactions
    function trackAssessmentInteraction(assessmentId, response, success = null) {
      if (window.xAPI && window.xAPI.initialized) {
        const statement = {
          actor: {
            mbox: 'mailto:learner@example.com',
            name: 'Learner',
            objectType: 'Agent'
          },
          verb: {
            id: 'http://adlnet.gov/expapi/verbs/answered',
            display: { 'en-US': 'answered' }
          },
          object: {
            id: assessmentId,
            definition: {
              name: { 'en-US': 'Assessment ' + assessmentId },
              type: 'http://adlnet.gov/expapi/activities/cmi.interaction'
            }
          },
          result: {
            response: response
          }
        };
        
        if (success !== null) {
          statement.result.success = success;
        }
        
        window.xAPI.sendStatement(statement);
      }
    }
    
    // Track completion
    window.addEventListener('beforeunload', function() {
      if (window.xAPI && window.xAPI.initialized) {
        window.xAPI.sendStatement({
          actor: {
            mbox: 'mailto:learner@example.com',
            name: 'Learner',
            objectType: 'Agent'
          },
          verb: {
            id: 'http://adlnet.gov/expapi/verbs/terminated',
            display: { 'en-US': 'terminated' }
          },
          object: {
            id: window.location.href,
            definition: {
              name: { 'en-US': '${escapeHtml(page.title)}' },
              type: 'http://adlnet.gov/expapi/activities/lesson'
            }
          }
        });
      }
    });
  </script>
</body>
</html>`;
}

function generateNavigation(currentPage, allPages) {
  if (!allPages || allPages.length <= 1) {
    return '';
  }
  
  const currentIndex = allPages.findIndex(p => p.id === currentPage.id);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;
  
  let navHTML = '<nav class="page-navigation" aria-label="Page navigation">';
  navHTML += '<ul>';
  
  if (prevPage) {
    navHTML += `<li><a class="nav-link prev" href="${prevPage.slug || 'page-' + (currentIndex - 1)}.html">← Previous: ${escapeHtml(prevPage.title)}</a></li>`;
  }
  
  // Add table of contents
  navHTML += '<li class="toc"><h3>Course Contents</h3><ul class="toc-list">';
  allPages.forEach((page, index) => {
    const isCurrent = page.id === currentPage.id;
    const pageLink = page.slug || `page-${index}`;
    navHTML += `<li class="${isCurrent ? 'current' : ''}"><a href="${pageLink}.html">${index + 1}. ${escapeHtml(page.title)}</a></li>`;
  });
  navHTML += '</ul></li>';
  
  if (nextPage) {
    navHTML += `<li><a class="nav-link next" href="${nextPage.slug || 'page-' + (currentIndex + 1)}.html">Next: ${escapeHtml(nextPage.title)} →</a></li>`;
  }
  
  navHTML += '</ul>';
  navHTML += '</nav>';
  
  return navHTML;
}

function generateIndex(pages, projectName) {
  let pageLinks = pages.map((page, idx) => 
    `<li><a href="${page.slug || `page-${idx}`}.html">${escapeHtml(page.title)}</a></li>`
  ).join('\n');

  // Generate navigation for index page too
  const navigationHTML = generateNavigation({ id: 'index', title: 'Home', slug: 'index' }, pages);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Home page for ${escapeHtml(projectName)} course">
  <title>${escapeHtml(projectName)} - Home</title>
  <link rel="stylesheet" href="styles.css">
  <script>
    // Learning path functionality
    function checkPrerequisites(pageId, prereqIds) {
      // In a real implementation, you would check if prerequisites are completed
      // For now, we'll just return true to allow navigation
      return true;
    }
    
    function navigateToPage(url, prereqIds) {
      if (prereqIds && prereqIds.length > 0) {
        if (checkPrerequisites(url, prereqIds)) {
          window.location.href = url;
        } else {
          alert('You must complete the prerequisite pages first.');
        }
      } else {
        window.location.href = url;
      }
    }
  </script>
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
    
    ${navigationHTML}
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
    
    case 'knowledge-check':
      return generateAssessmentBlock(block);
    
    case 'drag-and-drop':
      return generateDragAndDropBlock(block);
    
    case 'hotspot':
      return generateHotspotBlock(block);
    
    default:
      return '';
  }
}

function generateAssessmentBlock(block) {
  const { question, questionType = 'multiple-choice', options, correctAnswer, feedback, correctFeedback, incorrectFeedback, items, choices } = block;
  
  // Escape HTML for security
  const escapedQuestion = escapeHtml(question || '');
  const escapedFeedback = escapeHtml(feedback || '');
  const escapedCorrectFeedback = escapeHtml(correctFeedback || 'Correct!');
  const escapedIncorrectFeedback = escapeHtml(incorrectFeedback || 'Please try again.');
  
  let assessmentHtml = '';
  
  switch(questionType) {
    case 'multiple-choice':
      assessmentHtml = `
        <section class="content-block assessment-block" role="region" aria-label="Knowledge check">
          <div class="assessment-header">
            <h3>${escapedQuestion}</h3>
            <span class="question-type">Multiple Choice</span>
          </div>
          <form class="assessment-form" onsubmit="handleAssessmentSubmit(event, ${JSON.stringify(correctAnswer).replace(/"/g, '&quot;')})">
            <div class="assessment-options">
              ${(options || []).map((opt, idx) => `
                <div class="option-item">
                  <label>
                    <input type="radio" name="answer-${block.id}" value="${idx}" />
                    <span>${escapeHtml(opt)}</span>
                  </label>
                </div>
              `).join('')}
            </div>
            <button type="submit" class="submit-btn">Submit Answer</button>
          </form>
          <div class="feedback-container" style="display:none;">
            <p class="feedback"></p>
          </div>
        </section>
      `;
      break;
      
    case 'true-false':
      assessmentHtml = `
        <section class="content-block assessment-block" role="region" aria-label="Knowledge check">
          <div class="assessment-header">
            <h3>${escapedQuestion}</h3>
            <span class="question-type">True/False</span>
          </div>
          <form class="assessment-form" onsubmit="handleAssessmentSubmit(event, '${correctAnswer}')">
            <div class="assessment-options">
              <div class="option-item">
                <label>
                  <input type="radio" name="answer-${block.id}" value="true" />
                  <span>True</span>
                </label>
              </div>
              <div class="option-item">
                <label>
                  <input type="radio" name="answer-${block.id}" value="false" />
                  <span>False</span>
                </label>
              </div>
            </div>
            <button type="submit" class="submit-btn">Submit Answer</button>
          </form>
          <div class="feedback-container" style="display:none;">
            <p class="feedback"></p>
          </div>
        </section>
      `;
      break;
      
    case 'fill-in-the-blank':
      assessmentHtml = `
        <section class="content-block assessment-block" role="region" aria-label="Knowledge check">
          <div class="assessment-header">
            <h3>${escapedQuestion}</h3>
            <span class="question-type">Fill in the Blank</span>
          </div>
          <form class="assessment-form" onsubmit="handleAssessmentSubmit(event, '${escapeHtml(correctAnswer || '')}')">
            <div class="assessment-input">
              <input type="text" id="answer-${block.id}" placeholder="Type your answer here..." />
            </div>
            <button type="submit" class="submit-btn">Submit Answer</button>
          </form>
          <div class="feedback-container" style="display:none;">
            <p class="feedback"></p>
          </div>
        </section>
      `;
      break;
      
    case 'matching':
      assessmentHtml = `
        <section class="content-block assessment-block" role="region" aria-label="Knowledge check">
          <div class="assessment-header">
            <h3>${escapedQuestion}</h3>
            <span class="question-type">Matching</span>
          </div>
          <form class="assessment-form" onsubmit="handleAssessmentSubmit(event, [${(correctAnswer || []).join(',')}])">
            <div class="assessment-matching">
              ${(items || []).map((item, idx) => `
                <div class="matching-item">
                  <span class="matching-stem">${escapeHtml(item.stem)}</span>
                  <span class="matching-connector">matches</span>
                  <select id="match-${block.id}-${idx}">
                    <option value="">Select...</option>
                    ${(choices || []).map((choice, choiceIdx) => `
                      <option value="${choiceIdx}">${escapeHtml(choice)}</option>
                    `).join('')}
                  </select>
                </div>
              `).join('')}
            </div>
            <button type="submit" class="submit-btn">Submit Answer</button>
          </form>
          <div class="feedback-container" style="display:none;">
            <p class="feedback"></p>
          </div>
        </section>
      `;
      break;
      
    default:
      assessmentHtml = `
        <section class="content-block assessment-block" role="region" aria-label="Knowledge check">
          <div class="assessment-header">
            <h3>${escapedQuestion}</h3>
          </div>
          <div class="assessment-content">
            <p>Assessment type not recognized</p>
          </div>
        </section>
      `;
  }
  
  // Add JavaScript for client-side assessment handling
  assessmentHtml += `
    <script>
      function handleAssessmentSubmit(event, correctAnswer) {
        event.preventDefault();
        const form = event.target;
        const feedbackContainer = form.nextElementSibling;
        const feedbackElement = feedbackContainer.querySelector('.feedback');
        let userAnswer;
        let isCorrect = false;
        
        // Determine the user's answer based on question type
        if (Array.isArray(correctAnswer)) {
          // Matching question - collect all selections
          userAnswer = [];
          for (let i = 0; i < correctAnswer.length; i++) {
            const matchSelect = document.getElementById('match-' + ${block.id} + '-' + i);
            if (matchSelect) {
              userAnswer.push(parseInt(matchSelect.value));
            }
          }
          isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
        } else {
          // Multiple choice, true/false, or fill-in-the-blank
          const inputs = form.querySelectorAll('input[type="radio"], input[type="text"]');
          if (inputs[0] && inputs[0].type === 'text') {
            // Fill-in-the-blank
            userAnswer = inputs[0].value.trim().toLowerCase();
            isCorrect = userAnswer === correctAnswer.toLowerCase();
          } else {
            // Multiple choice or true/false
            const selectedOption = form.querySelector('input[type="radio"]:checked');
            userAnswer = selectedOption ? selectedOption.value : '';
            isCorrect = userAnswer == correctAnswer;
          }
        }
        
        // Track assessment with xAPI
        trackAssessmentInteraction('assessment-${block.id}', userAnswer, isCorrect);
        
        // Show feedback
        feedbackContainer.style.display = 'block';
        if (isCorrect) {
          feedbackElement.textContent = '${escapedCorrectFeedback}';
          feedbackElement.className = 'feedback correct';
        } else {
          feedbackElement.textContent = '${escapedIncorrectFeedback}';
          feedbackElement.className = 'feedback incorrect';
        }
      }
    </script>
  `;
  
  return assessmentHtml;
}

function generateDragAndDropBlock(block) {
  const { question, items = [], targets = [], correctMapping = {}, correctFeedback, incorrectFeedback } = block;
  
  const escapedQuestion = escapeHtml(question || 'Drag the items to the correct targets');
  const escapedCorrectFeedback = escapeHtml(correctFeedback || 'Perfect! All items matched correctly.');
  const escapedIncorrectFeedback = escapeHtml(incorrectFeedback || 'Some matches need correction.');
  
  let html = `
    <section class="content-block interactive-block drag-and-drop-block" role="region" aria-label="Drag and drop exercise">
      <div class="interactive-header">
        <h3>${escapedQuestion}</h3>
      </div>
      
      <div class="drag-container">
        <div class="items-area">
          <h4>Items to Drag</h4>
          <div class="items-list">
  `;
  
  items.forEach(item => {
    html += `
            <div 
              class="draggable-item" 
              draggable="true" 
              ondragstart="dragStart(event, '${escapeHtml(item.id)}')"
            >
              ${escapeHtml(item.content)}
            </div>
    `;
  });
  
  html += `
          </div>
        </div>
        
        <div class="targets-area">
          <h4>Drop Targets</h4>
          <div class="targets-list">
  `;
  
  targets.forEach(target => {
    html += `
            <div 
              class="drop-target" 
              ondragover="allowDrop(event)" 
              ondrop="drop(event, '${escapeHtml(target.id)}')"
              id="target-${escapeHtml(target.id)}"
            >
              <div class="target-label">${escapeHtml(target.label)}</div>
              <div class="target-content" id="content-${escapeHtml(target.id)}"></div>
            </div>
    `;
  });
  
  html += `
          </div>
        </div>
      </div>
      
      <div class="interactive-actions">
        <button class="submit-btn" onclick="checkDragAndDrop('${escapeHtml(JSON.stringify(correctMapping).replace(/'/g, '&apos;'))}')">Submit Answer</button>
        <button class="reset-btn" onclick="resetDragAndDrop()">Reset</button>
      </div>
      
      <div class="feedback-container" style="display:none;">
        <p class="feedback"></p>
      </div>
    </section>
    
    <script>
      let dragData = {};
      
      function dragStart(e, id) {
        e.dataTransfer.setData("text", id);
      }
      
      function allowDrop(e) {
        e.preventDefault();
      }
      
      function drop(e, targetId) {
        e.preventDefault();
        const data = e.dataTransfer.getData("text");
        document.getElementById('content-' + targetId).innerHTML = 
          document.querySelector('.draggable-item[ondragstart*="' + data + '"]').innerHTML;
        dragData[targetId] = data;
      }
      
      function checkDragAndDrop(correctMappingStr) {
        const correctMapping = JSON.parse(correctMappingStr.replace(/&apos;/g, "'"));
        let correctCount = 0;
        const total = Object.keys(correctMapping).length;
        const responses = [];
        
        for (const [targetId, expectedItemId] of Object.entries(correctMapping)) {
          const userResponse = dragData[targetId] || '';
          responses.push(targetId + ':' + userResponse);
          
          if (userResponse === expectedItemId) {
            document.getElementById('target-' + targetId).classList.add('correct');
            correctCount++;
          } else {
            document.getElementById('target-' + targetId).classList.add('incorrect');
          }
        }
        
        // Track drag and drop with xAPI
        const isCorrect = correctCount === total;
        trackAssessmentInteraction('draganddrop-${block.id}', responses.join('|'), isCorrect);
        
        const feedbackContainer = document.querySelector('.feedback-container');
        const feedbackElement = feedbackContainer.querySelector('.feedback');
        feedbackContainer.style.display = 'block';
        
        if (correctCount === total) {
          feedbackElement.textContent = '${escapedCorrectFeedback}';
          feedbackElement.className = 'feedback correct';
        } else {
          const score = Math.round((correctCount / total) * 100);
          feedbackElement.textContent = '${escapedIncorrectFeedback} Score: ' + score + '%';
          feedbackElement.className = 'feedback incorrect';
        }
      }
      
      function resetDragAndDrop() {
        dragData = {};
        document.querySelectorAll('.drop-target').forEach(target => {
          target.classList.remove('correct', 'incorrect');
          document.getElementById('content-' + target.id.replace('target-', '')).innerHTML = '';
        });
        document.querySelector('.feedback-container').style.display = 'none';
      }
    </script>
  `;
  
  return html;
}

function generateHotspotBlock(block) {
  const { question, imageUrl, alt, hotspots = [], correctHotspot, correctFeedback, incorrectFeedback } = block;
  
  const escapedQuestion = escapeHtml(question || 'Click on the correct area in the image');
  const escapedImageUrl = escapeHtml(imageUrl || '');
  const escapedAlt = escapeHtml(alt || 'Interactive image');
  const escapedCorrectFeedback = escapeHtml(correctFeedback || 'Correct! You identified the right area.');
  const escapedIncorrectFeedback = escapeHtml(incorrectFeedback || 'Incorrect. Please try again.');
  
  let html = `
    <section class="content-block interactive-block hotspot-block" role="region" aria-label="Hotspot image exercise">
      <div class="interactive-header">
        <h3>${escapedQuestion}</h3>
      </div>
      
      <div class="hotspot-container">
        <div class="image-container">
  `;
  
  if (escapedImageUrl) {
    html += `<img src="${escapedImageUrl}" alt="${escapedAlt}" id="hotspot-image" />`;
  }
  
  hotspots.forEach(hotspot => {
    html += `
          <div 
            class="hotspot-area" 
            style="top: ${hotspot.top}%; left: ${hotspot.left}%; width: ${hotspot.width}%; height: ${hotspot.height}%;"
            onclick="selectHotspot('${escapeHtml(hotspot.id)}')"
            id="hotspot-${escapeHtml(hotspot.id)}"
          ></div>
    `;
  });
  
  html += `
        </div>
      </div>
      
      <div class="interactive-actions">
        <button class="submit-btn" onclick="checkHotspot('${escapeHtml(correctHotspot || '')}')">Submit Answer</button>
        <button class="reset-btn" onclick="resetHotspot()">Reset</button>
      </div>
      
      <div class="feedback-container" style="display:none;">
        <p class="feedback"></p>
      </div>
    </section>
    
    <script>
      let selectedHotspot = null;
      
      function selectHotspot(hotspotId) {
        // Remove selected class from all hotspots
        document.querySelectorAll('.hotspot-area').forEach(hs => {
          hs.classList.remove('selected');
        });
        
        // Add selected class to clicked hotspot
        document.getElementById('hotspot-' + hotspotId).classList.add('selected');
        selectedHotspot = hotspotId;
      }
      
      function checkHotspot(correctHotspotId) {
        // Track hotspot selection with xAPI
        trackAssessmentInteraction('hotspot-${block.id}', selectedHotspot, selectedHotspot === correctHotspotId);
        
        const feedbackContainer = document.querySelector('.feedback-container');
        const feedbackElement = feedbackContainer.querySelector('.feedback');
        feedbackContainer.style.display = 'block';
        
        if (selectedHotspot === correctHotspotId) {
          // Mark correct hotspot
          document.getElementById('hotspot-' + correctHotspotId).classList.add('correct');
          feedbackElement.textContent = '${escapedCorrectFeedback}';
          feedbackElement.className = 'feedback correct';
        } else {
          // Mark correct hotspot
          document.getElementById('hotspot-' + correctHotspotId).classList.add('correct');
          feedbackElement.textContent = '${escapedIncorrectFeedback}';
          feedbackElement.className = 'feedback incorrect';
        }
      }
      
      function resetHotspot() {
        selectedHotspot = null;
        document.querySelectorAll('.hotspot-area').forEach(hs => {
          hs.classList.remove('selected', 'correct');
        });
        document.querySelector('.feedback-container').style.display = 'none';
      }
    </script>
  `;
  
  return html;
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
}

/* Assessment block styles */
.assessment-block {
  border: 2px solid #1863d6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #f8f9ff;
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e5ff;
}

.assessment-header h3 {
  margin: 0;
  color: #001f3d;
  font-size: 1.2rem;
}

.question-type {
  background-color: #1863d6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.assessment-form {
  margin: 1rem 0;
}

.assessment-options {
  margin: 1rem 0;
}

.option-item {
  margin-bottom: 0.5rem;
}

.option-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.option-item label:hover {
  background-color: #eef2ff;
}

.option-item input {
  margin-right: 0.5rem;
}

.assessment-input {
  margin: 1rem 0;
}

.assessment-input input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #b6cbe1;
  border-radius: 4px;
  font-size: 1rem;
}

.assessment-matching {
  margin: 1rem 0;
}

.matching-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.matching-stem {
  font-weight: bold;
  color: #001f3d;
}

.matching-connector {
  color: #666;
}

.matching-item select {
  padding: 0.25rem;
  border: 1px solid #b6cbe1;
  border-radius: 4px;
}

.submit-btn {
  background-color: #1863d6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #0a56c1;
}

.feedback {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: bold;
}

.feedback.correct {
  background-color: #e6f4ea;
  color: #0a7e3a;
  border: 1px solid #0a7e3a;
}

.feedback.incorrect {
  background-color: #fce8e6;
  color: #c5221f;
  border: 1px solid #c5221f;
}

/* Interactive block styles */
.interactive-block {
  border: 2px solid #1863d6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #f8f9ff;
}

.interactive-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e5ff;
}

.interactive-header h3 {
  margin: 0;
  color: #001f3d;
  font-size: 1.2rem;
}

/* Drag and Drop Styles */
.drag-and-drop-block .drag-container {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.drag-and-drop-block .items-area,
.drag-and-drop-block .targets-area {
  flex: 1;
  padding: 1rem;
  border: 1px solid #b6cbe1;
  border-radius: 4px;
  background-color: #f8f9ff;
}

.drag-and-drop-block .items-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.draggable-item {
  padding: 0.75rem;
  background-color: #eef2ff;
  border: 1px solid #b6cbe1;
  border-radius: 4px;
  cursor: move;
  user-select: none;
  transition: all 0.2s;
}

.draggable-item:hover {
  background-color: #dce6ff;
  transform: translateY(-2px);
}

.drop-target {
  min-height: 60px;
  padding: 0.75rem;
  border: 2px dashed #b6cbe1;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: white;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.drop-target.filled {
  border: 2px solid #1863d6;
  background-color: #f0f7ff;
}

.drop-target.correct {
  border: 2px solid #0a7e3a;
  background-color: #e6f4ea;
}

.drop-target.incorrect {
  border: 2px solid #c5221f;
  background-color: #fce8e6;
}

.target-label {
  font-weight: bold;
  color: #001f3d;
  margin-bottom: 0.25rem;
}

.target-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  background-color: #eef2ff;
  border-radius: 2px;
}

/* Hotspot Styles */
.hotspot-container {
  margin: 1rem 0;
  text-align: center;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  max-width: 100%;
  height: auto;
  border: 1px solid #b6cbe1;
  border-radius: 4px;
}

.hotspot-area {
  position: absolute;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.hotspot-area:hover {
  border-color: #1863d6;
  background-color: rgba(24, 99, 214, 0.1);
}

.hotspot-area.selected {
  border-color: #1863d6;
  background-color: rgba(24, 99, 214, 0.2);
}

.hotspot-area.correct {
  border-color: #0a7e3a;
  background-color: rgba(10, 126, 58, 0.2);
  animation: pulse 0.5s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Common Interactive Styles */
.interactive-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.submit-btn, .reset-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn {
  background-color: #1863d6;
  color: white;
}

.submit-btn:hover {
  background-color: #0a56c1;
}

.reset-btn {
  background-color: #f0f4ff;
  color: #1863d6;
}

.reset-btn:hover {
  background-color: #e0e8ff;
}

/* Page Navigation Styles */
.page-navigation {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9ff;
  border-radius: 8px;
  border: 1px solid #e0e5ff;
}

.page-navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.page-navigation li {
  margin-bottom: 0.75rem;
}

.page-navigation .toc h3 {
  margin: 0 0 1rem 0;
  color: #001f3d;
  font-size: 1.1rem;
}

.page-navigation .toc-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.page-navigation .toc-list li {
  margin-bottom: 0.25rem;
}

.page-navigation .toc-list a {
  display: block;
  padding: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  color: #1863d6;
  transition: background-color 0.2s;
}

.page-navigation .toc-list a:hover {
  background-color: #eef2ff;
}

.page-navigation .toc-list .current a {
  background-color: #1863d6;
  color: white;
  font-weight: bold;
}

.nav-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #1863d6;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #0a56c1;
}

.nav-link.prev {
  margin-right: 1rem;
}

.nav-link.next {
  float: right;
}

@media (max-width: 768px) {
  .page-navigation .toc-list {
    grid-template-columns: 1fr;
  }
  
  .nav-link.next {
    float: none;
    display: block;
    margin-top: 1rem;
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

// Error Handler (must be last)
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.url,
      method: req.method
    }
  });
});

// Start server
app.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Site Builder API Server`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`⏰ Started: ${timestamp}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`${'='.repeat(60)}\n`);
});
