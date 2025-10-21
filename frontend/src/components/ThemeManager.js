import React, { useState, useEffect } from 'react';
import './ThemeManager.css';

const ThemeManager = ({ project, onUpdateProject }) => {
  const [selectedTheme, setSelectedTheme] = useState(project.theme || 'default');
  const [customColors, setCustomColors] = useState(project.customColors || {});

  const availableThemes = [
    {
      id: 'default',
      name: 'Default (Professional)',
      description: 'Clean, professional theme with blue accents',
      preview: {
        primary: '#001f3d',
        secondary: '#151983',
        accent: '#1863d6',
        background: '#f9f9f9',
        text: '#001f3d'
      }
    },
    {
      id: 'mobile-optimized',
      name: 'Mobile Optimized',
      description: 'High contrast theme optimized for mobile devices',
      preview: {
        primary: '#001f3d',
        secondary: '#1863d6',
        accent: '#0074d9',
        background: '#ffffff',
        text: '#001f3d'
      }
    },
    {
      id: 'accessibility-friendly',
      name: 'Accessibility Friendly',
      description: 'High contrast with large touch targets for accessibility',
      preview: {
        primary: '#001f3d',
        secondary: '#d9534f',
        accent: '#5cb85c',
        background: '#ffffff',
        text: '#000000'
      }
    },
    {
      id: 'dark-mode',
      name: 'Dark Mode',
      description: 'Low-light theme for evening studying',
      preview: {
        primary: '#1a1a1a',
        secondary: '#2c2c2c',
        accent: '#4a90e2',
        background: '#0d0d0d',
        text: '#e6e6e6'
      }
    }
  ];

  useEffect(() => {
    if (project) {
      setSelectedTheme(project.theme || 'default');
      setCustomColors(project.customColors || {});
    }
  }, [project]);

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        theme: themeId,
        customColors: customColors
      });
    }
  };

  const handleColorChange = (colorName, value) => {
    const newCustomColors = {
      ...customColors,
      [colorName]: value
    };
    setCustomColors(newCustomColors);
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        theme: selectedTheme,
        customColors: newCustomColors
      });
    }
  };

  return (
    <div className="theme-manager">
      <h3>Theme Selection</h3>
      <p>Choose a theme for your course. The theme affects the look and feel across all pages.</p>
      
      <div className="theme-options">
        {availableThemes.map(theme => (
          <div 
            key={theme.id}
            className={`theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
            onClick={() => handleThemeChange(theme.id)}
          >
            <div className="theme-preview">
              <div 
                className="color-swatch" 
                style={{ backgroundColor: theme.preview.primary }}
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: theme.preview.secondary }}
              ></div>
              <div 
                className="color-swatch" 
                style={{ backgroundColor: theme.preview.accent }}
              ></div>
            </div>
            <div className="theme-info">
              <h4>{theme.name}</h4>
              <p>{theme.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedTheme === 'custom' && (
        <div className="custom-colors">
          <h4>Custom Colors</h4>
          <div className="color-controls">
            <div className="color-control">
              <label>Primary Color</label>
              <input
                type="color"
                value={customColors.primary || '#001f3d'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
            </div>
            <div className="color-control">
              <label>Secondary Color</label>
              <input
                type="color"
                value={customColors.secondary || '#151983'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
            </div>
            <div className="color-control">
              <label>Accent Color</label>
              <input
                type="color"
                value={customColors.accent || '#1863d6'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
              />
            </div>
            <div className="color-control">
              <label>Background Color</label>
              <input
                type="color"
                value={customColors.background || '#f9f9f9'}
                onChange={(e) => handleColorChange('background', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mobile-optimization">
        <h4>Mobile Optimization</h4>
        <div className="mobile-settings">
          <div className="setting">
            <label>
              <input
                type="checkbox"
                checked={project.mobileOptimized || false}
                onChange={(e) => {
                  if (onUpdateProject) {
                    onUpdateProject({
                      ...project,
                      mobileOptimized: e.target.checked
                    });
                  }
                }}
              />
              Enable mobile-optimized layout
            </label>
          </div>
          <div className="setting">
            <label>
              <input
                type="checkbox"
                checked={project.largeTouchTargets || false}
                onChange={(e) => {
                  if (onUpdateProject) {
                    onUpdateProject({
                      ...project,
                      largeTouchTargets: e.target.checked
                    });
                  }
                }}
              />
              Use large touch targets for mobile
            </label>
          </div>
          <div className="setting">
            <label htmlFor="fontSize">Base Font Size: {project.fontSize || '16'}px</label>
            <input
              id="fontSize"
              type="range"
              min="14"
              max="20"
              value={project.fontSize || 16}
              onChange={(e) => {
                if (onUpdateProject) {
                  onUpdateProject({
                    ...project,
                    fontSize: parseInt(e.target.value)
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;