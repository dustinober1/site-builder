/**
 * Template Smart Suggestions Component
 * Shows smart recommendations for questions and learning objects
 */

import React, { useState } from 'react';
import './TemplateSmartSuggestions.css';

const TemplateSmartSuggestions = ({ template, onAddSuggestions, onCreateProject }) => {
  const [selectedSuggestions, setSelectedSuggestions] = useState({
    questions: [],
    learningObjects: []
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleSuggestion = (type, id) => {
    setSelectedSuggestions(prev => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter(item => item !== id)
        : [...prev[type], id]
    }));
  };

  const handleAddSuggestions = async () => {
    setIsAdding(true);
    try {
      await onAddSuggestions(selectedSuggestions);
      setIsAdding(false);
      onCreateProject();
    } catch (error) {
      console.error('Error adding suggestions:', error);
      setIsAdding(false);
    }
  };

  const handleSkip = () => {
    onCreateProject();
  };

  return (
    <div className="template-smart-suggestions">
      <div className="suggestions__header">
        <h2>Enhance Your Course</h2>
        <p>Add recommended assessments and learning objects to your {template.name}</p>
      </div>

      <div className="suggestions__container">
        {/* Suggested Questions Section */}
        {template.suggestedQuestions && template.suggestedQuestions.length > 0 && (
          <div className="suggestions__section">
            <div className="suggestions__section-header">
              <h3>📝 Suggested Assessments</h3>
              <span className="suggestions__count">
                {template.suggestedQuestions.length} available
              </span>
            </div>
            <p className="suggestions__description">
              These knowledge checks are aligned with your course content and will help measure learner comprehension.
            </p>
            <div className="suggestions__list">
              {template.suggestedQuestions.map((questionId) => (
                <div key={questionId} className="suggestion-item">
                  <input
                    type="checkbox"
                    id={`question-${questionId}`}
                    checked={selectedSuggestions.questions.includes(questionId)}
                    onChange={() => handleToggleSuggestion('questions', questionId)}
                    aria-label={`Add question ${questionId}`}
                  />
                  <label htmlFor={`question-${questionId}`}>
                    <div className="suggestion-item__content">
                      <span className="suggestion-item__title">
                        {getQuestionTitle(questionId)}
                      </span>
                      <span className="suggestion-item__description">
                        {getQuestionDescription(questionId)}
                      </span>
                    </div>
                  </label>
                  <span className="suggestion-item__badge">Question</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Learning Objects Section */}
        {template.suggestedLearningObjects && template.suggestedLearningObjects.length > 0 && (
          <div className="suggestions__section">
            <div className="suggestions__section-header">
              <h3>🎓 Suggested Learning Objects</h3>
              <span className="suggestions__count">
                {template.suggestedLearningObjects.length} available
              </span>
            </div>
            <p className="suggestions__description">
              These reusable content pieces can be inserted into your course pages to enrich the learning experience.
            </p>
            <div className="suggestions__list">
              {template.suggestedLearningObjects.map((objectId) => (
                <div key={objectId} className="suggestion-item">
                  <input
                    type="checkbox"
                    id={`object-${objectId}`}
                    checked={selectedSuggestions.learningObjects.includes(objectId)}
                    onChange={() => handleToggleSuggestion('learningObjects', objectId)}
                    aria-label={`Add learning object ${objectId}`}
                  />
                  <label htmlFor={`object-${objectId}`}>
                    <div className="suggestion-item__content">
                      <span className="suggestion-item__title">
                        {getLearningObjectTitle(objectId)}
                      </span>
                      <span className="suggestion-item__description">
                        {getLearningObjectDescription(objectId)}
                      </span>
                    </div>
                  </label>
                  <span className="suggestion-item__badge">Content</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Info Section */}
        <div className="suggestions__section suggestions__info">
          <h3>ℹ️ Course Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Estimated Time</span>
              <span className="info-value">{template.estimatedTime} minutes</span>
            </div>
            <div className="info-item">
              <span className="info-label">Difficulty</span>
              <span className="info-value">{template.difficulty}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Industry</span>
              <span className="info-value">{template.industry}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Pages</span>
              <span className="info-value">{template.pages.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="suggestions__actions">
        <button
          className="btn btn-secondary"
          onClick={handleSkip}
          disabled={isAdding}
        >
          Skip Suggestions
        </button>
        <button
          className="btn btn-primary"
          onClick={handleAddSuggestions}
          disabled={isAdding || (selectedSuggestions.questions.length === 0 && selectedSuggestions.learningObjects.length === 0)}
        >
          {isAdding ? 'Adding...' : 'Add & Create Course'}
        </button>
      </div>

      <p className="suggestions__help">
        💡 You can always add more questions and learning objects after creating your course.
      </p>
    </div>
  );
};

/**
 * Helper functions to get question details
 * In a real app, these would fetch from a database
 */
const getQuestionTitle = (id) => {
  const questions = {
    'qb-gdpr-001': 'GDPR Principles',
    'qb-privacy-001': 'Data Privacy Rights',
    'qb-compliance-001': 'Compliance Requirements',
    'qb-company-001': 'Company Facts',
    'qb-policies-001': 'Company Policies',
    'qb-benefits-001': 'Benefits Overview',
    'qb-features-001': 'Product Features',
    'qb-scenarios-001': 'Real-World Scenarios',
    'qb-communication-001': 'Communication Skills',
    'qb-leadership-001': 'Leadership Principles',
    'qb-tech-001': 'Technical Concepts',
    'qb-hands-on-001': 'Hands-On Exercises'
  };
  return questions[id] || 'Knowledge Check';
};

const getQuestionDescription = (id) => {
  const descriptions = {
    'qb-gdpr-001': 'Test knowledge of GDPR principles and regulations',
    'qb-privacy-001': 'Assess understanding of data privacy rights',
    'qb-compliance-001': 'Verify compliance requirement understanding',
    'qb-company-001': 'Check company knowledge and history',
    'qb-policies-001': 'Validate understanding of company policies',
    'qb-benefits-001': 'Confirm benefits package comprehension',
    'qb-features-001': 'Test product feature knowledge',
    'qb-scenarios-001': 'Apply knowledge to real scenarios',
    'qb-communication-001': 'Practice communication techniques',
    'qb-leadership-001': 'Assess leadership understanding',
    'qb-tech-001': 'Test technical knowledge',
    'qb-hands-on-001': 'Hands-on practical exercises'
  };
  return descriptions[id] || 'Assess learner understanding';
};

const getLearningObjectTitle = (id) => {
  const objects = {
    'lo-privacy-policy': 'Privacy Policy Template',
    'lo-data-breach-scenario': 'Data Breach Case Study',
    'lo-company-handbook': 'Company Handbook',
    'lo-benefits-guide': 'Benefits Guide',
    'lo-org-structure': 'Organization Chart',
    'lo-product-demo': 'Product Demo Video',
    'lo-use-cases': 'Use Cases Library',
    'lo-communication-tips': 'Communication Best Practices',
    'lo-leadership-scenarios': 'Leadership Scenarios',
    'lo-setup-guide': 'Setup Guide',
    'lo-code-samples': 'Code Samples'
  };
  return objects[id] || 'Learning Object';
};

const getLearningObjectDescription = (id) => {
  const descriptions = {
    'lo-privacy-policy': 'Template for creating privacy policies',
    'lo-data-breach-scenario': 'Real-world data breach case study',
    'lo-company-handbook': 'Comprehensive company handbook',
    'lo-benefits-guide': 'Detailed benefits program guide',
    'lo-org-structure': 'Visual organizational structure',
    'lo-product-demo': 'Interactive product demonstration',
    'lo-use-cases': 'Curated collection of use cases',
    'lo-communication-tips': 'Practical communication tips',
    'lo-leadership-scenarios': 'Interactive leadership scenarios',
    'lo-setup-guide': 'Step-by-step setup instructions',
    'lo-code-samples': 'Ready-to-use code samples'
  };
  return descriptions[id] || 'Reusable learning content';
};

export default TemplateSmartSuggestions;
