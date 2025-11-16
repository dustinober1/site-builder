import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './PropertiesPanel.css';

// Import block-specific property components
import TextBlockProperties from './TextBlockProperties';
import MediaBlockProperties from './MediaBlockProperties';
import KnowledgeCheckProperties from './KnowledgeCheckProperties';
import HotspotBlockProperties from './HotspotBlockProperties';
import InteractiveVideoProperties from './InteractiveVideoProperties';

/**
 * PropertiesPanel - Main orchestrator for editing block properties
 * Routes to appropriate property editor based on block type
 */
const PropertiesPanel = memo(function PropertiesPanel({ block, onUpdateBlock, onDelete }) {
  if (!block) {
    return (
      <aside className="properties-panel empty" role="complementary" aria-label="Properties panel">
        <div className="panel-content">
          <p>Select a block to edit its properties</p>
        </div>
      </aside>
    );
  }

  const handleChange = (blockId, updates) => {
    onUpdateBlock(blockId, updates);
  };

  // Route to appropriate property component based on block type
  const renderProperties = () => {
    switch (block.type) {
      case 'text':
      case 'heading':
        return <TextBlockProperties block={block} onChange={handleChange} />;

      case 'image':
      case 'video':
        return <MediaBlockProperties block={block} onChange={handleChange} />;

      case 'knowledge-check':
        return <KnowledgeCheckProperties block={block} onChange={handleChange} />;

      case 'hotspot':
        return <HotspotBlockProperties block={block} onChange={handleChange} />;

      case 'interactive-video':
        return <InteractiveVideoProperties block={block} onChange={handleChange} />;

      default:
        return (
          <div className="form-group">
            <p>No properties available for this block type.</p>
          </div>
        );
    }
  };

  return (
    <aside className="properties-panel" role="complementary" aria-label="Properties panel">
      <div className="panel-content">
        <h2>Edit Properties</h2>
        {renderProperties()}

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
});

PropertiesPanel.displayName = 'PropertiesPanel';

PropertiesPanel.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired
  }),
  onUpdateBlock: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default PropertiesPanel;
