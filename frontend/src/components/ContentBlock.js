import React from 'react';
import './ContentBlock.css';

function ContentBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown
}) {
  const renderPreview = () => {
    switch(block.type) {
      case 'text':
        return <p>{block.content}</p>;
      case 'heading':
        return <h2>{block.content}</h2>;
      case 'image':
        return (
          <div className="preview-image">
            <p>📸 Image: {block.url || 'No URL set'}</p>
          </div>
        );
      case 'video':
        return (
          <div className="preview-video">
            <p>🎥 Video: {block.url || 'No URL set'}</p>
          </div>
        );
      default:
        return <p>{block.content}</p>;
    }
  };

  return (
    <article
      className={`content-block ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      role="region"
      aria-label={`${block.type} content block`}
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
        }
      }}
    >
      <div className="block-preview">
        {renderPreview()}
      </div>

      <div className="block-controls">
        <div className="controls-left">
          <span className="block-type">{block.type.toUpperCase()}</span>
        </div>
        <div className="controls-right">
          {onMoveUp && (
            <button
              className="control-btn"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              title="Move up"
              aria-label="Move block up"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              className="control-btn"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              title="Move down"
              aria-label="Move block down"
            >
              ↓
            </button>
          )}
          <button
            className="control-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete"
            aria-label="Delete block"
          >
            ✕
          </button>
        </div>
      </div>
    </article>
  );
}

export default ContentBlock;
