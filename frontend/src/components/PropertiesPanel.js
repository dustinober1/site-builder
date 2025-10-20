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
                      const newOptions = [...(block.options || [])];
                      newOptions.push('');
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

            {block.questionType === 'fill-in-the-blank' && (
              <div className="form-group">
                <label htmlFor="correctAnswer">Correct Answer</label>
                <input
                  id="correctAnswer"
                  type="text"
                  value={block.correctAnswer || ''}
                  onChange={(e) => handleChange('correctAnswer', e.target.value)}
                  placeholder="Enter the correct answer"
                  aria-label="Fill in the blank correct answer"
                />
              </div>
            )}

            {block.questionType === 'matching' && (
              <>
                <div className="form-group">
                  <label>Items to Match</label>
                  <div className="items-container">
                    {(block.items || []).map((item, idx) => (
                      <div key={idx} className="item-input">
                        <input
                          type="text"
                          value={item.stem || ''}
                          onChange={(e) => {
                            const newItems = [...(block.items || [])];
                            newItems[idx] = { ...newItems[idx], stem: e.target.value };
                            handleChange('items', newItems);
                          }}
                          placeholder={`Item ${idx + 1}`}
                          aria-label={`Matching item ${idx + 1}`}
                        />
                        <button
                          className="btn-small delete"
                          onClick={() => {
                            const newItems = block.items.filter((_, i) => i !== idx);
                            handleChange('items', newItems);
                          }}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn-small"
                    onClick={() => {
                      const newItems = [...(block.items || [])];
                      newItems.push({ stem: '' });
                      handleChange('items', newItems);
                    }}
                    title="Add another item"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="form-group">
                  <label>Choices</label>
                  <div className="choices-container">
                    {(block.choices || []).map((choice, idx) => (
                      <div key={idx} className="choice-input">
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) => {
                            const newChoices = [...(block.choices || [])];
                            newChoices[idx] = e.target.value;
                            handleChange('choices', newChoices);
                          }}
                          placeholder={`Choice ${idx + 1}`}
                          aria-label={`Matching choice ${idx + 1}`}
                        />
                        <button
                          className="btn-small delete"
                          onClick={() => {
                            const newChoices = block.choices.filter((_, i) => i !== idx);
                            handleChange('choices', newChoices);
                          }}
                          title="Remove choice"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn-small"
                    onClick={() => {
                      const newChoices = [...(block.choices || [])];
                      newChoices.push('');
                      handleChange('choices', newChoices);
                    }}
                    title="Add another choice"
                  >
                    + Add Choice
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="correctAnswer">Correct Answer Indices (comma-separated)</label>
                  <input
                    id="correctAnswer"
                    type="text"
                    value={Array.isArray(block.correctAnswer) ? block.correctAnswer.join(',') : block.correctAnswer || ''}
                    onChange={(e) => handleChange('correctAnswer', e.target.value.split(',').map(item => parseInt(item.trim())))}
                    placeholder="0,1,2,3"
                    aria-label="Correct answer indices for matching"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="correctFeedback">Correct Feedback</label>
              <textarea
                id="correctFeedback"
                value={block.correctFeedback || ''}
                onChange={(e) => handleChange('correctFeedback', e.target.value)}
                placeholder="Feedback to show when answered correctly"
                aria-label="Correct answer feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="incorrectFeedback">Incorrect Feedback</label>
              <textarea
                id="incorrectFeedback"
                value={block.incorrectFeedback || ''}
                onChange={(e) => handleChange('incorrectFeedback', e.target.value)}
                placeholder="Feedback to show when answered incorrectly"
                aria-label="Incorrect answer feedback"
              />
            </div>
          </>
        )}

        {block.type === 'drag-and-drop' && (
          <>
            <div className="form-group">
              <label htmlFor="drag-question">Question/Instructions</label>
              <textarea
                id="drag-question"
                value={block.question || ''}
                onChange={(e) => handleChange('question', e.target.value)}
                placeholder="Enter question or instructions"
                aria-label="Drag and drop question"
              />
            </div>

            <div className="form-group">
              <label>Items to Drag</label>
              <div className="items-container">
                {(block.items || []).map((item, idx) => (
                  <div key={item.id || idx} className="item-input">
                    <input
                      type="text"
                      value={item.content || ''}
                      onChange={(e) => {
                        const newItems = [...(block.items || [])];
                        newItems[idx] = { ...newItems[idx], content: e.target.value };
                        handleChange('items', newItems);
                      }}
                      placeholder={`Item ${idx + 1} content`}
                      aria-label={`Drag item ${idx + 1}`}
                    />
                    <button
                      className="btn-small delete"
                      onClick={() => {
                        const newItems = block.items.filter((_, i) => i !== idx);
                        handleChange('items', newItems);
                      }}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn-small"
                onClick={() => {
                  const newItems = [...(block.items || [])];
                  newItems.push({ id: `item${Date.now()}`, content: '' });
                  handleChange('items', newItems);
                }}
                title="Add another item"
              >
                + Add Item
              </button>
            </div>

            <div className="form-group">
              <label>Drop Targets</label>
              <div className="targets-container">
                {(block.targets || []).map((target, idx) => (
                  <div key={target.id || idx} className="target-input">
                    <input
                      type="text"
                      value={target.label || ''}
                      onChange={(e) => {
                        const newTargets = [...(block.targets || [])];
                        newTargets[idx] = { ...newTargets[idx], label: e.target.value };
                        handleChange('targets', newTargets);
                      }}
                      placeholder={`Target ${idx + 1} label`}
                      aria-label={`Drop target ${idx + 1}`}
                    />
                    <button
                      className="btn-small delete"
                      onClick={() => {
                        const newTargets = block.targets.filter((_, i) => i !== idx);
                        handleChange('targets', newTargets);
                      }}
                      title="Remove target"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn-small"
                onClick={() => {
                  const newTargets = [...(block.targets || [])];
                  newTargets.push({ id: `target${Date.now()}`, label: '' });
                  handleChange('targets', newTargets);
                }}
                title="Add another target"
              >
                + Add Target
              </button>
            </div>

            <div className="form-group">
              <label>Correct Mappings</label>
              <p>Map each target to the correct item:</p>
              {(block.targets || []).map((target, targetIdx) => (
                <div key={target.id} className="mapping-input">
                  <label htmlFor={`mapping-${target.id}`}>
                    {target.label || `Target ${targetIdx + 1}`} maps to:
                  </label>
                  <select
                    id={`mapping-${target.id}`}
                    value={block.correctMapping?.[target.id] || ''}
                    onChange={(e) => {
                      const newMapping = { ...block.correctMapping } || {};
                      newMapping[target.id] = e.target.value;
                      handleChange('correctMapping', newMapping);
                    }}
                    aria-label={`Correct mapping for ${target.label || `target ${targetIdx + 1}`}`}
                  >
                    <option value="">Select correct item</option>
                    {(block.items || []).map((item, itemIdx) => (
                      <option key={item.id} value={item.id}>
                        {item.content || `Item ${itemIdx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="drag-correctFeedback">Correct Feedback</label>
              <textarea
                id="drag-correctFeedback"
                value={block.correctFeedback || ''}
                onChange={(e) => handleChange('correctFeedback', e.target.value)}
                placeholder="Feedback to show when answered correctly"
                aria-label="Correct answer feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="drag-incorrectFeedback">Incorrect Feedback</label>
              <textarea
                id="drag-incorrectFeedback"
                value={block.incorrectFeedback || ''}
                onChange={(e) => handleChange('incorrectFeedback', e.target.value)}
                placeholder="Feedback to show when answered incorrectly"
                aria-label="Incorrect answer feedback"
              />
            </div>
          </>
        )}

        {block.type === 'hotspot' && (
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
                          onChange={(e) => {
                            const newHotspots = [...(block.hotspots || [])];
                            newHotspots[idx] = { ...newHotspots[idx], top: parseInt(e.target.value) };
                            handleChange('hotspots', newHotspots);
                          }}
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
                          onChange={(e) => {
                            const newHotspots = [...(block.hotspots || [])];
                            newHotspots[idx] = { ...newHotspots[idx], left: parseInt(e.target.value) };
                            handleChange('hotspots', newHotspots);
                          }}
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
                          onChange={(e) => {
                            const newHotspots = [...(block.hotspots || [])];
                            newHotspots[idx] = { ...newHotspots[idx], width: parseInt(e.target.value) };
                            handleChange('hotspots', newHotspots);
                          }}
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
                          onChange={(e) => {
                            const newHotspots = [...(block.hotspots || [])];
                            newHotspots[idx] = { ...newHotspots[idx], height: parseInt(e.target.value) };
                            handleChange('hotspots', newHotspots);
                          }}
                          placeholder="Height"
                        />
                      </div>
                    </div>
                    <button
                      className="btn-small delete"
                      onClick={() => {
                        const newHotspots = block.hotspots.filter((_, i) => i !== idx);
                        handleChange('hotspots', newHotspots);
                      }}
                      title="Remove hotspot"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn-small"
                onClick={() => {
                  const newHotspots = [...(block.hotspots || [])];
                  newHotspots.push({ id: `hotspot${Date.now()}`, top: 0, left: 0, width: 10, height: 10 });
                  handleChange('hotspots', newHotspots);
                }}
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

            <div className="form-group">
              <label htmlFor="hotspot-correctFeedback">Correct Feedback</label>
              <textarea
                id="hotspot-correctFeedback"
                value={block.correctFeedback || ''}
                onChange={(e) => handleChange('correctFeedback', e.target.value)}
                placeholder="Feedback to show when answered correctly"
                aria-label="Correct answer feedback"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hotspot-incorrectFeedback">Incorrect Feedback</label>
              <textarea
                id="hotspot-incorrectFeedback"
                value={block.incorrectFeedback || ''}
                onChange={(e) => handleChange('incorrectFeedback', e.target.value)}
                placeholder="Feedback to show when answered incorrectly"
                aria-label="Incorrect answer feedback"
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
