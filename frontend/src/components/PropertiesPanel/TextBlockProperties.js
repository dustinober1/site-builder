import React from 'react';
import PropTypes from 'prop-types';

/**
 * Properties for Text and Heading blocks
 */
function TextBlockProperties({ block, onChange }) {
  const handleChange = (field, value) => {
    onChange(block.id, { [field]: value });
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={block.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Enter content"
          aria-label="Content text"
        />
      </div>
    </>
  );
}

TextBlockProperties.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired
};

export default TextBlockProperties;
