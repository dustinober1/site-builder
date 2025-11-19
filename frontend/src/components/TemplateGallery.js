import React, { useState } from 'react';
import './TemplateGallery.css';
import { getAvailableTemplates, getTemplateById } from '../utils/projectStorage';
import IndustrySelector from './TemplateLibrary/IndustrySelector';
import TemplateSmartSuggestions from './TemplateLibrary/TemplateSmartSuggestions';

function TemplateGallery({ onSelectTemplate, onCancel }) {
  const [templates] = useState(getAvailableTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setProjectName(template.name);
  };

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    const industryTemplate = getTemplateById(industry);
    if (industryTemplate) {
      handleSelectTemplate(industryTemplate);
      setShowSmartSuggestions(true);
      setShowIndustrySelector(false);
    }
  };

  const handleCreate = () => {
    if (projectName.trim() && selectedTemplate) {
      // If this is an industry template and not showing suggestions yet, show suggestions
      if (selectedTemplate.suggestedQuestions?.length > 0 || selectedTemplate.suggestedLearningObjects?.length > 0) {
        setShowSmartSuggestions(true);
      } else {
        onSelectTemplate(selectedTemplate.templateId, projectName);
        setSelectedTemplate(null);
        setProjectName('');
      }
    }
  };

  const handleAddSuggestions = async (suggestions) => {
    // In a real app, this would add the suggestions to the project
    // For now, just proceed with course creation
    onSelectTemplate(selectedTemplate.templateId, projectName);
    setSelectedTemplate(null);
    setProjectName('');
    setShowSmartSuggestions(false);
  };

  const handleCreateCourse = () => {
    onSelectTemplate(selectedTemplate.templateId, projectName);
    setSelectedTemplate(null);
    setProjectName('');
    setShowSmartSuggestions(false);
  };

  const categoryGroups = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  const categoryLabels = {
    basic: 'Getting Started',
    environmental: 'Environmental',
    business: 'Business',
    technical: 'Technical'
  };

  return (
    <div className="template-gallery-overlay">
      <div className="template-gallery">
        {showSmartSuggestions && selectedTemplate ? (
          <>
            <div className="gallery-header">
              <h2>Enhance Your Course</h2>
              <button
                className="close-button"
                onClick={onCancel}
                aria-label="Close template gallery"
              >
                ×
              </button>
            </div>
            <div className="gallery-content">
              <TemplateSmartSuggestions
                template={selectedTemplate}
                onAddSuggestions={handleAddSuggestions}
                onCreateProject={handleCreateCourse}
              />
            </div>
          </>
        ) : showIndustrySelector ? (
          <>
            <div className="gallery-header">
              <h2>Get Started</h2>
              <button
                className="close-button"
                onClick={onCancel}
                aria-label="Close template gallery"
              >
                ×
              </button>
            </div>
            <div className="gallery-content">
              <IndustrySelector
                onSelectIndustry={handleIndustrySelect}
                onCancel={() => setShowIndustrySelector(false)}
              />
            </div>
          </>
        ) : selectedTemplate ? (
          <div className="template-detail">
            <div className="detail-content">
              <h3>{selectedTemplate.name}</h3>
              <p className="description">{selectedTemplate.description}</p>
              
              <div className="detail-stats">
                <div className="stat">
                  <span className="label">Pages:</span>
                  <span className="value">{selectedTemplate.pages.length}</span>
                </div>
                <div className="stat">
                  <span className="label">Category:</span>
                  <span className="value">{categoryLabels[selectedTemplate.category]}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="course-name">Course Name</label>
                <input
                  id="course-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter your course name"
                  autoFocus
                  aria-required="true"
                />
              </div>

              <div className="action-buttons">
                <button 
                  className="create-button"
                  onClick={handleCreate}
                  disabled={!projectName.trim()}
                  aria-label="Create course from template"
                >
                  Create Course
                </button>
                <button 
                  className="back-button"
                  onClick={() => {
                    setSelectedTemplate(null);
                    setProjectName('');
                  }}
                >
                  Back to Templates
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="gallery-content">
            <div className="gallery-cta-section">
              <div className="gallery-cta-card">
                <div className="cta-icon">⚡</div>
                <h3>Get Started Faster</h3>
                <p>Choose an industry domain to get a pre-built template with suggested assessments and learning objectives</p>
                <button
                  className="cta-button"
                  onClick={() => setShowIndustrySelector(true)}
                  aria-label="Browse industry templates"
                >
                  Browse Industry Templates
                </button>
              </div>
            </div>

            <div className="gallery-divider">
              <span>or</span>
            </div>

            {Object.entries(categoryGroups).map(([category, temps]) => (
              <section key={category} className="template-category">
                <h3 className="category-title">{categoryLabels[category]}</h3>
                <div className="templates-grid">
                  {temps.map(template => (
                    <div
                      key={template.templateId}
                      className="template-card"
                      onClick={() => handleSelectTemplate(template)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSelectTemplate(template);
                      }}
                      aria-label={`Select ${template.name} template`}
                    >
                      <div className="template-icon">
                        {category === 'environmental' && '🌿'}
                        {category === 'business' && '💼'}
                        {category === 'technical' && '⚙️'}
                        {category === 'basic' && '📝'}
                      </div>
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                      <div className="template-meta">
                        <span>{template.pages.length} pages</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="gallery-footer">
          <button 
            className="cancel-button"
            onClick={onCancel}
            aria-label="Cancel template selection"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateGallery;
