import React from 'react';
import './VersionHistory.css';

function VersionHistory({ isOpen, onClose, versions, onRestore, projectName }) {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="version-history-overlay" onClick={onClose}>
      <div className="version-history-modal" onClick={e => e.stopPropagation()}>
        <div className="version-history-header">
          <h2>Version History - {projectName}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close version history">
            ×
          </button>
        </div>
        <div className="version-history-content">
          {versions.length === 0 ? (
            <p className="no-versions">No version history available</p>
          ) : (
            <ul className="version-list">
              {versions.map((version) => (
                <li key={version.id} className="version-item">
                  <div className="version-info">
                    <div className="version-title">
                      <h3>Version {version.version}</h3>
                      <span className="version-date">{formatDate(version.createdAt)}</span>
                    </div>
                    <p className="version-description">Created at {formatDate(version.createdAt)}</p>
                  </div>
                  <button
                    className="restore-button"
                    onClick={() => onRestore(version.id)}
                    aria-label={`Restore version ${version.version}`}
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default VersionHistory;