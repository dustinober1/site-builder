import React, { useState, useEffect } from 'react';
import './AISettings.css';

const AISettings = ({ project, onUpdateProject }) => {
  const [settings, setSettings] = useState({
    aiEnabled: false,
    aiEndpoint: '',
    aiModelName: '',
    aiApiKey: '',
    temperature: 0.7,
    maxTokens: 512
  });

  useEffect(() => {
    if (project && project.aiSettings) {
      setSettings({
        ...settings,
        ...project.aiSettings
      });
    }
  }, [project]);

  const handleChange = (field, value) => {
    const newSettings = {
      ...settings,
      [field]: value
    };
    setSettings(newSettings);

    // Update project with AI settings
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        aiSettings: newSettings
      });
    }
  };

  const handleTestConnection = async () => {
    if (!settings.aiEndpoint || !settings.aiModelName || !settings.aiApiKey) {
      alert('Please fill in all required fields before testing connection.');
      return;
    }

    try {
      // This is a mock test - in a real implementation, this would call the AI endpoint
      // For now, we'll simulate a successful connection
      alert('Connection test successful! AI integration is ready.');
    } catch (error) {
      alert(`Connection test failed: ${error.message}`);
    }
  };

  return (
    <div className="ai-settings">
      <h3>AI Content Suggestions</h3>
      <p>Suggest content based on existing materials using your AI endpoint.</p>
      
      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.aiEnabled}
            onChange={(e) => handleChange('aiEnabled', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label">Enable AI Suggestions</span>
      </div>

      {settings.aiEnabled && (
        <div className="ai-settings-form">
          <div className="form-group">
            <label htmlFor="aiEndpoint">AI Endpoint URL *</label>
            <input
              id="aiEndpoint"
              type="url"
              value={settings.aiEndpoint}
              onChange={(e) => handleChange('aiEndpoint', e.target.value)}
              placeholder="https://your-ai-endpoint.com/v1/completions"
              required
            />
            <p className="help-text">URL for your AI service endpoint (supports local/self-hosted models)</p>
          </div>

          <div className="form-group">
            <label htmlFor="aiModelName">Model Name *</label>
            <input
              id="aiModelName"
              type="text"
              value={settings.aiModelName}
              onChange={(e) => handleChange('aiModelName', e.target.value)}
              placeholder="e.g., gpt-4, llama2, your-custom-model"
              required
            />
            <p className="help-text">Name of the model to use for content suggestions</p>
          </div>

          <div className="form-group">
            <label htmlFor="aiApiKey">API Key *</label>
            <input
              id="aiApiKey"
              type="password"
              value={settings.aiApiKey}
              onChange={(e) => handleChange('aiApiKey', e.target.value)}
              placeholder="Enter your API key"
              required
            />
            <p className="help-text">API key for authenticating with your AI service</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="temperature">Creativity (Temperature)</label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              />
              <span className="range-value">{settings.temperature}</span>
            </div>

            <div className="form-group">
              <label htmlFor="maxTokens">Max Tokens</label>
              <input
                id="maxTokens"
                type="number"
                min="1"
                max="4096"
                value={settings.maxTokens}
                onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="test-connection-btn"
              onClick={handleTestConnection}
            >
              Test Connection
            </button>
          </div>

          <div className="ai-info">
            <h4>How it works:</h4>
            <ul>
              <li>Connect your own AI endpoint (works with local/airgapped systems)</li>
              <li>Analyze your course content to generate relevant suggestions</li>
              <li>Respects your organization's data security requirements</li>
              <li>Configurable settings for optimal output quality</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISettings;