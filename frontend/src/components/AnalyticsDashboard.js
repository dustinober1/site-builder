import React, { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = ({ project, blocks }) => {
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: 0,
    timeSpent: 0,
    completionRate: 0,
    assessmentScores: [],
    engagementMetrics: {},
    learnerProgress: [],
    difficultyProgression: [],
    engagementHeatmap: []
  });

  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [loading, setLoading] = useState(true);

  // Simulate loading analytics data
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock analytics data based on project
      const mockData = {
        pageViews: Math.floor(Math.random() * 1000) + 50,
        timeSpent: Math.floor(Math.random() * 200) + 30, // in minutes
        completionRate: Math.floor(Math.random() * 100),
        assessmentScores: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `Assessment ${i + 1}`,
          averageScore: Math.floor(Math.random() * 40) + 60, // 60-100%
          attempts: Math.floor(Math.random() * 50) + 10
        })),
        engagementMetrics: {
          activeLearners: Math.floor(Math.random() * 100) + 20,
          returningLearners: Math.floor(Math.random() * 50) + 5,
          averageSessionDuration: Math.floor(Math.random() * 30) + 15, // in minutes
          pagesPerSession: (Math.random() * 5 + 2).toFixed(1)
        },
        learnerProgress: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `Learner ${i + 1}`,
          progress: Math.floor(Math.random() * 100),
          timeSpent: Math.floor(Math.random() * 120),
          lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        })),
        difficultyProgression: (blocks || []).map((block, i) => ({
          id: block.id,
          label: `Block ${i + 1}`,
          difficulty: Math.random() * 10,
          dropOffRate: Math.random() * 15
        })),
        engagementHeatmap: (blocks || []).map((block, i) => ({
          id: block.id,
          label: `Block ${i + 1}`,
          engagement: Math.random() * 100
        }))
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [project, timeRange, blocks]);

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return '#28a745';
    if (rate >= 60) return '#ffc107';
    return '#dc3545';
  };

  const ChartPlaceholder = ({ title, data }) => (
    <div className="chart-container">
      <h4>{title}</h4>
      <div className="chart-placeholder">
        <div className="chart-bar" style={{ height: '60%', width: '30%' }}></div>
        <div className="chart-bar" style={{ height: '80%', width: '30%' }}></div>
        <div className="chart-bar" style={{ height: '45%', width: '30%' }}></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h3>Analytics Dashboard</h3>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="overview-metrics">
        <div className="metric-card">
          <div className="metric-value">{analyticsData.pageViews.toLocaleString()}</div>
          <div className="metric-label">Page Views</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{formatTime(analyticsData.timeSpent)}</div>
          <div className="metric-label">Total Time Spent</div>
        </div>
        <div className="metric-card">
          <div 
            className="metric-value" 
            style={{ color: getCompletionColor(analyticsData.completionRate) }}
          >
            {analyticsData.completionRate}%
          </div>
          <div className="metric-label">Completion Rate</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{analyticsData.engagementMetrics.activeLearners}</div>
          <div className="metric-label">Active Learners</div>
        </div>
      </div>

      <div className="engagement-section">
        <h4>Engagement Metrics</h4>
        <div className="engagement-grid">
          <div className="engagement-item">
            <div className="engagement-value">{analyticsData.engagementMetrics.returningLearners}</div>
            <div className="engagement-label">Returning Learners</div>
          </div>
          <div className="engagement-item">
            <div className="engagement-value">{analyticsData.engagementMetrics.averageSessionDuration}m</div>
            <div className="engagement-label">Avg. Session</div>
          </div>
          <div className="engagement-item">
            <div className="engagement-value">{analyticsData.engagementMetrics.pagesPerSession}</div>
            <div className="engagement-label">Pages/Session</div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <ChartPlaceholder title="Page Views Over Time" />
        <ChartPlaceholder title="Assessment Scores" />
      </div>

      <div className="advanced-analytics-section">
        <div className="difficulty-progression">
          <h4>Difficulty Progression Analysis</h4>
          <div className="progression-chart">
            {analyticsData.difficultyProgression.map((item, i) => (
              <div key={item.id} className="progression-bar-container">
                <div 
                  className="progression-bar" 
                  style={{ 
                    height: `${item.difficulty * 10}%`,
                    backgroundColor: item.difficulty > 7 ? '#dc3545' : item.difficulty > 4 ? '#ffc107' : '#28a745'
                  }}
                  title={`Difficulty: ${item.difficulty.toFixed(1)}`}
                ></div>
                <span className="bar-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="engagement-heatmap">
          <h4>Engagement Heatmap</h4>
          <div className="heatmap-grid">
            {analyticsData.engagementHeatmap.map((item) => (
              <div 
                key={item.id} 
                className="heatmap-cell"
                style={{ 
                  backgroundColor: `rgba(0, 123, 255, ${item.engagement / 100})`,
                  color: item.engagement > 50 ? '#fff' : '#000'
                }}
                title={`${item.label}: ${item.engagement.toFixed(1)}% engagement`}
              >
                {Math.round(item.engagement)}%
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="assessments-section">
        <h4>Assessment Performance</h4>
        <div className="assessments-list">
          {analyticsData.assessmentScores.map(assessment => (
            <div key={assessment.id} className="assessment-item">
              <div className="assessment-info">
                <div className="assessment-title">{assessment.title}</div>
                <div className="assessment-details">
                  <span>{assessment.attempts} attempts</span>
                  <span className="score" style={{ color: getCompletionColor(assessment.averageScore) }}>
                    {assessment.averageScore}%
                  </span>
                </div>
              </div>
              <div className="assessment-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${assessment.averageScore}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="learners-section">
        <h4>Learner Progress</h4>
        <div className="learners-list">
          {analyticsData.learnerProgress.map(learner => (
            <div key={learner.id} className="learner-item">
              <div className="learner-info">
                <div className="learner-name">{learner.name}</div>
                <div className="learner-details">
                  <span>{formatTime(learner.timeSpent)} spent</span>
                  <span>Active: {new Date(learner.lastActive).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="learner-progress">
                <div className="progress-text">{learner.progress}%</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${learner.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-section">
        <h4>Key Insights</h4>
        <ul>
          <li>{analyticsData.completionRate > 70 ? 'High completion rate indicates engaging content' : 'Consider improving content engagement'}</li>
          <li>Average session duration of {analyticsData.engagementMetrics.averageSessionDuration} minutes shows good learner retention</li>
          <li>{analyticsData.engagementMetrics.pagesPerSession} pages per session indicates learners are exploring thoroughly</li>
          <li>Assessment scores average {analyticsData.assessmentScores.reduce((sum, a) => sum + a.averageScore, 0) / analyticsData.assessmentScores.length}%</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;