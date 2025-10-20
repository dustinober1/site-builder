import React from 'react';
import './Toolbar.css';

function Toolbar({ onAddBlock }) {
  const blockTypes = [
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'heading', label: 'Heading', icon: '📌' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'video', label: 'Video', icon: '🎥' },
    { type: 'knowledge-check', label: 'Knowledge Check', icon: '✓' },
    { type: 'drag-and-drop', label: 'Drag & Drop', icon: '✊' },
    { type: 'hotspot', label: 'Hotspot Image', icon: '🎯' },
    { type: 'advanced-question', label: 'Advanced Question', icon: '❓' },
    { type: 'branching-scenario', label: 'Branching Scenario', icon: '🔀' }
  ];

  return (
    <aside className="toolbar" role="complementary" aria-label="Content blocks">
      <div className="toolbar-content">
        <h2>Add Content</h2>
        <p className="toolbar-hint">Click to add a block to your page</p>
        
        <div className="block-buttons">
          {blockTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              className="block-button"
              onClick={() => onAddBlock(type)}
              aria-label={`Add ${label} block`}
              title={`Add ${label} block`}
            >
              <span className="icon">{icon}</span>
              <span className="label">{label}</span>
            </button>
          ))}
        </div>

        <div className="toolbar-info">
          <h3>Tips</h3>
          <ul>
            <li>Drag blocks in the canvas to reorder</li>
            <li>Click on a block to edit its properties</li>
            <li>All content is automatically 508 compliant</li>
            <li>Export when ready to create your static site</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default Toolbar;
