import React, { useState, useEffect } from 'react';
import './AccessibilityChecker.css';

const AccessibilityChecker = ({ project, currentPage, blocks }) => {
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [lastScanned, setLastScanned] = useState(null);

  // Mock accessibility scan function
  const scanForAccessibility = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const results = [];
      
      // Check for missing alt text in images
      blocks.forEach(block => {
        if (block.type === 'image' && (!block.alt || block.alt.trim() === '')) {
          results.push({
            id: `alt-${block.id}`,
            type: 'error',
            rule: 'Image Alt Text',
            description: 'All images must have descriptive alt text for screen readers',
            element: `Image: ${block.url || 'unnamed'}`,
            severity: 'high'
          });
        }
      });
      
      // Check for heading structure
      let lastHeadingLevel = 1;
      blocks.forEach(block => {
        if (block.type === 'heading') {
          const headingText = block.content || '';
          const levelMatch = headingText.match(/^(H[1-6])/i);
          const currentLevel = levelMatch ? parseInt(levelMatch[0][1]) : 2; // default to h2
          
          // Check if heading structure is correct (no skipping levels)
          if (currentLevel > lastHeadingLevel + 1) {
            results.push({
              id: `heading-${block.id}`,
              type: 'warning',
              rule: 'Heading Structure',
              description: `Heading level should follow proper sequence. Expected H${lastHeadingLevel + 1}, found H${currentLevel}`,
              element: `Heading: ${headingText.substring(0, 30)}...`,
              severity: 'medium'
            });
          }
          lastHeadingLevel = currentLevel;
        }
      });
      
      // Check for contrast issues (simplified check)
      blocks.forEach(block => {
        if (block.type === 'text' && block.content && block.content.toLowerCase().includes('contrast')) {
          results.push({
            id: `contrast-${block.id}`,
            type: 'warning',
            rule: 'Color Contrast',
            description: 'Ensure sufficient color contrast for readability',
            element: `Text content`,
            severity: 'medium'
          });
        }
      });
      
      // Check for form labels (knowledge check questions)
      blocks.forEach(block => {
        if (block.type === 'knowledge-check') {
          if (!block.question || block.question.trim() === '') {
            results.push({
              id: `question-${block.id}`,
              type: 'error',
              rule: 'Question Text',
              description: 'Knowledge check questions must have descriptive text',
              element: `Knowledge Check`,
              severity: 'high'
            });
          }
          
          if (block.options && block.options.some(opt => !opt || opt.trim() === '')) {
            results.push({
              id: `option-${block.id}`,
              type: 'error',
              rule: 'Answer Options',
              description: 'All answer options should be clearly defined',
              element: `Knowledge Check Options`,
              severity: 'high'
            });
          }
        }
      });
      
      // Add some positive findings
      if (blocks.some(b => b.type === 'image' && b.alt && b.alt.trim() !== '')) {
        results.push({
          id: 'good-alt',
          type: 'notice',
          rule: 'Good Alt Text',
          description: 'Found images with proper alt text',
          element: 'Alt text is present',
          severity: 'low'
        });
      }
      
      if (blocks.some(b => b.type === 'heading')) {
        results.push({
          id: 'headings',
          type: 'notice',
          rule: 'Heading Structure',
          description: 'Headeings help organize content for accessibility',
          element: 'Headings present',
          severity: 'low'
        });
      }
      
      setScanResults(results);
      setOverallScore(Math.max(0, 100 - (results.filter(r => r.type === 'error').length * 15)));
      setLastScanned(new Date().toISOString());
      setIsScanning(false);
    }, 1500);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getIssueCount = (type) => {
    return scanResults.filter(r => r.type === type).length;
  };

  useEffect(() => {
    // Auto-scan when blocks change
    if (blocks.length > 0) {
      scanForAccessibility();
    }
  }, [blocks]);

  return (
    <div className="accessibility-checker">
      <div className="checker-header">
        <h3>Accessibility Checker</h3>
        <button 
          className="scan-btn"
          onClick={scanForAccessibility}
          disabled={isScanning || blocks.length === 0}
        >
          {isScanning ? 'Scanning...' : 'Scan Content'}
        </button>
      </div>
      
      <p>Ensure your content meets WCAG 2.1 AA standards for accessibility.</p>
      
      {blocks.length === 0 ? (
        <div className="no-content">
          <p>Add content to your page to run accessibility checks.</p>
        </div>
      ) : (
        <>
          <div className="accessibility-score">
            <div className="score-circle">
              <div 
                className="score-fill" 
                style={{ 
                  strokeDashoffset: 100 - (overallScore) 
                }}
              ></div>
              <div className="score-text">{overallScore}%</div>
            </div>
            <div className="score-details">
              <div className="score-title">Accessibility Score</div>
              <div className="score-description">
                {overallScore >= 90 ? 'Excellent' : 
                 overallScore >= 75 ? 'Good' : 
                 overallScore >= 50 ? 'Fair' : 'Needs Improvement'}
              </div>
              {lastScanned && (
                <div className="last-scanned">
                  Last scanned: {new Date(lastScanned).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          <div className="issue-summary">
            <div className="issue-summary-item error">
              <span className="count">{getIssueCount('error')}</span>
              <span className="label">Errors</span>
            </div>
            <div className="issue-summary-item warning">
              <span className="count">{getIssueCount('warning')}</span>
              <span className="label">Warnings</span>
            </div>
            <div className="issue-summary-item notice">
              <span className="count">{getIssueCount('notice')}</span>
              <span className="label">Notices</span>
            </div>
          </div>

          <div className="scan-results">
            {isScanning ? (
              <div className="scanning-indicator">
                <div className="spinner"></div>
                <p>Analyzing content for accessibility issues...</p>
              </div>
            ) : (
              <>
                {scanResults.length > 0 ? (
                  <div className="results-list">
                    {scanResults.map(result => (
                      <div key={result.id} className={`result-item ${result.type} ${result.severity}`}>
                        <div className="result-header">
                          <div className="result-icon" style={{ color: getSeverityColor(result.severity) }}>
                            {result.type === 'error' ? '❌' : 
                             result.type === 'warning' ? '⚠️' : 'ℹ️'}
                          </div>
                          <div className="result-rule">
                            <div className="rule-name">{result.rule}</div>
                            <div className="element">{result.element}</div>
                          </div>
                          <div className="result-actions">
                            <button className="fix-btn">Fix</button>
                          </div>
                        </div>
                        <div className="result-description">
                          {result.description}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-issues">
                    <div className="checkmark">✓</div>
                    <h4>No accessibility issues detected!</h4>
                    <p>Your content meets accessibility standards.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      <div className="accessibility-guidelines">
        <h4>WCAG 2.1 Guidelines</h4>
        <ul>
          <li>Provide alternative text for images</li>
          <li>Use proper heading structure</li>
          <li>Ensure sufficient color contrast</li>
          <li>Include captions for videos</li>
          <li>Use descriptive link text</li>
          <li>Make content keyboard accessible</li>
          <li>Provide transcripts for audio content</li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityChecker;