import React, { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

function AnalyticsDashboard({ project, blocks }) {
  const [analyticsData, setAnalyticsData] = useState({
    totalBlocks: 0,
    assessmentCount: 0,
    completedAssessments: 0,
    avgScore: 0,
    timeSpent: 0,
    engagementMetrics: {}
  });

  // Calculate analytics when blocks change
  useEffect(() => {
    const assessmentBlocks = blocks.filter(block => block.type === 'knowledge-check');
    const completedAssessments = assessmentBlocks.filter(block => block.progress?.completed).length;
    const totalScore = assessmentBlocks
      .filter(block => block.progress?.score !== null)
      .reduce((sum, block) => sum + (block.progress?.score || 0), 0);
    
    const avgScore = assessmentBlocks.length > 0 
      ? Math.round(totalScore / assessmentBlocks.filter(block => block.progress?.score !== null).length) 
      : 0;

    setAnalyticsData({
      totalBlocks: blocks.length,
      assessmentCount: assessmentBlocks.length,
      completedAssessments,
      avgScore,
      timeSpent: 0, // This would come from actual time tracking
      engagementMetrics: {
        assessmentCompletionRate: assessmentBlocks.length > 0 
          ? Math.round((completedAssessments / assessmentBlocks.length) * 100) 
          : 0
      }
    });
  }, [blocks]);

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Learning Analytics</h2>
        <p>Track progress and performance for "{project.name}"</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="metric-card">
          <div className="metric-value">{analyticsData.totalBlocks}</div>
          <div className="metric-label">Total Content Blocks</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{analyticsData.assessmentCount}</div>
          <div className="metric-label">Assessments</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{analyticsData.completedAssessments}/{analyticsData.assessmentCount}</div>
          <div className="metric-label">Completed Assessments</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{analyticsData.avgScore}%</div>
          <div className="metric-label">Average Score</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{analyticsData.engagementMetrics.assessmentCompletionRate}%</div>
          <div className="metric-label">Assessment Completion Rate</div>
        </div>
      </div>
      
      <div className="detailed-analytics">
        <h3>Detailed Assessment Performance</h3>
        <div className="assessment-list">
          {blocks
            .filter(block => block.type === 'knowledge-check')
            .map((block, index) => (
              <div key={block.id} className="assessment-item">
                <div className="assessment-info">
                  <div className="assessment-question">
                    {block.question || `Assessment ${index + 1}`}
                  </div>
                  <div className="assessment-type">
                    {block.questionType || 'Multiple Choice'}
                  </div>
                </div>
                <div className="assessment-stats">
                  {block.progress?.completed ? (
                    <span className="status completed">
                      ✓ Completed - {block.progress.score}%
                    </span>
                  ) : (
                    <span className="status pending">○ Pending</span>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </div>
      
      <div className="recommendations">
        <h3>Learning Recommendations</h3>
        <ul>
          {analyticsData.engagementMetrics.assessmentCompletionRate < 50 && (
            <li>Consider reviewing the material before attempting assessments</li>
          )}
          {analyticsData.avgScore < 70 && (
            <li>Focus on areas where scores are below 70%</li>
          )}
          {analyticsData.assessmentCount === 0 && (
            <li>Add knowledge check assessments to evaluate learning</li>
          )}
          {analyticsData.completedAssessments > 0 && analyticsData.avgScore >= 80 && (
            <li>Great progress! Consider advancing to the next module</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;