import React from 'react';
import PropTypes from 'prop-types';

/**
 * Properties for Hotspot blocks
 */
function HotspotBlockProperties({ block, onChange }) {
  const handleChange = (field, value) => {
    onChange(block.id, { [field]: value });
  };

  const updateHotspot = (index, updates) => {
    const newHotspots = [...(block.hotspots || [])];
    newHotspots[index] = { ...newHotspots[index], ...updates };
    handleChange('hotspots', newHotspots);
  };

  const removeHotspot = (index) => {
    const newHotspots = block.hotspots.filter((_, i) => i !== index);
    handleChange('hotspots', newHotspots);
  };

  const addHotspot = () => {
    const newHotspots = [
      ...(block.hotspots || []),
      { id: `hotspot${Date.now()}`, top: 0, left: 0, width: 10, height: 10 }
    ];
    handleChange('hotspots', newHotspots);
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="hotspot-question">Question/Instructions</label>
        <textarea
          id="hotspot-question"
          value={block.question || ''}
          onChange={(e) => handleChange('question', e.target.value)}
          placeholder="Enter question or instructions"
          aria-label="Hotspot question"
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="text"
          value={block.imageUrl || ''}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="Enter image URL"
          aria-label="Hotspot image URL"
        />
      </div>

      <div className="form-group">
        <label htmlFor="hotspot-alt">Alt Text (for accessibility)</label>
        <input
          id="hotspot-alt"
          type="text"
          value={block.alt || ''}
          onChange={(e) => handleChange('alt', e.target.value)}
          placeholder="Describe the image for screen readers"
          aria-label="Alt text for hotspot image"
        />
      </div>

      <div className="form-group">
        <label>Hotspots</label>
        <p>Define clickable areas on the image (coordinates in % of image size):</p>
        <div className="hotspots-container">
          {(block.hotspots || []).map((hotspot, idx) => (
            <div key={hotspot.id} className="hotspot-input">
              <div className="hotspot-coordinates">
                <div>
                  <label>Top (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hotspot.top || ''}
                    onChange={(e) => updateHotspot(idx, { top: parseInt(e.target.value) })}
                    placeholder="Top position"
                  />
                </div>
                <div>
                  <label>Left (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hotspot.left || ''}
                    onChange={(e) => updateHotspot(idx, { left: parseInt(e.target.value) })}
                    placeholder="Left position"
                  />
                </div>
                <div>
                  <label>Width (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hotspot.width || ''}
                    onChange={(e) => updateHotspot(idx, { width: parseInt(e.target.value) })}
                    placeholder="Width"
                  />
                </div>
                <div>
                  <label>Height (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hotspot.height || ''}
                    onChange={(e) => updateHotspot(idx, { height: parseInt(e.target.value) })}
                    placeholder="Height"
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-small delete"
                onClick={() => removeHotspot(idx)}
                title="Remove hotspot"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-small"
          onClick={addHotspot}
          title="Add another hotspot"
        >
          + Add Hotspot
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="correctHotspot">Correct Hotspot</label>
        <select
          id="correctHotspot"
          value={block.correctHotspot || ''}
          onChange={(e) => handleChange('correctHotspot', e.target.value)}
          aria-label="Correct hotspot selection"
        >
          <option value="">Select correct hotspot</option>
          {(block.hotspots || []).map((hotspot, idx) => (
            <option key={hotspot.id} value={hotspot.id}>
              Hotspot {idx + 1} ({hotspot.top}%, {hotspot.left}%)
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

HotspotBlockProperties.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    question: PropTypes.string,
    imageUrl: PropTypes.string,
    alt: PropTypes.string,
    hotspots: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        top: PropTypes.number,
        left: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number
      })
    ),
    correctHotspot: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired
};

export default HotspotBlockProperties;
