import React, { useState, useEffect } from 'react';
import './TemplateLibrary.css';

function TemplateLibrary({ onSelectTemplate, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample templates data
  useEffect(() => {
    const sampleTemplates = [
      {
        id: 1,
        name: 'Compliance Training',
        category: 'compliance',
        description: 'Template for regulatory compliance training with knowledge checks',
        previewImage: '/api/placeholder/300/200',
        blocks: [
          {
            id: Date.now() + 1,
            type: 'heading',
            content: 'Compliance Training Overview'
          },
          {
            id: Date.now() + 2,
            type: 'text',
            content: 'This training covers important compliance requirements that all employees must understand.'
          },
          {
            id: Date.now() + 3,
            type: 'knowledge-check',
            question: 'Why is compliance important?',
            questionType: 'multiple-choice',
            options: ['To avoid legal issues', 'To maintain company reputation', 'To ensure safety', 'All of the above'],
            correctAnswer: 3,
            correctFeedback: 'Correct! Compliance is important for all these reasons.',
            incorrectFeedback: 'Please review the material and try again.'
          }
        ],
        colorScheme: {
          primary: '#001f3d',
          secondary: '#1863d6',
          accent: '#b6cbe1'
        }
      },
      {
        id: 2,
        name: 'Onboarding',
        category: 'onboarding',
        description: 'New employee onboarding with company information and policies',
        previewImage: '/api/placeholder/300/200',
        blocks: [
          {
            id: Date.now() + 4,
            type: 'heading',
            content: 'Welcome to Our Company'
          },
          {
            id: Date.now() + 5,
            type: 'text',
            content: 'Welcome to our team! This onboarding will help you get started.'
          },
          {
            id: Date.now() + 6,
            type: 'image',
            url: '',
            alt: 'Company logo',
            title: 'Company Logo'
          }
        ],
        colorScheme: {
          primary: '#151983',
          secondary: '#1863d6',
          accent: '#e0e5ff'
        }
      },
      {
        id: 3,
        name: 'Safety Training',
        category: 'safety',
        description: 'Workplace safety training with interactive scenarios',
        previewImage: '/api/placeholder/300/200',
        blocks: [
          {
            id: Date.now() + 7,
            type: 'heading',
            content: 'Workplace Safety Guidelines'
          },
          {
            id: Date.now() + 8,
            type: 'text',
            content: 'Follow these safety protocols to ensure a safe work environment.'
          },
          {
            id: Date.now() + 9,
            type: 'drag-and-drop',
            question: 'Match safety equipment to its use case',
            items: [
              { id: 'helmet', content: 'Safety Helmet' },
              { id: 'gloves', content: 'Safety Gloves' }
            ],
            targets: [
              { id: 'construction', label: 'Construction Work' },
              { id: 'chemical', label: 'Chemical Handling' }
            ],
            correctMapping: {
              'construction': 'helmet',
              'chemical': 'gloves'
            },
            correctFeedback: 'Perfect! You matched the safety equipment correctly.',
            incorrectFeedback: 'Please review the safety guidelines.'
          }
        ],
        colorScheme: {
          primary: '#c5221f',
          secondary: '#ff9800',
          accent: '#fff3e0'
        }
      },
      {
        id: 4,
        name: 'Soft Skills',
        category: 'skills',
        description: 'Communication and leadership skills development',
        previewImage: '/api/placeholder/300/200',
        blocks: [
          {
            id: Date.now() + 10,
            type: 'heading',
            content: 'Effective Communication'
          },
          {
            id: Date.now() + 11,
            type: 'text',
            content: 'Learn how to communicate effectively with your team.'
          },
          {
            id: Date.now() + 12,
            type: 'branching-scenario',
            scenario: 'You need to give feedback to a team member who missed a deadline. How do you approach this?',
            paths: [
              { choice: 'Schedule a private meeting to discuss', outcome: 'This shows respect and allows for open dialogue' },
              { choice: 'Address it immediately in front of others', outcome: 'This could embarrass the team member and damage trust' }
            ]
          }
        ],
        colorScheme: {
          primary: '#0a7e3a',
          secondary: '#4caf50',
          accent: '#e8f5e9'
        }
      }
    ];
    setTemplates(sampleTemplates);
  }, []);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'onboarding', name: 'Onboarding' },
    { id: 'safety', name: 'Safety' },
    { id: 'skills', name: 'Soft Skills' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="template-library-overlay">
      <div className="template-library">
        <div className="template-library-header">
          <h2>Choose a Template</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="template-library-filters">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="template-grid">
          {filteredTemplates.map(template => (
            <div key={template.id} className="template-card">
              <div 
                className="template-preview" 
                style={{ backgroundColor: template.colorScheme.accent }}
              >
                <div className="template-preview-content">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              </div>
              <div className="template-info">
                <h4>{template.name}</h4>
                <p>{template.description}</p>
                <button 
                  className="apply-template-button"
                  onClick={() => handleTemplateSelect(template)}
                >
                  Apply Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateLibrary;