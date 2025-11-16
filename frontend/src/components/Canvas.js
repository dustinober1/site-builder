import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Canvas.css';
import ContentBlock from './ContentBlock';

const Canvas = memo(function Canvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
  onMoveBlock,
  onUpdateBlock
}) {
  const onDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // If dropped in the same position
    if (result.destination.index === result.source.index) {
      return;
    }

    // Move the block
    onMoveBlock(result.source.index, result.destination.index);
  };

  return (
    <main className="canvas" role="main" aria-label="Page canvas">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks-droppable">
          {(provided, snapshot) => (
            <div 
              className="canvas-content" 
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {blocks.length === 0 ? (
                <div className="canvas-empty" role="status" aria-live="polite">
                  <p>Start by adding a content block from the toolbar</p>
                </div>
              ) : (
                <div className="blocks-container">
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${snapshot.isDragging ? 'dragging' : ''}`}
                        >
                          <ContentBlock
                            key={block.id}
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            onSelect={() => onSelectBlock(block.id)}
                            onDelete={() => onDeleteBlock(block.id)}
                            onMoveUp={index > 0 ? () => onMoveBlock(index, index - 1) : null}
                            onMoveDown={index < blocks.length - 1 ? () => onMoveBlock(index, index + 1) : null}
                            onUpdateBlock={onUpdateBlock}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
});

Canvas.displayName = 'Canvas';

Canvas.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedBlockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectBlock: PropTypes.func.isRequired,
  onDeleteBlock: PropTypes.func.isRequired,
  onMoveBlock: PropTypes.func.isRequired,
  onUpdateBlock: PropTypes.func.isRequired
};

export default Canvas;
