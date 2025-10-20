import React, { useState, useEffect } from 'react';
import './SmartSuggestions.css';

function SmartSuggestions({ currentPage, blocks, onSuggestionAccept }) {
  const [suggestions, setSuggestions] = useState([]);
  const [visible, setVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  // Generate suggestions based on current content
  useEffect(() => {
    const newSuggestions = generateSuggestions(currentPage, blocks);
    setSuggestions(newSuggestions);
  }, [currentPage, blocks]);

  const generateSuggestions = (page, blocks) => {
    const suggestions = [];
    
    // Suggest adding assessments if there are many content blocks but few assessments
    const contentBlocks = blocks.filter(b => ['text', 'heading', 'image', 'video'].includes(b.type));
    const assessmentBlocks = blocks.filter(b => ['knowledge-check', 'drag-and-drop', 'hotspot'].includes(b.type));
    
    if (contentBlocks.length > 3 && assessmentBlocks.length === 0) {
      suggestions.push({
        id: 'add-assessment',
        type: 'action',
        title: 'Add Knowledge Check',
        description: 'Add an assessment to check understanding of the content',
        category: 'assessment',
        action: () => onSuggestionAccept({ type: 'knowledge-check', content: 'What did you learn from this section?' })
      });
    }
    
    // Suggest adding multimedia if there are many text blocks
    const textBlocks = blocks.filter(b => b.type === 'text');
    const mediaBlocks = blocks.filter(b => ['image', 'video'].includes(b.type));
    
    if (textBlocks.length > 2 && mediaBlocks.length < 2) {
      suggestions.push({
        id: 'add-media',
        type: 'action',
        title: 'Add Image or Video',
        description: 'Visual elements can help reinforce your message',
        category: 'media',
        action: () => onSuggestionAccept({ type: 'image', content: 'Add a relevant image to illustrate this concept' })
      });
    }
    
    // Suggest content ideas based on page title
    if (page.title.toLowerCase().includes('safety')) {
      suggestions.push({
        id: 'safety-idea-1',
        type: 'idea',
        title: 'Safety Scenario',
        description: 'Consider adding a branching scenario showing proper safety procedures',
        category: 'content',
        action: () => onSuggestionAccept({ 
          type: 'branching-scenario', 
          content: 'Scenario: A team member is not following safety protocols. How do you address this?' 
        })
      });
      
      suggestions.push({
        id: 'safety-idea-2',
        type: 'idea',
        title: 'Safety Checklist',
        description: 'Add a knowledge check about safety equipment requirements',
        category: 'content',
        action: () => onSuggestionAccept({ 
          type: 'knowledge-check', 
          question: 'What safety equipment is required in this area?',
          questionType: 'multiple-choice',
          options: ['Hard hat', 'Safety glasses', 'Steel-toed boots', 'All of the above'],
          correctAnswer: 3
        })
      });
    }
    
    // Suggest best practices
    if (blocks.length > 5) {
      suggestions.push({
        id: 'best-practice-1',
        type: 'tip',
        title: 'Chunk Your Content',
        description: 'Long pages can overwhelm learners. Consider breaking this into multiple pages.',
        category: 'structure',
        action: null
      });
    }
    
    // Suggest accessibility improvement
    const imagesWithoutAlt = blocks.filter(b => b.type === 'image' && (!b.alt || b.alt.trim() === ''));
    if (imagesWithoutAlt.length > 0) {
      suggestions.push({
        id: 'accessibility-1',
        type: 'tip',
        title: 'Add Alt Text',
        description: `You have ${imagesWithoutAlt.length} image(s) without alt text. This helps screen readers.`,
        category: 'accessibility',
        action: null
      });
    }
    
    return suggestions;
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.action) {
      suggestion.action();
    }
  };

  const categoryIcons = {
    assessment: '📝',
    media: '🖼️',
    content: '💡',
    structure: '📋',
    accessibility: '♿'
  };

  return (
    <div className={`smart-suggestions ${visible ? 'visible' : 'hidden'}`}>
      <div className="suggestions-header">
        <h3>Content Assistant</h3>
        <button className="toggle-suggestions" onClick={() => setVisible(!visible)}>
          {visible ? '−' : '+'}
        </button>
      </div>
      
      {visible && (
        <>
          <div className="suggestions-tabs">
            <button 
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`tab-button ${activeTab === 'action' ? 'active' : ''}`}
              onClick={() => setActiveTab('action')}
            >
              Actions
            </button>
            <button 
              className={`tab-button ${activeTab === 'tip' ? 'active' : ''}`}
              onClick={() => setActiveTab('tip')}
            >
              Tips
            </button>
          </div>
          
          <div className="suggestions-list">
            {suggestions
              .filter(suggestion => 
                activeTab === 'all' || 
                (activeTab === 'action' && suggestion.type !== 'tip') ||
                (activeTab === 'tip' && suggestion.type === 'tip')
              )
              .map(suggestion => (
                <div 
                  key={suggestion.id} 
                  className={`suggestion-item ${suggestion.type === 'tip' ? 'tip' : 'action'}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-icon">
                    {categoryIcons[suggestion.category] || '✨'}
                  </div>
                  <div className="suggestion-content">
                    <h4>{suggestion.title}</h4>
                    <p>{suggestion.description}</p>
                  </div>
                  {suggestion.action && (
                    <div className="suggestion-action">
                      <button className="accept-suggestion">Add</button>
                    </div>
                  )}
                </div>
              ))
            }
            
            {suggestions.length === 0 && (
              <div className="no-suggestions">
                <p>Keep building your content! Suggestions will appear as you add more material.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SmartSuggestions;