import React, { useState } from 'react';
import './TemplateGallery.css';
import { getAvailableTemplates } from '../utils/projectStorage';

function TemplateGallery({ onSelectTemplate, onCancel }) {
  const [templates] = useState(getAvailableTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectName, setProjectName] = useState('');

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setProjectName(template.name);
  };

  const handleCreate = () => {
    if (projectName.trim() && selectedTemplate) {
      onSelectTemplate(selectedTemplate.templateId, projectName);
      setSelectedTemplate(null);
      setProjectName('');
    }
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
        <div className="gallery-header">
          <h2>Choose a Template</h2>
          <button 
            className="close-button"
            onClick={onCancel}
            aria-label="Close template gallery"
          >
            ×
          </button>
        </div>

        {selectedTemplate ? (
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
