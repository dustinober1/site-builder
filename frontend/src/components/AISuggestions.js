import React, { useState, useEffect } from 'react';
import './AISuggestions.css';

const AISuggestions = ({ project, currentPage, blocks, onSuggestionAccept, onSuggestionReject }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const aiSettings = project.aiSettings || {};

  // Mock function to generate AI suggestions based on content
  const generateAISuggestions = async () => {
    if (!aiSettings.aiEnabled || !aiSettings.aiEndpoint || !aiSettings.aiModelName) {
      return [];
    }

    setIsLoading(true);

    try {
      // In a real implementation, this would make a request to the AI endpoint
      // For now, we'll simulate AI suggestions based on the content
      const contentText = blocks.map(block => block.content || block.question || '').join(' ');
      
      // Generate mock suggestions based on content
      const mockSuggestions = [];
      
      if (contentText.toLowerCase().includes('introduction') || contentText.toLowerCase().includes('welcome')) {
        mockSuggestions.push({
          id: 'suggestion-1',
          type: 'text',
          content: 'Consider adding learning objectives to help learners understand what they will achieve in this course.',
          source: 'AI',
          confidence: 0.8
        });
      }
      
      if (contentText.toLowerCase().includes('question') || contentText.toLowerCase().includes('quiz')) {
        mockSuggestions.push({
          id: 'suggestion-2',
          type: 'knowledge-check',
          question: 'Which concepts from the previous section would you like to assess?',
          options: ['Concept A', 'Concept B', 'Concept C', 'All of the above'],
          correctAnswer: 3,
          source: 'AI',
          confidence: 0.7
        });
      }
      
      // Add more suggestions based on content analysis
      mockSuggestions.push({
        id: 'suggestion-3',
        type: 'text',
        content: 'Based on your content, you might want to add a summary section that recaps the key points covered.',
        source: 'AI',
        confidence: 0.9
      });
      
      if (blocks.length < 5) {
        mockSuggestions.push({
          id: 'suggestion-4',
          type: 'heading',
          content: 'Next Steps',
          source: 'AI',
          confidence: 0.6
        });
      }
      
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (aiSettings.aiEnabled) {
      generateAISuggestions();
    }
  }, [blocks, aiSettings]);

  const handleAcceptSuggestion = (suggestion) => {
    onSuggestionAccept(suggestion);
    // Remove the suggestion from the list after accepting
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleRejectSuggestion = (suggestionId) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#28a745';
    if (confidence >= 0.6) return '#ffc107';
    return '#dc3545';
  };

  if (!aiSettings.aiEnabled) {
    return (
      <div className="ai-suggestions disabled">
        <p>Enable AI suggestions in settings to get content recommendations.</p>
      </div>
    );
  }

  return (
    <div className="ai-suggestions">
      <div className="suggestions-tabs">
        <button 
          className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content Suggestions
        </button>
        <button 
          className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Content Analysis
        </button>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating AI suggestions...</p>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="suggestions-list">
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="suggestion-item">
              <div className="suggestion-header">
                <div className="suggestion-type">
                  <span 
                    className="confidence-indicator"
                    style={{ backgroundColor: getConfidenceColor(suggestion.confidence) }}
                  ></span>
                  <span className="type-label">{suggestion.type}</span>
                </div>
                <div className="suggestion-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleAcceptSuggestion(suggestion)}
                    title="Accept suggestion"
                  >
                    ✓
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleRejectSuggestion(suggestion.id)}
                    title="Reject suggestion"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="suggestion-content">
                {suggestion.type === 'knowledge-check' ? (
                  <div>
                    <h4>Question: {suggestion.question}</h4>
                    <div className="options">
                      {suggestion.options?.map((option, idx) => (
                        <div key={idx} className="option">
                          {option} {idx === suggestion.correctAnswer && '(Correct)'}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>{suggestion.content || suggestion.question}</p>
                )}
              </div>
              
              <div className="suggestion-meta">
                <span className="confidence">Confidence: {(suggestion.confidence * 100).toFixed(0)}%</span>
                <span className="source">{suggestion.source}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-suggestions">
          <p>No suggestions available. Add more content to receive AI recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;