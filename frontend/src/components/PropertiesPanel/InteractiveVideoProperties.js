import React from 'react';
import PropTypes from 'prop-types';

/**
 * Properties for Interactive Video blocks
 */
function InteractiveVideoProperties({ block, onChange }) {
  const handleChange = (field, value) => {
    onChange(block.id, { [field]: value });
  };

  const updateInteraction = (index, updates) => {
    const newInteractions = [...(block.interactions || [])];
    newInteractions[index] = { ...newInteractions[index], ...updates };
    handleChange('interactions', newInteractions);
  };

  const updateInteractionOptions = (interactionIndex, optionIndex, value) => {
    const newInteractions = [...(block.interactions || [])];
    const newOptions = [...newInteractions[interactionIndex].options];
    newOptions[optionIndex] = value;
    newInteractions[interactionIndex] = {
      ...newInteractions[interactionIndex],
      options: newOptions
    };
    handleChange('interactions', newInteractions);
  };

  const addInteraction = () => {
    const newInteractions = [
      ...(block.interactions || []),
      {
        id: `interaction${Date.now()}`,
        type: 'quiz',
        time: 30,
        question: 'What did you just learn from this video?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        required: true
      }
    ];
    handleChange('interactions', newInteractions);
  };

  const removeInteraction = (index) => {
    const newInteractions = block.interactions.filter((_, i) => i !== index);
    handleChange('interactions', newInteractions);
  };

  const addOption = (interactionIndex) => {
    const newInteractions = [...(block.interactions || [])];
    newInteractions[interactionIndex] = {
      ...newInteractions[interactionIndex],
      options: [...(newInteractions[interactionIndex].options || []), '']
    };
    handleChange('interactions', newInteractions);
  };

  const removeOption = (interactionIndex, optionIndex) => {
    const newInteractions = [...(block.interactions || [])];
    newInteractions[interactionIndex] = {
      ...newInteractions[interactionIndex],
      options: newInteractions[interactionIndex].options.filter((_, i) => i !== optionIndex)
    };
    handleChange('interactions', newInteractions);
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="video-url">Video URL</label>
        <input
          id="video-url"
          type="text"
          value={block.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="Enter video URL"
          aria-label="Video URL"
        />
      </div>

      <div className="form-group">
        <label htmlFor="video-alt">Video Description (for accessibility)</label>
        <textarea
          id="video-alt"
          value={block.alt || ''}
          onChange={(e) => handleChange('alt', e.target.value)}
          placeholder="Describe the video content"
          aria-label="Video description"
        />
      </div>

      <div className="form-group">
        <label>Interactions</label>
        <p>Add interactive elements at specific timestamps:</p>
        <div className="interactions-container">
          {(block.interactions || []).map((interaction, idx) => (
            <div key={interaction.id} className="interaction-input">
              <div className="interaction-header">
                <span>Interaction {idx + 1}</span>
                <button
                  type="button"
                  className="btn-small delete"
                  onClick={() => removeInteraction(idx)}
                  title="Remove interaction"
                >
                  ✕
                </button>
              </div>

              <div className="interaction-fields">
                <div className="form-group">
                  <label htmlFor={`interaction-time-${idx}`}>Time (seconds)</label>
                  <input
                    id={`interaction-time-${idx}`}
                    type="number"
                    min="0"
                    value={interaction.time || ''}
                    onChange={(e) => updateInteraction(idx, { time: parseInt(e.target.value) })}
                    placeholder="Time in seconds"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`interaction-type-${idx}`}>Type</label>
                  <select
                    id={`interaction-type-${idx}`}
                    value={interaction.type || 'quiz'}
                    onChange={(e) => updateInteraction(idx, { type: e.target.value })}
                  >
                    <option value="quiz">Quiz Question</option>
                    <option value="checkpoint">Checkpoint</option>
                    <option value="branching">Branching Scenario</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`interaction-question-${idx}`}>Question</label>
                  <textarea
                    id={`interaction-question-${idx}`}
                    value={interaction.question || ''}
                    onChange={(e) => updateInteraction(idx, { question: e.target.value })}
                    placeholder="Enter question"
                  />
                </div>

                {(interaction.type === 'quiz' || !interaction.type) && (
                  <>
                    <div className="form-group">
                      <label>Options</label>
                      <div className="options-container">
                        {(interaction.options || []).map((option, optIdx) => (
                          <div key={optIdx} className="option-input">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateInteractionOptions(idx, optIdx, e.target.value)}
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            <button
                              type="button"
                              className="btn-small delete"
                              onClick={() => removeOption(idx, optIdx)}
                              title="Remove option"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-small"
                        onClick={() => addOption(idx)}
                        title="Add another option"
                      >
                        + Add Option
                      </button>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`interaction-correctAnswer-${idx}`}>
                        Correct Answer (Option Index)
                      </label>
                      <input
                        id={`interaction-correctAnswer-${idx}`}
                        type="number"
                        min="0"
                        max={(interaction.options || []).length - 1}
                        value={interaction.correctAnswer || ''}
                        onChange={(e) => updateInteraction(idx, { correctAnswer: parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </>
                )}

                {interaction.type === 'checkpoint' && (
                  <div className="form-group">
                    <label htmlFor={`interaction-message-${idx}`}>Message</label>
                    <textarea
                      id={`interaction-message-${idx}`}
                      value={interaction.message || ''}
                      onChange={(e) => updateInteraction(idx, { message: e.target.value })}
                      placeholder="Message to show at checkpoint"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={interaction.required === true}
                      onChange={(e) => updateInteraction(idx, { required: e.target.checked })}
                    />
                    Required to continue (for quizzes)
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-small"
          onClick={addInteraction}
          title="Add another interaction"
        >
          + Add Interaction
        </button>
      </div>
    </>
  );
}

InteractiveVideoProperties.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    alt: PropTypes.string,
    interactions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        time: PropTypes.number,
        question: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.string),
        correctAnswer: PropTypes.number,
        required: PropTypes.bool,
        message: PropTypes.string
      })
    )
  }).isRequired,
  onChange: PropTypes.func.isRequired
};

export default InteractiveVideoProperties;
