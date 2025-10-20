import React, { useState } from 'react';
import './InteractiveBlock.css';

function DragAndDropBlock({ block, isPreview = false }) {
  const [items, setItems] = useState(block.items || []);
  const [targets, setTargets] = useState(block.targets || []);
  const [draggedItem, setDraggedItem] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleDragStart = (e, itemId) => {
    if (isPreview) return;
    setDraggedItem(itemId);
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    if (isPreview) return;
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    
    // Update user answers
    const newAnswers = { ...userAnswers, [targetId]: itemId };
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (block.correctMapping) {
      let correctCount = 0;
      const total = Object.keys(block.correctMapping).length;
      
      for (const [targetId, expectedItemId] of Object.entries(block.correctMapping)) {
        if (userAnswers[targetId] === expectedItemId) {
          correctCount++;
        }
      }
      
      const score = Math.round((correctCount / total) * 100);
      const isCorrect = correctCount === total;
      
      setFeedback(isCorrect 
        ? block.correctFeedback || 'Perfect! All items matched correctly.' 
        : `${block.incorrectFeedback || 'Some matches need correction.'} Score: ${score}%`
      );
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setFeedback('');
  };

  return (
    <div className={`interactive-block drag-and-drop ${isPreview ? 'preview-mode' : ''}`}>
      <div className="interactive-header">
        <h3>{block.question || 'Drag and Drop Exercise'}</h3>
        {block.questionType && (
          <span className="question-type-badge">{block.questionType.replace('-', ' ')}</span>
        )}
      </div>
      
      <div className="drag-container">
        <div className="items-area">
          <h4>Items to Drag</h4>
          <div className="items-list">
            {items.map(item => (
              <div
                key={item.id}
                className={`draggable-item ${isSubmitted && userAnswers && Object.values(userAnswers).includes(item.id) ? 'placed' : ''}`}
                draggable={!isSubmitted && !isPreview}
                onDragStart={(e) => handleDragStart(e, item.id)}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
        
        <div className="targets-area">
          <h4>Drop Targets</h4>
          <div className="targets-list">
            {targets.map(target => (
              <div 
                key={target.id} 
                className={`drop-target ${userAnswers[target.id] ? 'filled' : ''} ${isSubmitted ? (userAnswers[target.id] === block.correctMapping?.[target.id] ? 'correct' : 'incorrect') : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, target.id)}
              >
                <div className="target-label">{target.label}</div>
                {userAnswers[target.id] && (
                  <div className="target-content">
                    {items.find(item => item.id === userAnswers[target.id])?.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {!isPreview && !isSubmitted && (
        <div className="interactive-actions">
          <button className="submit-btn" onClick={handleSubmit}>Submit Answer</button>
          <button className="reset-btn" onClick={handleReset}>Reset</button>
        </div>
      )}
      
      {isSubmitted && (
        <div className={`feedback ${feedback.includes('Perfect') || !feedback.includes('Some') ? 'correct' : 'incorrect'}`}>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

function HotspotBlock({ block, isPreview = false }) {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleHotspotClick = (hotspotId) => {
    if (isPreview || isSubmitted) return;
    setSelectedHotspot(hotspotId);
  };

  const handleSubmit = () => {
    const isCorrect = selectedHotspot === block.correctHotspot;
    setFeedback(isCorrect 
      ? block.correctFeedback || 'Correct! You identified the right area.'
      : block.incorrectFeedback || 'Incorrect. Please try again.'
    );
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedHotspot(null);
    setIsSubmitted(false);
    setFeedback('');
  };

  return (
    <div className={`interactive-block hotspot ${isPreview ? 'preview-mode' : ''}`}>
      <div className="interactive-header">
        <h3>{block.question || 'Identify the Correct Area'}</h3>
        {block.questionType && (
          <span className="question-type-badge">{block.questionType.replace('-', ' ')}</span>
        )}
      </div>
      
      <div className="hotspot-container">
        <div className="image-container">
          {block.imageUrl && <img src={block.imageUrl} alt={block.alt || 'Hotspot image'} />}
          
          {block.hotspots && block.hotspots.map(hotspot => (
            <div
              key={hotspot.id}
              className={`hotspot-area ${selectedHotspot === hotspot.id ? 'selected' : ''} ${isSubmitted && hotspot.id === block.correctHotspot ? 'correct' : ''}`}
              style={{
                top: `${hotspot.top}%`,
                left: `${hotspot.left}%`,
                width: `${hotspot.width}%`,
                height: `${hotspot.height}%`,
              }}
              onClick={() => handleHotspotClick(hotspot.id)}
            >
              {isSubmitted && hotspot.id === block.correctHotspot && (
                <div className="hotspot-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {!isPreview && !isSubmitted && (
        <div className="interactive-actions">
          <button className="submit-btn" onClick={handleSubmit}>Submit Answer</button>
          <button className="reset-btn" onClick={handleReset}>Reset</button>
        </div>
      )}
      
      {isSubmitted && (
        <div className={`feedback ${selectedHotspot === block.correctHotspot ? 'correct' : 'incorrect'}`}>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export { DragAndDropBlock, HotspotBlock };