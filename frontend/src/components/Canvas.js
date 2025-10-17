import React from 'react';
import './Canvas.css';
import ContentBlock from './ContentBlock';

function Canvas({ blocks, selectedBlockId, onSelectBlock, onDeleteBlock, onMoveBlock }) {
  return (
    <main className="canvas" role="main" aria-label="Page canvas">
      <div className="canvas-content">
        {blocks.length === 0 ? (
          <div className="canvas-empty" role="status" aria-live="polite">
            <p>Start by adding a content block from the toolbar</p>
          </div>
        ) : (
          <div className="blocks-container">
            {blocks.map((block, index) => (
              <ContentBlock
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => onSelectBlock(block.id)}
                onDelete={() => onDeleteBlock(block.id)}
                onMoveUp={index > 0 ? () => onMoveBlock(index, index - 1) : null}
                onMoveDown={index < blocks.length - 1 ? () => onMoveBlock(index, index + 1) : null}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Canvas;
