import React, { useState, useEffect } from 'react';
import './GamificationPanel.css';

const GamificationPanel = ({ project, onUpdateProject }) => {
  const [gamificationSettings, setGamificationSettings] = useState({
    enabled: false,
    badges: [],
    leaderboards: false,
    pointsEnabled: false,
    pointsPerActivity: 10,
    pointsPerAssessment: 20,
    pointsPerCompletion: 50
  });

  useEffect(() => {
    if (project && project.gamification) {
      setGamificationSettings({
        ...gamificationSettings,
        ...project.gamification
      });
    }
  }, [project]);

  const handleChange = (field, value) => {
    const newSettings = {
      ...gamificationSettings,
      [field]: value
    };
    setGamificationSettings(newSettings);

    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        gamification: newSettings
      });
    }
  };

  const handleBadgeChange = (index, field, value) => {
    const newBadges = [...gamificationSettings.badges];
    newBadges[index] = {
      ...newBadges[index],
      [field]: value
    };
    setGamificationSettings({
      ...gamificationSettings,
      badges: newBadges
    });

    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        gamification: {
          ...gamificationSettings,
          badges: newBadges
        }
      });
    }
  };

  const addBadge = () => {
    const newBadges = [
      ...gamificationSettings.badges,
      {
        id: Date.now().toString(),
        name: 'New Badge',
        description: 'Complete this achievement',
        criteria: 'complete_activities',
        threshold: 5,
        icon: '🏆'
      }
    ];
    setGamificationSettings({
      ...gamificationSettings,
      badges: newBadges
    });

    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        gamification: {
          ...gamificationSettings,
          badges: newBadges
        }
      });
    }
  };

  const removeBadge = (index) => {
    const newBadges = gamificationSettings.badges.filter((_, i) => i !== index);
    setGamificationSettings({
      ...gamificationSettings,
      badges: newBadges
    });

    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        gamification: {
          ...gamificationSettings,
          badges: newBadges
        }
      });
    }
  };

  return (
    <div className="gamification-panel">
      <h3>Gamification Elements</h3>
      <p>Add game-like elements to increase learner engagement and motivation.</p>
      
      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={gamificationSettings.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label">Enable Gamification</span>
      </div>

      {gamificationSettings.enabled && (
        <div className="gamification-settings">
          <div className="settings-section">
            <h4>Points System</h4>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={gamificationSettings.pointsEnabled}
                  onChange={(e) => handleChange('pointsEnabled', e.target.checked)}
                />
                Enable Points System
              </label>
            </div>
            
            {gamificationSettings.pointsEnabled && (
              <div className="points-settings">
                <div className="form-row">
                  <div className="form-group">
                    <label>Points per Activity</label>
                    <input
                      type="number"
                      min="1"
                      value={gamificationSettings.pointsPerActivity}
                      onChange={(e) => handleChange('pointsPerActivity', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Points per Assessment</label>
                    <input
                      type="number"
                      min="1"
                      value={gamificationSettings.pointsPerAssessment}
                      onChange={(e) => handleChange('pointsPerAssessment', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Points for Completion</label>
                  <input
                    type="number"
                    min="1"
                    value={gamificationSettings.pointsPerCompletion}
                    onChange={(e) => handleChange('pointsPerCompletion', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h4>Badges</h4>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={gamificationSettings.leaderboards}
                  onChange={(e) => handleChange('leaderboards', e.target.checked)}
                />
                Enable Leaderboards
              </label>
            </div>
            
            <div className="badges-list">
              {gamificationSettings.badges.map((badge, index) => (
                <div key={badge.id || index} className="badge-item">
                  <div className="badge-header">
                    <div className="badge-icon">
                      <input
                        type="text"
                        value={badge.icon}
                        onChange={(e) => handleBadgeChange(index, 'icon', e.target.value)}
                        maxLength="2"
                        placeholder="Badge icon"
                      />
                    </div>
                    <div className="badge-actions">
                      <button 
                        className="remove-badge-btn"
                        onClick={() => removeBadge(index)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="badge-details">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={badge.name}
                        onChange={(e) => handleBadgeChange(index, 'name', e.target.value)}
                        placeholder="Badge name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        value={badge.description}
                        onChange={(e) => handleBadgeChange(index, 'description', e.target.value)}
                        placeholder="Badge description"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Criteria</label>
                        <select
                          value={badge.criteria}
                          onChange={(e) => handleBadgeChange(index, 'criteria', e.target.value)}
                        >
                          <option value="complete_activities">Complete Activities</option>
                          <option value="score_assessment">Score on Assessment</option>
                          <option value="time_spent">Time Spent Learning</option>
                          <option value="pages_completed">Pages Completed</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Threshold</label>
                        <input
                          type="number"
                          min="1"
                          value={badge.threshold}
                          onChange={(e) => handleBadgeChange(index, 'threshold', parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="add-badge-btn" onClick={addBadge}>
                + Add Badge
              </button>
            </div>
          </div>

          <div className="gamification-preview">
            <h4>Preview</h4>
            <div className="preview-content">
              <div className="progress-example">
                <h5>Progress Bar</h5>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '45%' }}
                  ></div>
                </div>
                <div className="progress-text">45% Complete</div>
              </div>
              
              <div className="badges-example">
                <h5>Earned Badges</h5>
                <div className="badges-container">
                  {gamificationSettings.badges.slice(0, 3).map((badge, index) => (
                    <div key={index} className="badge-preview">
                      <span className="badge-icon">{badge.icon}</span>
                      <span className="badge-name">{badge.name}</span>
                    </div>
                  ))}
                  {gamificationSettings.badges.length === 0 && (
                    <div className="no-badges">No badges configured</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationPanel;