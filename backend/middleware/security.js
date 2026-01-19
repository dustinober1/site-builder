const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const csrf = require('csurf');
const logger = require('../config/logger');

// Security middleware configuration
const securityMiddleware = {
  // CSRF Protection
  csrfProtection: csrf({ cookie: true }),

  // Helmet configuration for security headers
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        manifestSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  // Rate limiting configuration
  createRateLimiter: (options = {}) => {
    return rateLimit({
      windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes default
      max: options.max || 100, // Limit each IP to 100 requests per windowMs
      message: {
        success: false,
        error: {
          message: 'Too many requests from this IP, please try again later.',
          retryAfter: Math.ceil((options.windowMs || 15 * 60 * 1000) / 1000)
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logger.security('Rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.originalUrl,
          method: req.method
        });
        
        res.status(429).json({
          success: false,
          error: {
            message: 'Too many requests from this IP, please try again later.',
            retryAfter: Math.ceil((options.windowMs || 15 * 60 * 1000) / 1000)
          }
        });
      }
    });
  },

  // Specific rate limiters for different endpoints
  rateLimiters: {
    // General API rate limiter
    general: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per 15 minutes
      message: {
        success: false,
        error: {
          message: 'Too many requests, please try again later.'
        }
      }
    }),

    // Strict rate limiter for file uploads
    upload: rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20, // 20 uploads per hour
      message: {
        success: false,
        error: {
          message: 'Too many file uploads, please try again later.',
          limit: '20 uploads per hour'
        }
      }
    }),

    // Strict rate limiter for site generation
    generate: rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 5, // 5 generations per 10 minutes
      message: {
        success: false,
        error: {
          message: 'Too many site generations, please try again later.',
          limit: '5 generations per 10 minutes'
        }
      }
    }),

    // Very strict rate limiter for authentication attempts (if implemented)
    auth: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per 15 minutes
      skipSuccessfulRequests: true,
      message: {
        success: false,
        error: {
          message: 'Too many authentication attempts, please try again later.',
          limit: '5 attempts per 15 minutes'
        }
      }
    })
  },

  // Input sanitization middleware
  sanitizeInput: (req, res, next) => {
    // Sanitize query parameters
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim().replace(/[<>]/g, '');
      }
    }

    // Sanitize path parameters
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key].trim().replace(/[<>]/g, '');
      }
    }

    next();
  },

  // File upload security middleware
  fileUploadSecurity: (req, res, next) => {
    // Check for suspicious file patterns
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.pif$/i,
      /\.com$/i,
      /\.js$/i,
      /\.vbs$/i,
      /\.jar$/i,
      /\.app$/i,
      /\.deb$/i,
      /\.rpm$/i,
      /\.dmg$/i,
      /\.pkg$/i,
      /\.msi$/i
    ];

    if (req.file) {
      const filename = req.file.originalname;
      
      // Check for suspicious file extensions
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(filename)) {
          logger.security('Suspicious file upload attempt blocked', {
            filename,
            mimetype: req.file.mimetype,
            ip: req.ip,
            userAgent: req.get('User-Agent')
          });

          return res.status(400).json({
            success: false,
            error: {
              message: 'File type not allowed for security reasons'
            }
          });
        }
      }

      // Check for double extensions (e.g., image.jpg.exe)
      const parts = filename.split('.');
      if (parts.length > 2) {
        logger.security('Double extension file upload attempt blocked', {
          filename,
          ip: req.ip
        });

        return res.status(400).json({
          success: false,
          error: {
            message: 'Files with multiple extensions are not allowed'
          }
        });
      }
    }

    next();
  },

  // Request size limiter
  requestSizeLimiter: (maxSize = '10mb') => {
    return (req, res, next) => {
      const contentLength = req.get('content-length');
      
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength);
        const maxSizeInBytes = parseSize(maxSize);
        
        if (sizeInBytes > maxSizeInBytes) {
          logger.security('Request size limit exceeded', {
            contentLength: sizeInBytes,
            maxSize: maxSizeInBytes,
            ip: req.ip,
            url: req.originalUrl
          });

          return res.status(413).json({
            success: false,
            error: {
              message: `Request entity too large. Maximum size is ${maxSize}`
            }
          });
        }
      }
      
      next();
    };
  },

  // IP whitelist/blacklist middleware
  ipFilter: (options = {}) => {
    const whitelist = options.whitelist || [];
    const blacklist = options.blacklist || [];

    return (req, res, next) => {
      const clientIP = req.ip || req.connection.remoteAddress;
      
      // Check blacklist first
      if (blacklist.includes(clientIP)) {
        logger.security('Blacklisted IP access attempt blocked', {
          ip: clientIP,
          url: req.originalUrl,
          userAgent: req.get('User-Agent')
        });

        return res.status(403).json({
          success: false,
          error: {
            message: 'Access denied'
          }
        });
      }

      // Check whitelist if it's not empty
      if (whitelist.length > 0 && !whitelist.includes(clientIP)) {
        logger.security('Non-whitelisted IP access attempt blocked', {
          ip: clientIP,
          url: req.originalUrl,
          userAgent: req.get('User-Agent')
        });

        return res.status(403).json({
          success: false,
          error: {
            message: 'Access denied'
          }
        });
      }

      next();
    };
  }
};

// Helper function to parse size strings (e.g., '10mb' -> bytes)
function parseSize(size) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };

  const match = size.toLowerCase().match(/^(\d+)(b|kb|mb|gb)$/);
  if (!match) {
    throw new Error('Invalid size format');
  }

  const [, value, unit] = match;
  return parseInt(value) * units[unit];
}

module.exports = securityMiddleware;
