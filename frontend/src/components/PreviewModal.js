import React, { useState, useEffect } from 'react';
import './PreviewModal.css';

function PreviewModal({ isOpen, onClose, pages, projectName }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  if (!isOpen || !pages || pages.length === 0) {
    return null;
  }

  const currentPage = pages[currentPageIndex];

  const generatePreviewHTML = (page, projectName) => {
    const content = page.content || [];
    
    let contentHTML = '';
    content.forEach(block => {
      const { type, content: blockContent, alt, title, url } = block;

      switch(type) {
        case 'text':
          contentHTML += `<section class="content-block text-block" role="region" aria-label="Text content">
            <p>${escapeHtml(blockContent)}</p>
          </section>`;
          break;
        case 'heading':
          contentHTML += `<section class="content-block heading-block" role="region" aria-label="Section heading">
            <h2>${escapeHtml(blockContent)}</h2>
          </section>`;
          break;
        case 'image':
          contentHTML += `<section class="content-block image-block" role="region" aria-label="Image content">
            <figure>
              <img src="${escapeHtml(url)}" alt="${escapeHtml(alt || blockContent)}" loading="lazy">
              ${title ? `<figcaption>${escapeHtml(title)}</figcaption>` : ''}
            </figure>
          </section>`;
          break;
        case 'video':
          contentHTML += `<section class="content-block video-block" role="region" aria-label="Video content">
            <video controls aria-label="${escapeHtml(blockContent)}">
              <source src="${escapeHtml(url)}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            ${blockContent ? `<p>${escapeHtml(blockContent)}</p>` : ''}
          </section>`;
          break;
        default:
          contentHTML += `<section class="content-block">${escapeHtml(blockContent)}</section>`;
      }
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Preview of ${escapeHtml(page.title)}">
  <title>${escapeHtml(page.title)} - ${escapeHtml(projectName)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    
    header {
      background-color: #2c3e50;
      color: white;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    header h1 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    
    nav {
      margin-top: 1rem;
    }
    
    nav ul {
      list-style: none;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    nav a:hover, nav a:focus {
      background-color: rgba(255,255,255,0.2);
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
    
    main {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 2rem;
      min-height: 400px;
    }
    
    main h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }
    
    .content-block {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f9f9f9;
      border-left: 4px solid #3498db;
      border-radius: 4px;
    }
    
    .heading-block {
      background-color: #ecf0f1;
      border-left-color: #2980b9;
    }
    
    .heading-block h2 {
      color: #2c3e50;
      font-size: 1.5rem;
    }
    
    .text-block p {
      color: #555;
      line-height: 1.8;
    }
    
    .image-block figure {
      text-align: center;
      margin: 1rem 0;
    }
    
    .image-block img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .image-block figcaption {
      font-style: italic;
      color: #666;
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }
    
    .video-block video {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    footer {
      background-color: #2c3e50;
      color: white;
      text-align: center;
      padding: 1.5rem;
      margin-top: 2rem;
    }
    
    footer p {
      margin: 0;
    }
    
    /* Accessibility improvements */
    :focus-visible {
      outline: 2px solid #3498db;
      outline-offset: 2px;
    }
    
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    @media (max-width: 768px) {
      main {
        margin: 1rem auto;
        padding: 1rem;
      }
      
      main h1 {
        font-size: 1.5rem;
      }
      
      header h1 {
        font-size: 1.4rem;
      }
      
      nav ul {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <header role="banner">
    <h1>${escapeHtml(projectName)}</h1>
  </header>
  
  <main role="main">
    <h1>${escapeHtml(page.title)}</h1>
    ${contentHTML}
  </main>

  <footer role="contentinfo">
    <p>&copy; 2025 ${escapeHtml(projectName)}. All rights reserved.</p>
  </footer>
  
  <script>
    // Basic keyboard navigation for accessibility
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        parent.postMessage({ type: 'closePreview' }, '*');
      }
    });
  </script>
</body>
</html>`;
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const previewHTML = generatePreviewHTML(currentPage, projectName);

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <h2>Preview: {currentPage.title}</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close preview"
            title="Close preview (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="preview-controls">
          <button
            onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            aria-label="Previous page"
          >
            ← Previous
          </button>
          <span className="page-counter">
            Page {currentPageIndex + 1} of {pages.length}
          </span>
          <button
            onClick={() => setCurrentPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
            disabled={currentPageIndex === pages.length - 1}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>

        <div className="preview-content">
          <iframe
            key={iframeKey}
            title={`Preview of ${currentPage.title}`}
            srcDoc={previewHTML}
            sandbox="allow-same-origin"
          />
        </div>

        <div className="preview-footer">
          <p>Press Esc or click outside to close preview</p>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
