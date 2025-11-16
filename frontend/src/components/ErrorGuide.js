import React from 'react';
import './ErrorGuide.css';

function ErrorGuide({ message, type = 'error', hint = '', onClose = null }) {
  // Determine icon and styling based on error type
  let icon = '❌';
  let className = 'error-guide error';
  
  if (type === 'warning') {
    icon = '⚠️';
    className = 'error-guide warning';
  } else if (type === 'success') {
    icon = '✅';
    className = 'error-guide success';
  } else if (type === 'info') {
    icon = 'ℹ️';
    className = 'error-guide info';
  }

  return (
    <div className={className}>
      <div className="error-content">
        <div className="error-icon">{icon}</div>
        <div className="error-text">
          <p className="error-message">{message}</p>
          {hint && <p className="error-hint">{hint}</p>}
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose} aria-label="Close message">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorGuide;