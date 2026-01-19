import React, { useState } from 'react';
import './VersionHistory.css';

const VersionDiff = ({ v1, v2 }) => {
  const diffBlocks = (b1, b2) => {
    const changes = [];
    const allIds = new Set([...b1.map(b => b.id), ...b2.map(b => b.id)]);
    
    allIds.forEach(id => {
      const block1 = b1.find(b => b.id === id);
      const block2 = b2.find(b => b.id === id);
      
      if (!block1) changes.push({ id, type: 'added', content: block2.content });
      else if (!block2) changes.push({ id, type: 'removed', content: block1.content });
      else if (JSON.stringify(block1.content) !== JSON.stringify(block2.content)) {
        changes.push({ id, type: 'modified', old: block1.content, new: block2.content });
      }
    });
    return changes;
  };

  const changes = diffBlocks(v1.data.pages[0].blocks, v2.data.pages[0].blocks);

  return (
    <div className="version-diff">
      <h4>Changes between V{v1.version} and V{v2.version}</h4>
      {changes.map(change => (
        <div key={change.id} className={`diff-item ${change.type}`}>
          <span className="diff-type">{change.type.toUpperCase()}</span>
          {change.type === 'modified' ? (
            <div className="diff-content">
              <del>{JSON.stringify(change.old)}</del>
              <ins>{JSON.stringify(change.new)}</ins>
            </div>
          ) : (
            <div className="diff-content">{JSON.stringify(change.content)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

function VersionHistory({ isOpen, onClose, versions, onRestore, projectName, onBranch }) {
  const [diffSelection, setDiffSelection] = useState([]);
  const [showDiff, setShowDiff] = useState(false);

  if (!isOpen) return null;

  const toggleDiffSelection = (version) => {
    if (diffSelection.find(v => v.id === version.id)) {
      setDiffSelection(diffSelection.filter(v => v.id !== version.id));
    } else if (diffSelection.length < 2) {
      setDiffSelection([...diffSelection, version]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="version-history-overlay" onClick={onClose}>
      <div className="version-history-modal" onClick={e => e.stopPropagation()}>
        <div className="version-history-header">
          <h2>Version History - {projectName}</h2>
          <div className="header-actions">
            {diffSelection.length === 2 && (
              <button onClick={() => setShowDiff(!showDiff)} className="diff-toggle-btn">
                {showDiff ? 'Hide Diff' : 'Compare Selected'}
              </button>
            )}
            <button className="close-button" onClick={onClose} aria-label="Close version history">
              ×
            </button>
          </div>
        </div>
        <div className="version-history-content">
          {showDiff && diffSelection.length === 2 ? (
            <VersionDiff v1={diffSelection[0]} v2={diffSelection[1]} />
          ) : (
            <>
              {versions.length === 0 ? (
                <p className="no-versions">No version history available</p>
              ) : (
                <ul className="version-list">
                  {versions.map((version) => (
                    <li key={version.id} className={`version-item ${diffSelection.find(v => v.id === version.id) ? 'selected' : ''}`}>
                      <div className="version-info">
                        <div className="version-title">
                          <h3>Version {version.version} {version.isBranch ? `(Branch: ${version.branchName})` : ''}</h3>
                          <span className="version-date">{formatDate(version.createdAt)}</span>
                        </div>
                        <p className="version-description">Created at {formatDate(version.createdAt)}</p>
                      </div>
                      <div className="version-actions">
                        <button onClick={() => toggleDiffSelection(version)} className="select-diff-btn">
                          {diffSelection.find(v => v.id === version.id) ? 'Deselect' : 'Select for Diff'}
                        </button>
                        <button onClick={() => onBranch(version.id)} className="branch-button">
                          Branch
                        </button>
                        <button
                          className="restore-button"
                          onClick={() => onRestore(version.id)}
                          aria-label={`Restore version ${version.version}`}
                        >
                          Restore
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VersionHistory;