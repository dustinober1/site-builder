import React from 'react';
import './ProgressModal.css';

function ProgressModal({ isOpen, onClose, title, message, progress, status }) {
  if (!isOpen) return null;

  return (
    <div className="progress-modal-overlay" onClick={onClose}>
      <div className="progress-modal" onClick={e => e.stopPropagation()}>
        <div className="progress-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close progress modal">
            ×
          </button>
        </div>
        <div className="progress-content">
          <p>{message}</p>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>{Math.round(progress)}% Complete</span>
            <span className={`status ${status}`}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressModal;