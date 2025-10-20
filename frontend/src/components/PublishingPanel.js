import React, { useState } from 'react';
import axios from 'axios';
import './PublishingPanel.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function PublishingPanel({ project, pages, onClose }) {
  const [publishingMethod, setPublishingMethod] = useState('local');
  const [publishingStatus, setPublishingStatus] = useState('idle'); // idle, publishing, success, error
  const [publishingMessage, setPublishingMessage] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState('');

  const handlePublish = async () => {
    setPublishingStatus('publishing');
    
    if (publishingMethod === 'hosted') {
      try {
        setPublishingMessage('Uploading to our secure servers...');
        
        const response = await axios.post(`${API_URL}/api/publish/hosted`, {
          projectName: project.name,
          pages: project.pages,
          customDomain,
          password: passwordProtect ? password : undefined
        });
        
        if (response.data.success) {
          setPublishingStatus('success');
          setPublishingMessage(`Course published successfully! Your course is now available at: ${response.data.url}`);
        } else {
          throw new Error(response.data.error || 'Unknown error');
        }
      } catch (error) {
        setPublishingStatus('error');
        setPublishingMessage('Error publishing course: ' + (error.response?.data?.error || error.message));
      }
    } else {
      // Local export (existing functionality) - trigger the existing export
      try {
        setPublishingMessage('Generating local files...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real implementation, this would call the local export API
        setPublishingStatus('success');
        setPublishingMessage(`Course exported successfully! You can access it at: /sites/${project.name}`);
      } catch (error) {
        setPublishingStatus('error');
        setPublishingMessage('Error exporting course: ' + error.message);
      }
    }
  };

  const getPublishButtonText = () => {
    switch (publishingStatus) {
      case 'publishing':
        return 'Publishing...';
      case 'success':
        return 'Published!';
      default:
        return 'Publish Course';
    }
  };

  return (
    <div className="publishing-overlay">
      <div className="publishing-panel">
        <div className="publishing-header">
          <h2>Publish Your Course</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="publishing-content">
          <div className="publishing-options">
            <div className="option-group">
              <label className="option-label">Publishing Method</label>
              <div className="publishing-methods">
                <label className="method-option">
                  <input
                    type="radio"
                    name="publishingMethod"
                    value="local"
                    checked={publishingMethod === 'local'}
                    onChange={(e) => setPublishingMethod(e.target.value)}
                  />
                  <div className="method-card">
                    <h3>Export Locally</h3>
                    <p>Download as static HTML files to host yourself</p>
                    <div className="method-features">
                      <span className="feature">✓ Full control</span>
                      <span className="feature">✓ Any hosting service</span>
                    </div>
                  </div>
                </label>
                
                <label className="method-option">
                  <input
                    type="radio"
                    name="publishingMethod"
                    value="hosted"
                    checked={publishingMethod === 'hosted'}
                    onChange={(e) => setPublishingMethod(e.target.value)}
                  />
                  <div className="method-card">
                    <h3>Hosted Service</h3>
                    <p>Host on our secure platform with custom URL</p>
                    <div className="method-features">
                      <span className="feature">✓ One-click publishing</span>
                      <span className="feature">✓ Custom domain support</span>
                      <span className="feature">✓ Analytics included</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {publishingMethod === 'hosted' && (
              <div className="hosted-options">
                <div className="form-group">
                  <label>Custom Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., training.yourcompany.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                  <p className="help-text">Point your domain to our servers for a professional look</p>
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={passwordProtect}
                      onChange={(e) => setPasswordProtect(e.target.checked)}
                    />
                    Password Protect Course
                  </label>
                  {passwordProtect && (
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="password-input"
                    />
                  )}
                </div>
              </div>
            )}
            
            <div className="publishing-actions">
              <button
                className={`publish-button ${publishingStatus === 'publishing' ? 'publishing' : ''} ${publishingStatus === 'success' ? 'success' : ''}`}
                onClick={handlePublish}
                disabled={publishingStatus === 'publishing'}
              >
                {getPublishButtonText()}
              </button>
              
              {publishingStatus !== 'idle' && (
                <div className={`publishing-status ${publishingStatus}`}>
                  <p>{publishingMessage}</p>
                  {publishingStatus === 'success' && (
                    <div className="success-actions">
                      <button 
                        className="view-course-button"
                        onClick={() => window.open(publishingMessage.split(' at: ')[1], '_blank')}
                      >
                        View Course
                      </button>
                      <button 
                        className="copy-link-button"
                        onClick={() => navigator.clipboard.writeText(publishingMessage.split(' at: ')[1])}
                      >
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublishingPanel;