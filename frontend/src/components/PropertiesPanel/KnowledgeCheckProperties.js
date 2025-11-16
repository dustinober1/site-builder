import React from 'react';
import PropTypes from 'prop-types';

/**
 * Properties for Knowledge Check blocks
 */
function KnowledgeCheckProperties({ block, onChange }) {
  const handleChange = (field, value) => {
    onChange(block.id, { [field]: value });
  };

  const updateOptions = (newOptions) => {
    handleChange('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(block.options || []), ''];
    updateOptions(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = block.options.filter((_, i) => i !== index);
    updateOptions(newOptions);
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="question">Question</label>
        <textarea
          id="question"
          value={block.question || ''}
          onChange={(e) => handleChange('question', e.target.value)}
          placeholder="Enter the question"
          aria-label="Knowledge check question"
        />
      </div>

      <div className="form-group">
        <label htmlFor="questionType">Question Type</label>
        <select
          id="questionType"
          value={block.questionType || 'multiple-choice'}
          onChange={(e) => handleChange('questionType', e.target.value)}
          aria-label="Question type"
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
          <option value="fill-in-the-blank">Fill in the Blank</option>
          <option value="matching">Matching</option>
        </select>
      </div>

      {(block.questionType === 'multiple-choice' || !block.questionType) && (
        <>
          <div className="form-group">
            <label>Options</label>
            <div className="options-container">
              {(block.options || []).map((option, idx) => (
                <div key={idx} className="option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(block.options || [])];
                      newOptions[idx] = e.target.value;
                      updateOptions(newOptions);
                    }}
                    placeholder={`Option ${idx + 1}`}
                    aria-label={`Option ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="btn-small delete"
                    onClick={() => removeOption(idx)}
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
              onClick={addOption}
              title="Add another option"
            >
              + Add Option
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="correctAnswer">
              Correct Answer (Option Index)
            </label>
            <input
              id="correctAnswer"
              type="number"
              min="0"
              max={(block.options || []).length - 1}
              value={block.correctAnswer || ''}
              onChange={(e) => handleChange('correctAnswer', parseInt(e.target.value))}
              placeholder="0"
              aria-label="Correct answer index"
            />
          </div>
        </>
      )}

      {block.questionType === 'true-false' && (
        <>
          <div className="form-group">
            <label>Correct Answer</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name={`tf-${block.id}`}
                  checked={block.correctAnswer === 'true'}
                  onChange={() => handleChange('correctAnswer', 'true')}
                />
                True
              </label>
              <label>
                <input
                  type="radio"
                  name={`tf-${block.id}`}
                  checked={block.correctAnswer === 'false'}
                  onChange={() => handleChange('correctAnswer', 'false')}
                />
                False
              </label>
            </div>
          </div>
        </>
      )}
    </>
  );
}

KnowledgeCheckProperties.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    question: PropTypes.string,
    questionType: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  }).isRequired,
  onChange: PropTypes.func.isRequired
};

export default KnowledgeCheckProperties;
