/**
 * Industry Selector Component
 * Allows users to select training domain/industry for template suggestions
 */

import React, { useState } from 'react';
import { INDUSTRY_DOMAINS, getIndustryTemplates } from '../../data/industryTemplates';
import './IndustrySelector.css';

const INDUSTRY_ICONS = {
  [INDUSTRY_DOMAINS.COMPLIANCE]: '⚖️',
  [INDUSTRY_DOMAINS.ONBOARDING]: '👋',
  [INDUSTRY_DOMAINS.PRODUCT]: '🎯',
  [INDUSTRY_DOMAINS.SOFT_SKILLS]: '💼',
  [INDUSTRY_DOMAINS.TECHNICAL]: '⚙️',
  [INDUSTRY_DOMAINS.HEALTHCARE]: '🏥',
  [INDUSTRY_DOMAINS.FINANCE]: '💰',
  [INDUSTRY_DOMAINS.MANUFACTURING]: '🏭',
  [INDUSTRY_DOMAINS.CUSTOM]: '✨'
};

const INDUSTRY_DESCRIPTIONS = {
  [INDUSTRY_DOMAINS.COMPLIANCE]: 'Data protection, GDPR, regulations, and compliance training',
  [INDUSTRY_DOMAINS.ONBOARDING]: 'New hire orientation, company policies, and role training',
  [INDUSTRY_DOMAINS.PRODUCT]: 'Feature walkthroughs, use cases, and product expertise',
  [INDUSTRY_DOMAINS.SOFT_SKILLS]: 'Communication, leadership, and interpersonal skills',
  [INDUSTRY_DOMAINS.TECHNICAL]: 'Software, IT systems, and development tools training',
  [INDUSTRY_DOMAINS.HEALTHCARE]: 'Medical, patient care, and healthcare compliance',
  [INDUSTRY_DOMAINS.FINANCE]: 'Financial regulations, banking, and accounting training',
  [INDUSTRY_DOMAINS.MANUFACTURING]: 'Operations, safety, and production training',
  [INDUSTRY_DOMAINS.CUSTOM]: 'Start with a blank course and build from scratch'
};

const IndustrySelector = ({ onSelectIndustry, onCancel }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const availableIndustries = [
    INDUSTRY_DOMAINS.COMPLIANCE,
    INDUSTRY_DOMAINS.ONBOARDING,
    INDUSTRY_DOMAINS.PRODUCT,
    INDUSTRY_DOMAINS.SOFT_SKILLS,
    INDUSTRY_DOMAINS.TECHNICAL,
    INDUSTRY_DOMAINS.CUSTOM
  ];

  const handleSelectIndustry = (industry) => {
    setSelectedIndustry(industry);
    // Auto-select after brief delay for visual feedback
    setTimeout(() => {
      onSelectIndustry(industry);
    }, 300);
  };

  const industryName = (domain) => {
    const nameMap = {
      [INDUSTRY_DOMAINS.COMPLIANCE]: 'Compliance Training',
      [INDUSTRY_DOMAINS.ONBOARDING]: 'Employee Onboarding',
      [INDUSTRY_DOMAINS.PRODUCT]: 'Product Training',
      [INDUSTRY_DOMAINS.SOFT_SKILLS]: 'Soft Skills',
      [INDUSTRY_DOMAINS.TECHNICAL]: 'Technical Training',
      [INDUSTRY_DOMAINS.CUSTOM]: 'Blank Course'
    };
    return nameMap[domain];
  };

  return (
    <div className="industry-selector">
      <div className="industry-selector__header">
        <h2>What type of course would you like to create?</h2>
        <p>Choose an industry domain to get started with a tailored template</p>
      </div>

      <div className="industry-selector__view-toggle">
        <button
          className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          aria-label="Grid view"
        >
          ⊞ Grid
        </button>
        <button
          className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          aria-label="List view"
        >
          ≡ List
        </button>
      </div>

      <div className={`industry-selector__grid industry-selector__${viewMode}`}>
        {availableIndustries.map((industry) => (
          <div
            key={industry}
            className={`industry-card ${selectedIndustry === industry ? 'selected' : ''}`}
            onClick={() => handleSelectIndustry(industry)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSelectIndustry(industry);
              }
            }}
            aria-selected={selectedIndustry === industry}
            aria-label={`Select ${industryName(industry)} domain`}
          >
            <div className="industry-card__icon">
              {INDUSTRY_ICONS[industry]}
            </div>
            <h3 className="industry-card__title">{industryName(industry)}</h3>
            <p className="industry-card__description">
              {INDUSTRY_DESCRIPTIONS[industry]}
            </p>
            <div className="industry-card__cta">
              Get Started →
            </div>
          </div>
        ))}
      </div>

      <div className="industry-selector__actions">
        <button
          className="btn btn-secondary"
          onClick={onCancel}
          aria-label="Cancel industry selection"
        >
          Cancel
        </button>
        <p className="industry-selector__help-text">
          💡 Pro Tip: Industry templates come pre-populated with suggested assessments and learning objectives
        </p>
      </div>
    </div>
  );
};

export default IndustrySelector;
