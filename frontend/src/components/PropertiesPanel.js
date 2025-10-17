import React from 'react';
import './PropertiesPanel.css';

function PropertiesPanel({ block, onUpdateBlock, onDelete }) {
  if (!block) {
    return (
      <aside className="properties-panel empty" role="complementary" aria-label="Properties panel">
        <div className="panel-content">
          <p>Select a block to edit its properties</p>
        </div>
      </aside>
    );
  }

  const handleChange = (field, value) => {
    onUpdateBlock(block.id, { [field]: value });
  };

  return (
    <aside className="properties-panel" role="complementary" aria-label="Properties panel">
      <div className="panel-content">
        <h2>Edit Properties</h2>

        {(block.type === 'text' || block.type === 'heading') && (
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={block.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Enter content"
              aria-label="Content text"
            />
          </div>
        )}

        {(block.type === 'image' || block.type === 'video') && (
          <>
            <div className="form-group">
              <label htmlFor="url">URL</label>
              <input
                id="url"
                type="text"
                value={block.url}
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
                value={block.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
                aria-label="Media title"
              />
            </div>
          </>
        )}

        {block.type === 'image' && (
          <div className="form-group">
            <label htmlFor="alt">Alt Text <span className="required">(Required for 508)</span></label>
            <textarea
              id="alt"
              value={block.alt}
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
            <label htmlFor="alt-video">Description <span className="required">(Required for 508)</span></label>
            <textarea
              id="alt-video"
              value={block.alt}
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

        {block.type === 'knowledge-check' && (
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
                        handleChange('options', newOptions);
                      }}
                      placeholder={`Option ${idx + 1}`}
                      aria-label={`Option ${idx + 1}`}
                    />
                    <button
                      className="btn-small delete"
                      onClick={() => {
                        const newOptions = block.options.filter((_, i) => i !== idx);
                        handleChange('options', newOptions);
                      }}
                      title="Remove option"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn-small"
                onClick={() => {
                  const newOptions = [...(block.options || []), ''];
                  handleChange('options', newOptions);
                }}
                title="Add another option"
              >
                + Add Option
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="correctAnswer">Correct Answer (Option Index)</label>
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

            <div className="form-group">
              <label htmlFor="feedback">Feedback (optional)</label>
              <textarea
                id="feedback"
                value={block.feedback || ''}
                onChange={(e) => handleChange('feedback', e.target.value)}
                placeholder="Feedback to show when answered"
                aria-label="Knowledge check feedback"
              />
            </div>
          </>
        )}

        {block.type === 'advanced-question' && (
          <>
            <div className="form-group">
              <label htmlFor="adv-question">Question</label>
              <textarea
                id="adv-question"
                value={block.question || ''}
                onChange={(e) => handleChange('question', e.target.value)}
                placeholder="Enter the question"
                aria-label="Advanced question"
              />
            </div>

            <div className="form-group">
              <label htmlFor="adv-answer">Answer</label>
              <textarea
                id="adv-answer"
                value={block.answer || ''}
                onChange={(e) => handleChange('answer', e.target.value)}
                placeholder="Enter the detailed answer"
                aria-label="Advanced question answer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="adv-explanation">Explanation (optional)</label>
              <textarea
                id="adv-explanation"
                value={block.explanation || ''}
                onChange={(e) => handleChange('explanation', e.target.value)}
                placeholder="Additional explanation or context"
                aria-label="Advanced question explanation"
              />
            </div>
          </>
        )}

        {block.type === 'branching-scenario' && (
          <>
            <div className="form-group">
              <label htmlFor="scenario-desc">Scenario Description</label>
              <textarea
                id="scenario-desc"
                value={block.scenario || ''}
                onChange={(e) => handleChange('scenario', e.target.value)}
                placeholder="Describe the scenario and decision to make"
                aria-label="Scenario description"
              />
            </div>

            <div className="form-group">
              <label>Decision Paths</label>
              <div className="paths-container">
                {(block.paths || []).map((path, idx) => (
                  <div key={idx} className="path-input">
                    <div>
                      <input
                        type="text"
                        value={path.choice || ''}
                        onChange={(e) => {
                          const newPaths = [...(block.paths || [])];
                          newPaths[idx] = { ...newPaths[idx], choice: e.target.value };
                          handleChange('paths', newPaths);
                        }}
                        placeholder={`Choice ${idx + 1}`}
                        aria-label={`Choice ${idx + 1}`}
                      />
                      <textarea
                        value={path.outcome || ''}
                        onChange={(e) => {
                          const newPaths = [...(block.paths || [])];
                          newPaths[idx] = { ...newPaths[idx], outcome: e.target.value };
                          handleChange('paths', newPaths);
                        }}
                        placeholder="What happens with this choice?"
                        aria-label={`Outcome for choice ${idx + 1}`}
                      />
                    </div>
                    <button
                      className="btn-small delete"
                      onClick={() => {
                        const newPaths = block.paths.filter((_, i) => i !== idx);
                        handleChange('paths', newPaths);
                      }}
                      title="Remove path"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn-small"
                onClick={() => {
                  const newPaths = [...(block.paths || []), { choice: '', outcome: '' }];
                  handleChange('paths', newPaths);
                }}
                title="Add another path"
              >
                + Add Path
              </button>
            </div>
          </>
        )}

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
}

export default PropertiesPanel;
