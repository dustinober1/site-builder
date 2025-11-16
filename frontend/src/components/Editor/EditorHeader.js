import React from 'react';
import PropTypes from 'prop-types';
import ErrorGuide from '../ErrorGuide';

/**
 * Editor Header Component
 * Displays project title, actions, and status messages
 */
function EditorHeader({
  project,
  autoSaveStatus,
  message,
  isGenerating,
  onBack,
  onShowTemplateLibrary,
  onShowVersionHistory,
  onGenerateSite
}) {
  return (
    <header className="editor-header" role="banner">
      <div className="header-left">
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Go back to projects"
        >
          ← Back
        </button>
        <h1>{project.name}</h1>
        {autoSaveStatus && (
          <span className="auto-save-status">{autoSaveStatus}</span>
        )}
      </div>
      <div className="header-right">
        {message && (
          <div className="message" role="status" aria-live="polite">
            {message.includes('✗') ? (
              <ErrorGuide
                type="error"
                message={message.substring(2)}
                hint={
                  message.includes('Error: Network Error')
                    ? 'Check if the backend server is running'
                    : message.includes('404')
                    ? 'The requested resource was not found'
                    : 'Please check the details and try again'
                }
              />
            ) : (
              <span className="success-message">{message}</span>
            )}
          </div>
        )}
        <button
          className="template-button"
          onClick={onShowTemplateLibrary}
          aria-label="Browse templates"
        >
          📚 Templates
        </button>
        <button
          className="version-button"
          onClick={onShowVersionHistory}
          aria-label="View version history"
        >
          📋 Versions
        </button>
        <button
          className="generate-button"
          onClick={onGenerateSite}
          disabled={isGenerating}
          aria-label="Export the course as a static website"
        >
          {isGenerating ? 'Exporting...' : '↓ Export Site'}
        </button>
      </div>
    </header>
  );
}

EditorHeader.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  autoSaveStatus: PropTypes.string,
  message: PropTypes.string,
  isGenerating: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onShowTemplateLibrary: PropTypes.func.isRequired,
  onShowVersionHistory: PropTypes.func.isRequired,
  onGenerateSite: PropTypes.func.isRequired
};

export default EditorHeader;
