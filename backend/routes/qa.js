/**
 * Quality Assurance Routes
 * Handles quality scores, review stages, and version branching
 */

const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const { validators } = require('../middleware/validation');

// In-memory storage for demonstration
let qualityScores = {};
let reviewStages = {};
let versionBranches = {};

/**
 * Get quality score for a project
 * GET /api/qa/score/:projectId
 */
router.get('/score/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const score = qualityScores[projectId] || {
      overall: 0,
      accessibility: 0,
      performance: 0,
      pedagogical: 0,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: score
    });
  } catch (error) {
    logger.error('Error fetching quality score:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quality score' });
  }
});

/**
 * Update quality score for a project
 * POST /api/qa/score/:projectId
 */
router.post('/score/:projectId', validators.validateQaScore, (req, res) => {
  try {
    const { projectId } = req.params;
    const { scores } = req.body;

    qualityScores[projectId] = {
      ...scores,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Quality score updated',
      data: qualityScores[projectId]
    });
  } catch (error) {
    logger.error('Error updating quality score:', error);
    res.status(500).json({ success: false, error: 'Failed to update quality score' });
  }
});

/**
 * Get review stage for a project
 * GET /api/qa/review/:projectId
 */
router.get('/review/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    const stage = reviewStages[projectId] || {
      status: 'draft',
      reviewers: [],
      comments: [],
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stage
    });
  } catch (error) {
    logger.error('Error fetching review stage:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch review stage' });
  }
});

/**
 * Update review stage
 * POST /api/qa/review/:projectId
 */
router.post('/review/:projectId', validators.validateReviewStage, (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, reviewer, comment } = req.body;

    if (!reviewStages[projectId]) {
      reviewStages[projectId] = { status: 'draft', reviewers: [], comments: [], updatedAt: new Date().toISOString() };
    }

    if (status) reviewStages[projectId].status = status;
    if (reviewer && !reviewStages[projectId].reviewers.includes(reviewer)) {
      reviewStages[projectId].reviewers.push(reviewer);
    }
    if (comment) {
      reviewStages[projectId].comments.push({
        reviewer,
        text: comment,
        timestamp: new Date().toISOString()
      });
    }
    reviewStages[projectId].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: reviewStages[projectId]
    });
  } catch (error) {
    logger.error('Error updating review stage:', error);
    res.status(500).json({ success: false, error: 'Failed to update review stage' });
  }
});

/**
 * Create a version branch
 * POST /api/qa/branch/:projectId
 */
router.post('/branch/:projectId', validators.validateBranch, (req, res) => {
  try {
    const { projectId } = req.params;
    const { branchName, sourceVersion } = req.body;

    if (!versionBranches[projectId]) {
      versionBranches[projectId] = [];
    }

    const newBranch = {
      id: `branch-${Date.now()}`,
      name: branchName,
      sourceVersion,
      createdAt: new Date().toISOString()
    };

    versionBranches[projectId].push(newBranch);

    res.status(201).json({
      success: true,
      data: newBranch
    });
  } catch (error) {
    logger.error('Error creating branch:', error);
    res.status(500).json({ success: false, error: 'Failed to create branch' });
  }
});

/**
 * Get branches for a project
 * GET /api/qa/branches/:projectId
 */
router.get('/branches/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    res.json({
      success: true,
      data: versionBranches[projectId] || []
    });
  } catch (error) {
    logger.error('Error fetching branches:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch branches' });
  }
});

module.exports = router;
