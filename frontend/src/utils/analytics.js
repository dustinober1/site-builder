/**
 * Analytics Utility
 * Handles tracking for feature adoption, quality improvements, and user satisfaction (NPS).
 */

const ANALYTICS_STORAGE_KEY = 'site-builder-analytics';

/**
 * Tracks a custom event.
 * @param {string} eventName - Name of the event (e.g., 'feature_used').
 * @param {Object} properties - Additional data for the event.
 */
export const trackEvent = (eventName, properties = {}) => {
  const timestamp = new Date().toISOString();
  const event = { eventName, properties, timestamp };

  // Log to console for development
  console.log(`[Analytics] ${eventName}:`, properties);

  // Persist to localStorage
  try {
    const existingData = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '[]');
    existingData.push(event);
    // Keep only last 1000 events to prevent storage bloat
    const trimmedData = existingData.slice(-1000);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(trimmedData));
  } catch (e) {
    console.error('Failed to save analytics event:', e);
  }
};

/**
 * Specifically tracks adoption of new features.
 * @param {string} featureName - Name of the feature (e.g., 'Learning Flow Analyzer').
 */
export const trackFeatureAdoption = (featureName) => {
  trackEvent('feature_adoption', { featureName });
};

/**
 * Tracks quality improvements over time.
 * @param {string} projectId - The ID of the project.
 * @param {number} score - The quality score.
 * @param {string} metricType - The type of metric (e.g., 'accessibility', 'readability').
 */
export const trackQualityImprovement = (projectId, score, metricType) => {
  trackEvent('quality_improvement', { projectId, score, metricType });
};

/**
 * Records Net Promoter Score (NPS) or user satisfaction.
 * @param {number} score - Satisfaction score (0-10).
 * @param {string} feedback - Optional text feedback.
 */
export const recordUserSatisfaction = (score, feedback = '') => {
  trackEvent('user_satisfaction_nps', { score, feedback });
};

/**
 * Retrieves all tracked analytics data.
 * @returns {Array} List of tracked events.
 */
export const getAnalyticsData = () => {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * Clears all analytics data.
 */
export const clearAnalyticsData = () => {
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
};
