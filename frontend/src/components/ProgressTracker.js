import React, { useState, useEffect } from 'react';
import './ProgressTracker.css';

function ProgressTracker({ project, currentPage, blocks, onBlockChange }) {
  const [progressData, setProgressData] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Initialize progress data when blocks change
  useEffect(() => {
    const initialProgress = {};
    let completedCount = 0;
    let totalCount = 0;

    blocks.forEach(block => {
      if (block.type === 'knowledge-check') {
        totalCount++;
        const blockKey = `${currentPage.id}-${block.id}`;
        if (!progressData[blockKey]) {
          initialProgress[blockKey] = {
            completed: false,
            score: null,
            attempts: 0
          };
        } else {
          initialProgress[blockKey] = progressData[blockKey];
          if (progressData[blockKey].completed) {
            completedCount++;
          }
        }
      }
    });

    // Merge with existing progress data
    const mergedProgress = { ...progressData, ...initialProgress };
    setProgressData(mergedProgress);

    // Calculate completion percentage
    if (totalCount > 0) {
      const currentCompleted = Object.values(mergedProgress).filter(item => item.completed).length;
      setCompletionPercentage(Math.round((currentCompleted / totalCount) * 100));
    } else {
      setCompletionPercentage(0);
    }
  }, [blocks, currentPage.id, progressData]);

  const handleAssessmentComplete = (blockId, score, isCorrect) => {
    const blockKey = `${currentPage.id}-${blockId}`;
    const updatedProgress = {
      ...progressData,
      [blockKey]: {
        completed: true,
        score: score,
        attempts: (progressData[blockKey]?.attempts || 0) + 1,
        lastAttempt: new Date().toISOString()
      }
    };
    
    setProgressData(updatedProgress);
    
    // Update the number of completed assessments
    const completedCount = Object.values(updatedProgress).filter(item => item.completed).length;
    const totalCount = blocks.filter(block => block.type === 'knowledge-check').length;
    setCompletionPercentage(Math.round((completedCount / totalCount) * 100));
  };

  // Update blocks with progress information
  useEffect(() => {
    if (onBlockChange) {
      const updatedBlocks = blocks.map(block => {
        if (block.type === 'knowledge-check') {
          const blockKey = `${currentPage.id}-${block.id}`;
          return {
            ...block,
            progress: progressData[blockKey] || { completed: false, score: null }
          };
        }
        return block;
      });
      
      onBlockChange(updatedBlocks);
    }
  }, [progressData, blocks, currentPage.id, onBlockChange]);

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h3>Course Progress</h3>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-text">
          {completionPercentage}% Complete
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="progress-details">
        <h4>Assessment Status</h4>
        <ul className="assessment-list">
          {blocks
            .filter(block => block.type === 'knowledge-check')
            .map(block => {
              const blockKey = `${currentPage.id}-${block.id}`;
              const progress = progressData[blockKey] || { completed: false, score: null };
              
              return (
                <li key={block.id} className={`assessment-item ${progress.completed ? 'completed' : 'pending'}`}>
                  <div className="assessment-info">
                    <span className="assessment-title">{block.question || `Assessment ${block.id}`}</span>
                    {progress.completed && progress.score !== null && (
                      <span className="assessment-score">Score: {progress.score}%</span>
                    )}
                  </div>
                  <div className="assessment-status">
                    {progress.completed ? (
                      <span className="status completed">✓ Completed</span>
                    ) : (
                      <span className="status pending">○ Pending</span>
                    )}
                  </div>
                </li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
}

export default ProgressTracker;