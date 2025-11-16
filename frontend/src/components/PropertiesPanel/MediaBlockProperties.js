import React from 'react';
import PropTypes from 'prop-types';

/**
 * Properties for Image and Video blocks
 */
function MediaBlockProperties({ block, onChange }) {
  const handleChange = (field, value) => {
    onChange(block.id, { [field]: value });
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="url">URL</label>
        <input
          id="url"
          type="text"
          value={block.url || ''}
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
          value={block.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter title"
          aria-label="Media title"
        />
      </div>

      {block.type === 'image' && (
        <div className="form-group">
          <label htmlFor="alt">
            Alt Text <span className="required">(Required for 508)</span>
          </label>
          <textarea
            id="alt"
            value={block.alt || ''}
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
          <label htmlFor="alt-video">
            Description <span className="required">(Required for 508)</span>
          </label>
          <textarea
            id="alt-video"
            value={block.alt || ''}
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
    </>
  );
}

MediaBlockProperties.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    title: PropTypes.string,
    alt: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired
};

export default MediaBlockProperties;
