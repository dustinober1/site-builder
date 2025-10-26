import React, { useState } from 'react';
import './LearningPath.css';

function LearningPath({ project, currentPage, blocks, onNavigate, onUpdateProject }) {
  const [expandedPages, setExpandedPages] = useState({});
  const [editingPrerequisites, setEditingPrerequisites] = useState(null);
  const [newPrerequisites, setNewPrerequisites] = useState([]);

  // Check if current page is available based on prerequisites
  const isPageAvailable = (pageIndex) => {
    if (pageIndex === 0) return true; // First page is always available
    
    const page = project.pages[pageIndex];
    if (!page.prerequisites || page.prerequisites.length === 0) {
      return true;
    }
    
    // Check if all prerequisites are completed
    return page.prerequisites.every(prereqPageId => {
      const prereqPage = project.pages.find(p => p.id === prereqPageId);
      return prereqPage && prereqPage.completed;
    });
  };

  // Get available prerequisite pages (pages that come before this page)
  const getAvailablePrerequisites = (pageIndex) => {
    return project.pages.slice(0, pageIndex).filter((page, idx) => idx !== pageIndex);
  };

  // Handle prerequisite editing
  const startEditingPrerequisites = (pageIndex) => {
    const page = project.pages[pageIndex];
    const currentPrereqs = page.prerequisites || [];
    setNewPrerequisites(currentPrereqs);
    setEditingPrerequisites(pageIndex);
  };

  const savePrerequisites = (pageIndex) => {
    const updatedPages = project.pages.map((page, idx) => {
      if (idx === pageIndex) {
        return { ...page, prerequisites: newPrerequisites };
      }
      return page;
    });

    const updatedProject = {
      ...project,
      pages: updatedPages
    };

    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }

    setEditingPrerequisites(null);
  };

  const cancelEditing = () => {
    setEditingPrerequisites(null);
  };

  const togglePrerequisite = (prereqPageId) => {
    if (newPrerequisites.includes(prereqPageId)) {
      setNewPrerequisites(newPrerequisites.filter(id => id !== prereqPageId));
    } else {
      setNewPrerequisites([...newPrerequisites, prereqPageId]);
    }
  };

  // Check if current page is completed
  const isPageCompleted = (pageIndex) => {
    const page = project.pages[pageIndex];
    return page.completed || 
           (page.content || []).some(block => 
             block.type === 'knowledge-check' && block.progress && block.progress.completed
           );
  };

  const togglePageDetails = (pageIndex) => {
    setExpandedPages(prev => ({
      ...prev,
      [pageIndex]: !prev[pageIndex]
    }));
  };

  return (
    <div className="learning-path">
      <div className="learning-path-header">
        <h3>Course Navigation</h3>
        <p>Complete each section to unlock the next</p>
      </div>
      
      <div className="learning-path-list">
        {project.pages.map((page, index) => {
          const isAvailable = isPageAvailable(index);
          const isCompleted = isPageCompleted(index);
          const isCurrent = currentPage.id === page.id;
          
          return (
            <div 
              key={page.id} 
              className={`path-item ${!isAvailable ? 'locked' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div 
                className={`path-item-header ${expandedPages[index] ? 'expanded' : ''}`}
                onClick={() => isAvailable && togglePageDetails(index)}
              >
                <div className="path-item-info">
                  <div className="path-item-status">
                    {isCompleted ? (
                      <span className="status completed">✓</span>
                    ) : isAvailable ? (
                      <span className="status available">○</span>
                    ) : (
                      <span className="status locked">●</span>
                    )}
                  </div>
                  <div className="path-item-title">
                    <span className={`title-text ${!isAvailable ? 'locked' : ''}`}>
                      {index + 1}. {page.title}
                    </span>
                    {!isAvailable && (
                      <div className="prerequisite-info">
                        Requires completion of: 
                        {page.prerequisites?.map(prereqId => {
                          const prereqPage = project.pages.find(p => p.id === prereqId);
                          return prereqPage ? prereqPage.title : '';
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                
                {isAvailable && (
                  <div className="path-item-actions">
                    <button 
                      className={`nav-button ${isCurrent ? 'current' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate && onNavigate(page);
                      }}
                      disabled={!isAvailable}
                    >
                      {isCurrent ? 'Current' : isCompleted ? 'Review' : 'Continue'}
                    </button>
                    <span className="expand-icon">
                      {expandedPages[index] ? '▲' : '▼'}
                    </span>
                  </div>
                )}
              </div>
              
              {expandedPages[index] && (
                <div className="path-item-details">
                  <div className="page-summary">
                    <h4>Page Content</h4>
                    <ul>
                      {(page.content || []).map((block, blockIndex) => (
                        <li key={blockIndex} className="content-item">
                          <span className="block-type">{block.type}</span>
                          <span className="block-content">
                            {block.question || block.content || 'Content'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="prerequisites-section">
                    <h4>Prerequisites</h4>
                    {editingPrerequisites === index ? (
                      <div className="prerequisite-editor">
                        <div className="prereq-options">
                          {getAvailablePrerequisites(index).map((prereqPage, prereqIndex) => (
                            <label key={prereqPage.id} className="prereq-option">
                              <input
                                type="checkbox"
                                checked={newPrerequisites.includes(prereqPage.id)}
                                onChange={() => togglePrerequisite(prereqPage.id)}
                              />
                              <span>{prereqIndex + 1}. {prereqPage.title}</span>
                            </label>
                          ))}
                        </div>
                        <div className="prereq-actions">
                          <button onClick={() => savePrerequisites(index)}>Save</button>
                          <button onClick={cancelEditing}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="prerequisite-list">
                        {page.prerequisites && page.prerequisites.length > 0 ? (
                          page.prerequisites.map(prereqId => {
                            const prereqPage = project.pages.find(p => p.id === prereqId);
                            return prereqPage ? (
                              <div key={prereqId} className="prereq-item">
                                {prereqPage.title}
                              </div>
                            ) : null;
                          })
                        ) : (
                          <div className="no-prereqs">No prerequisites set</div>
                        )}
                        <button 
                          className="edit-prereqs-btn"
                          onClick={() => startEditingPrerequisites(index)}
                        >
                          Edit Prerequisites
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LearningPath;