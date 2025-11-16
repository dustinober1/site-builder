import React, { memo } from 'react';
import PropTypes from 'prop-types';
import AssessmentBlock from './AssessmentBlock';
import { DragAndDropBlock, HotspotBlock } from './InteractiveBlock';
import InteractiveVideoBlock from './InteractiveVideoBlock';
import './ContentBlock.css';

const ContentBlock = memo(function ContentBlock({
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
      case 'knowledge-check':
        return (
          <div className="preview-knowledge-check">
            <AssessmentBlock block={block} isPreview={true} />
          </div>
        );
      case 'drag-and-drop':
        return (
          <div className="preview-drag-and-drop">
            <DragAndDropBlock block={block} isPreview={true} />
          </div>
        );
      case 'hotspot':
        return (
          <div className="preview-hotspot">
            <HotspotBlock block={block} isPreview={true} />
          </div>
        );
      case 'interactive-video':
        return (
          <div className="preview-interactive-video">
            <InteractiveVideoBlock 
              block={block} 
              isPreview={true} 
              onUpdateBlock={onUpdateBlock}
            />
          </div>
        );
      case 'advanced-question':
        return (
          <div className="preview-advanced-question">
            <p><strong>❓ Advanced Question:</strong> {block.question || 'Question not set'}</p>
            {block.answer && <p><em>Answer: {block.answer.substring(0, 100)}...</em></p>}
          </div>
        );
      case 'branching-scenario':
        return (
          <div className="preview-branching-scenario">
            <p><strong>🔀 Branching Scenario:</strong> {block.scenario || 'Scenario not set'}</p>
            {block.paths && block.paths.length > 0 && (
              <ul>
                {block.paths.map((path, i) => (
                  <li key={i}>→ {path.choice}</li>
                ))}
              </ul>
            )}
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
});

ContentBlock.displayName = 'ContentBlock';

ContentBlock.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.string,
    url: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func
};

export default ContentBlock;
