import React, { useState, useEffect } from 'react';
import './AISettingsPanel.css';

const AISettingsPanel = ({ project, onUpdateProject }) => {
  const [settings, setSettings] = useState({
    aiEndpoint: '',
    aiModelName: '',
    aiApiKey: '',
    suggestionsEnabled: false,
    confidenceThreshold: 0.7
  });

  useEffect(() => {
    if (project?.aiSettings) {
      setSettings({
        ...settings,
        ...project.aiSettings
      });
    }
    
    // Load from localStorage if available
    const savedSettings = localStorage.getItem('ai_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  }, [project]);

  const handleChange = (field, value) => {
    const newSettings = {
      ...settings,
      [field]: value
    };
    
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('ai_settings', JSON.stringify(newSettings));
    
    // Update project if callback available
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        aiSettings: newSettings
      });
    }
  };

  const testConnection = async () => {
    if (!settings.aiEndpoint || !settings.aiModelName) {
      alert('Please fill in the endpoint and model name first.');
      return;
    }

    try {
      // Show testing indicator
      const testBtn = document.querySelector('.test-connection-btn');
      const originalText = testBtn.textContent;
      testBtn.textContent = 'Testing...';
      testBtn.disabled = true;

      // Prepare test request - this would be specific to the AI model
      const testPrompt = "Test connection";
      const requestBody = {
        model: settings.aiModelName,
        prompt: testPrompt,
        max_tokens: 10,
        temperature: 0.7
      };

      // Add API key to headers if provided
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (settings.aiApiKey) {
        headers['Authorization'] = `Bearer ${settings.aiApiKey}`;
        // Some models use different header names - we'll try common ones
        if (settings.aiModelName.toLowerCase().includes('openai') || settings.aiModelName.toLowerCase().includes('gpt')) {
          headers['Authorization'] = `Bearer ${settings.aiApiKey}`;
        } else if (settings.aiModelName.toLowerCase().includes('anthropic') || settings.aiModelName.toLowerCase().includes('claude')) {
          headers['x-api-key'] = settings.aiApiKey;
        } else {
          // Default to Bearer token
          headers['Authorization'] = `Bearer ${settings.aiApiKey}`;
        }
      }

      const response = await fetch(settings.aiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        alert('Connection successful!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Connection failed: ${response.status} - ${errorData.error?.message || 'Check endpoint configuration'}`);
      }
    } catch (error) {
      alert(`Connection error: ${error.message}`);
    } finally {
      // Reset button
      const testBtn = document.querySelector('.test-connection-btn');
      if (testBtn) {
        testBtn.textContent = 'Test Connection';
        testBtn.disabled = false;
      }
    }
  };

  const handleSave = () => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        aiSettings: settings
      });
    }
    alert('AI settings saved successfully!');
  };

  return (
    <div className="ai-settings-panel">
      <h3>AI Content Suggestions</h3>
      <p>Configure your AI endpoint for content suggestions. Works with local or remote AI models.</p>
      
      <div className="form-group">
        <label htmlFor="aiEndpoint">
          AI Endpoint URL
          <span className="required"> *</span>
        </label>
        <input
          id="aiEndpoint"
          type="url"
          value={settings.aiEndpoint}
          onChange={(e) => handleChange('aiEndpoint', e.target.value)}
          placeholder="https://your-ai-endpoint/v1/completions"
          aria-label="AI API Endpoint URL"
        />
        <p className="help-text">
          URL for your AI service (e.g., OpenAI-compatible API, Ollama, etc.)
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="aiModelName">
          Model Name
          <span className="required"> *</span>
        </label>
        <input
          id="aiModelName"
          type="text"
          value={settings.aiModelName}
          onChange={(e) => handleChange('aiModelName', e.target.value)}
          placeholder="e.g., gpt-3.5-turbo, llama2, mistral"
          aria-label="AI Model Name"
        />
        <p className="help-text">
          Name of the model to use for suggestions
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="aiApiKey">API Key (optional)</label>
        <input
          id="aiApiKey"
          type="password"
          value={settings.aiApiKey}
          onChange={(e) => handleChange('aiApiKey', e.target.value)}
          placeholder="Enter your API key"
          aria-label="AI API Key"
        />
        <p className="help-text">
          API key for authentication (leave empty for local models)
        </p>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={settings.suggestionsEnabled}
            onChange={(e) => handleChange('suggestionsEnabled', e.target.checked)}
          />
          Enable AI Content Suggestions
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="confidenceThreshold">
          Confidence Threshold: {settings.confidenceThreshold}
        </label>
        <input
          id="confidenceThreshold"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={settings.confidenceThreshold}
          onChange={(e) => handleChange('confidenceThreshold', parseFloat(e.target.value))}
        />
        <p className="help-text">
          Minimum confidence level for suggestions (higher = fewer but more relevant suggestions)
        </p>
      </div>

      <div className="form-actions">
        <button 
          className="test-connection-btn"
          onClick={testConnection}
          disabled={!settings.aiEndpoint || !settings.aiModelName}
        >
          Test Connection
        </button>
        <button 
          className="save-btn"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AISettingsPanel;