import React, { useState, useEffect } from 'react';
import './AccessibilityComplianceChecker.css';

function AccessibilityComplianceChecker({ 
  project, 
  currentPage, 
  blocks, 
  onBack,
  onRunCheck,
  initialResults
}) {
  const [scanResults, setScanResults] = useState(initialResults || []);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Mock scan results - in a real implementation, this would come from an actual accessibility scan
  const mockScanResults = [
    {
      id: 1,
      type: 'error',
      element: 'Image without alt text',
      description: 'An image is missing descriptive alt text',
      suggestions: [
        'Add descriptive alt text that conveys the image\'s purpose',
        'If the image is purely decorative, use an empty alt attribute'
      ],
      severity: 'high',
      blockId: 123,
      blockType: 'image',
      blockContent: 'Missing alt text on training diagram'
    },
    {
      id: 2,
      type: 'warning',
      element: 'Low color contrast',
      description: 'Text and background colors don\'t meet contrast requirements',
      suggestions: [
        'Increase contrast between text and background',
        'Use a contrast checker tool to ensure WCAG 2.1 AA compliance'
      ],
      severity: 'medium',
      blockId: 124,
      blockType: 'text',
      blockContent: 'Course introduction text'
    },
    {
      id: 3,
      type: 'notice',
      element: 'Missing skip link',
      description: 'No skip link provided to bypass navigation',
      suggestions: [
        'Add a "Skip to main content" link at the top of the page',
        'Ensure the link is visible when focused'
      ],
      severity: 'low',
      blockId: null,
      blockType: 'layout',
      blockContent: 'Page navigation'
    },
    {
      id: 4,
      type: 'error',
      element: 'Form without label',
      description: 'Knowledge check question missing proper label',
      suggestions: [
        'Add proper form labels for all inputs',
        'Use aria-label or aria-labelledby attributes where appropriate'
      ],
      severity: 'high',
      blockId: 125,
      blockType: 'knowledge-check',
      blockContent: 'Multiple choice question'
    }
  ];

  const runAccessibilityScan = async () => {
    setIsScanning(true);
    
    // In a real implementation, this would scan the actual content
    // For now, we'll simulate the scan with a delay
    setTimeout(() => {
      const results = [...mockScanResults]; // Use mock data for now
      setScanResults(results);
      setIsScanning(false);
      
      if (onRunCheck) {
        onRunCheck(results);
      }
    }, 1500);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#d9534f';
      case 'medium': return '#f0ad4e';
      case 'low': return '#5bc0de';
      default: return '#777';
    }
  };

  const getIssueCount = (type) => {
    return scanResults.filter(issue => issue.type === type).length;
  };

  const getBlockByIssue = (issue) => {
    if (!issue.blockId) return null;
    return blocks.find(block => block.id === issue.blockId);
  };

  return (
    <div className="accessibility-compliance-checker">
      <div className="checker-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Editor
        </button>
        <h1>Accessibility Compliance Checker</h1>
        <button 
          className="scan-button" 
          onClick={runAccessibilityScan}
          disabled={isScanning}
        >
          {isScanning ? 'Scanning...' : 'Run Accessibility Check'}
        </button>
      </div>

      {scanResults.length > 0 && (
        <div className="checker-overview">
          <div className="compliance-summary">
            <div className="metric high">
              <div className="count">{getIssueCount('error')}</div>
              <div className="label">Critical Issues</div>
            </div>
            <div className="metric medium">
              <div className="count">{getIssueCount('warning')}</div>
              <div className="label">Warnings</div>
            </div>
            <div className="metric low">
              <div className="count">{getIssueCount('notice')}</div>
              <div className="label">Notices</div>
            </div>
            <div className="metric overall">
              <div className="count">
                {scanResults.length > 0 
                  ? Math.max(0, 100 - Math.round((scanResults.length * 5))) 
                  : 100}%
              </div>
              <div className="label">Compliance</div>
            </div>
          </div>
        </div>
      )}

      <div className="checker-body">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Issues Overview
          </button>
          <button 
            className={`tab ${activeTab === 'guidelines' ? 'active' : ''}`}
            onClick={() => setActiveTab('guidelines')}
          >
            WCAG Guidelines
          </button>
          <button 
            className={`tab ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Full Report
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="issues-overview">
              <div className="filters">
                <button className="filter active">All Issues</button>
                <button className="filter">Critical</button>
                <button className="filter">Warnings</button>
                <button className="filter">Notices</button>
              </div>

              <div className="issues-list">
                {scanResults.map(issue => (
                  <div 
                    key={issue.id} 
                    className={`issue-item ${issue.type} ${issue.severity}`}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="issue-header">
                      <div className="issue-type">
                        <span className="type-icon">
                          {issue.type === 'error' ? '❌' : 
                           issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </span>
                        <span className="type-label">{issue.type}</span>
                      </div>
                      <div className="issue-element">{issue.element}</div>
                      <div className="issue-block" title={issue.blockContent}>
                        {issue.blockType}
                        {issue.blockId ? ` #${issue.blockId}` : ''}
                      </div>
                    </div>
                    <div className="issue-description">{issue.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="guidelines-content">
              <h3>WCAG 2.1 Compliance Guidelines</h3>
              <div className="guidelines-section">
                <h4>Level A (Basic accessibility)</h4>
                <ul>
                  <li>All non-text content has appropriate text alternatives</li>
                  <li>Content is adaptable and can be presented in different ways</li>
                  <li>Content is distinguishable from its background</li>
                  <li>Users can navigate and find content via keyboard</li>
                </ul>
              </div>
              
              <div className="guidelines-section">
                <h4>Level AA (Standard accessibility)</h4>
                <ul>
                  <li>Text and background have sufficient contrast ratio (at least 4.5:1)</li>
                  <li>Images of text are only used for essential purposes</li>
                  <li>Multiple ways to locate a web page are provided</li>
                  <li>Headings and labels describe topic or purpose</li>
                </ul>
              </div>
              
              <div className="guidelines-section">
                <h4>Level AAA (Enhanced accessibility)</h4>
                <ul>
                  <li>Enhanced visual presentation of text and images of text</li>
                  <li>Reading level is appropriate for the content's purpose</li>
                  <li>Significant changes in content do not occur without user activation</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="report-content">
              <h3>Accessibility Audit Report</h3>
              <div className="report-summary">
                <p>Course: {project?.name || 'Untitled Project'}</p>
                <p>Scanned: {new Date().toLocaleDateString()}</p>
                <p>Pages: {project?.pages?.length || 1}</p>
                <p>Total Issues Found: {scanResults.length}</p>
              </div>
              
              <div className="detailed-issues">
                {scanResults.map(issue => (
                  <div key={issue.id} className="detailed-issue">
                    <h4>{issue.element} - {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}</h4>
                    <p><strong>Description:</strong> {issue.description}</p>
                    <p><strong>Located in:</strong> {issue.blockContent} ({issue.blockType})</p>
                    <div className="suggestions">
                      <strong>Suggestions:</strong>
                      <ul>
                        {issue.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedIssue && (
        <div className="issue-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Issue Details</h3>
              <button 
                className="close-modal" 
                onClick={() => setSelectedIssue(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="issue-detail">
                <h4>Issue: {selectedIssue.element}</h4>
                <p><strong>Type:</strong> {selectedIssue.type}</p>
                <p><strong>Description:</strong> {selectedIssue.description}</p>
                <p><strong>Affected Block:</strong> {selectedIssue.blockContent}</p>
                
                <div className="suggestions-section">
                  <h5>How to Fix:</h5>
                  <ul>
                    {selectedIssue.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="guidelines-reference">
                  <h5>Relevant WCAG Guidelines:</h5>
                  <ul>
                    <li>
                      <strong>1.1.1 Non-text Content</strong> - All non-text content has appropriate text alternatives
                    </li>
                    <li>
                      <strong>1.4.3 Contrast (Minimum)</strong> - Text and background have sufficient contrast ratio
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilityComplianceChecker;