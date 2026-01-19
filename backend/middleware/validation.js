const Joi = require('joi');
const logger = require('../config/logger');

// Common validation schemas
const schemas = {
  projectName: Joi.string().min(1).max(100).required().trim(),
  pageId: Joi.number().integer().positive().required(),
  pageSlug: Joi.string().min(1).max(100).pattern(/^[a-z0-9-]+$/).required(),
  contentBlock: Joi.object({
    id: Joi.number().integer().positive().required(),
    type: Joi.string().valid('text', 'heading', 'image', 'video', 'knowledge-check', 'drag-and-drop', 'hotspot').required(),
    content: Joi.string().allow(''),
    alt: Joi.string().allow(''),
    title: Joi.string().allow(''),
    url: Joi.string().uri().allow('')
  }),
  
  // Assessment validation schemas
  assessmentBlock: Joi.object({
    id: Joi.number().integer().positive().required(),
    type: Joi.string().valid('knowledge-check').required(),
    question: Joi.string().min(1).max(500).required(),
    questionType: Joi.string().valid('multiple-choice', 'true-false', 'fill-in-the-blank', 'matching').required(),
    options: Joi.when('questionType', {
      is: 'multiple-choice',
      then: Joi.array().items(Joi.string().min(1)).min(2).max(6).required(),
      otherwise: Joi.when('questionType', {
        is: 'matching',
        then: Joi.array().items(Joi.string().min(1)).min(2).required(),
        otherwise: Joi.optional()
      })
    }),
    correctAnswer: Joi.when('questionType', {
      is: 'fill-in-the-blank',
      then: Joi.string().min(1).required(),
      otherwise: Joi.when('questionType', {
        is: 'matching',
        then: Joi.array().items(Joi.number().integer().min(0)).required(),
        otherwise: Joi.number().integer().min(0).required()
      })
    }),
    feedback: Joi.string().allow('').max(500),
    correctFeedback: Joi.string().allow('').max(200),
    incorrectFeedback: Joi.string().allow('').max(200)
  }),
  
  // Page validation schema
  page: Joi.object({
    id: Joi.number().integer().positive().required(),
    title: Joi.string().min(1).max(200).required().trim(),
    slug: Joi.string().min(1).max(100).pattern(/^[a-z0-9-]+$/).required(),
    content: Joi.array().items(Joi.alternatives().try(
      schemas.contentBlock,
      schemas.assessmentBlock
    )).default([])
  }),
  
  // Project validation schema
  project: Joi.object({
    projectName: schemas.projectName,
    pages: Joi.array().items(schemas.page).min(1).required(),
    theme: Joi.string().valid('default', 'mobile-optimized', 'accessibility-friendly', 'dark-mode').default('default'),
    mobileOptimized: Joi.boolean().default(false),
    fontSize: Joi.number().integer().min(12).max(24).default(16),
    customColors: Joi.object({
      primary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
      secondary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
      accent: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
      background: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
      text: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/)
    }).optional()
  }),

  // QA Validation schemas
  qaScore: Joi.object({
    scores: Joi.object({
      overall: Joi.number().min(0).max(100).required(),
      accessibility: Joi.number().min(0).max(100).required(),
      performance: Joi.number().min(0).max(100).required(),
      pedagogical: Joi.number().min(0).max(100).required()
    }).required()
  }),

  reviewStage: Joi.object({
    status: Joi.string().valid('draft', 'in-review', 'approved', 'rejected').optional(),
    reviewer: Joi.string().min(1).optional(),
    comment: Joi.string().min(1).optional()
  }),

  branch: Joi.object({
    branchName: Joi.string().min(1).max(50).required(),
    sourceVersion: Joi.string().required()
  })
};

// Validation middleware factory
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });
    
    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));
      
      logger.warn('Validation failed', {
        url: req.originalUrl,
        method: req.method,
        validationErrors: details,
        ip: req.ip
      });
      
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: details
        }
      });
    }
    
    // Replace the original data with validated and sanitized data
    if (source === 'body') {
      req.body = value;
    } else if (source === 'query') {
      req.query = value;
    } else {
      req.params = value;
    }
    
    next();
  };
};

// Custom validation functions
const validators = {
  validateProject: validate(schemas.project),
  validatePage: validate(schemas.page),
  validateContentBlock: validate(schemas.contentBlock),
  validateAssessmentBlock: validate(schemas.assessmentBlock),
  validateProjectName: validate(Joi.object({ projectName: schemas.projectName })),
  
  // QA Validators
  validateQaScore: validate(schemas.qaScore),
  validateReviewStage: validate(schemas.reviewStage),
  validateBranch: validate(schemas.branch),
  
  // File upload validation
  validateImageUpload: (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No file uploaded',
          hint: 'Please select an image file to upload'
        }
      });
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      logger.security('Invalid file type upload attempt', {
        mimetype: req.file.mimetype,
        filename: req.file.filename,
        ip: req.ip
      });
      
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid file type',
          allowedTypes: allowedTypes.join(', ')
        }
      });
    }
    
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'File too large',
          maxSize: '10MB'
        }
      });
    }
    
    next();
  },
  
  validateVideoUpload: (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No file uploaded',
          hint: 'Please select a video file to upload'
        }
      });
    }
    
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      logger.security('Invalid file type upload attempt', {
        mimetype: req.file.mimetype,
        filename: req.file.filename,
        ip: req.ip
      });
      
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid file type',
          allowedTypes: allowedTypes.join(', ')
        }
      });
    }
    
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'File too large',
          maxSize: '50MB'
        }
      });
    }
    
    next();
  }
};

module.exports = {
  schemas,
  validate,
  validators
};
