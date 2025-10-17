import React from 'react';
import './PropertiesPanel.css';

function PropertiesPanel({ block, onUpdateBlock, onDelete }) {
  if (!block) {
    return (
      <aside className="properties-panel empty" role="complementary" aria-label="Properties panel">
        <div className="panel-content">
          <p>Select a block to edit its properties</p>
        </div>
      </aside>
    );
  }

  const handleChange = (field, value) => {
    onUpdateBlock(block.id, { [field]: value });
  };

  return (
    <aside className="properties-panel" role="complementary" aria-label="Properties panel">
      <div className="panel-content">
        <h2>Edit Properties</h2>

        {(block.type === 'text' || block.type === 'heading') && (
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={block.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Enter content"
              aria-label="Content text"
            />
          </div>
        )}

        {(block.type === 'image' || block.type === 'video') && (
          <>
            <div className="form-group">
              <label htmlFor="url">URL</label>
              <input
                id="url"
                type="text"
                value={block.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter image or video URL"
                aria-label="Media URL"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Title (optional)</label>
              <input
                id="title"
                type="text"
                value={block.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
                aria-label="Media title"
              />
            </div>
          </>
        )}

        {block.type === 'image' && (
          <div className="form-group">
            <label htmlFor="alt">Alt Text <span className="required">(Required for 508)</span></label>
            <textarea
              id="alt"
              value={block.alt}
              onChange={(e) => handleChange('alt', e.target.value)}
              placeholder="Describe the image for screen readers"
              aria-label="Alt text for image"
              aria-required="true"
            />
            <p className="help-text">
              Describe what's in the image for users with visual impairments.
            </p>
          </div>
        )}

        {block.type === 'video' && (
          <div className="form-group">
            <label htmlFor="alt-video">Description <span className="required">(Required for 508)</span></label>
            <textarea
              id="alt-video"
              value={block.alt}
              onChange={(e) => handleChange('alt', e.target.value)}
              placeholder="Describe the video content"
              aria-label="Video description"
              aria-required="true"
            />
            <p className="help-text">
              Provide a description of the video content for users who cannot see or hear it.
            </p>
          </div>
        )}

        <button
          className="delete-button"
          onClick={() => onDelete(block.id)}
          aria-label="Delete this block"
        >
          Delete Block
        </button>
      </div>
    </aside>
  );
}

export default PropertiesPanel;
