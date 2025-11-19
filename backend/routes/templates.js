/**
 * Template Routes
 * Handles all template-related API endpoints
 */

const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

// In-memory template cache
// In production, this would be stored in a database
let customTemplates = [];

/**
 * Get all available templates (including custom ones)
 * GET /api/templates
 */
router.get('/', (req, res) => {
  try {
    logger.info('Fetching all templates');

    const response = {
      success: true,
      data: {
        total: customTemplates.length,
        templates: customTemplates
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates'
    });
  }
});

/**
 * Get templates by industry/domain
 * GET /api/templates/industry/:domain
 */
router.get('/industry/:domain', (req, res) => {
  try {
    const { domain } = req.params;
    logger.info(`Fetching templates for domain: ${domain}`);

    const filtered = customTemplates.filter(t => t.category === domain);

    res.json({
      success: true,
      data: {
        domain,
        total: filtered.length,
        templates: filtered
      }
    });
  } catch (error) {
    logger.error('Error fetching templates by domain:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates for domain'
    });
  }
});

/**
 * Search templates
 * GET /api/templates/search?q=keyword
 */
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query required'
      });
    }

    logger.info(`Searching templates with query: ${q}`);

    const lowerQuery = q.toLowerCase();
    const results = customTemplates.filter(template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      (template.tags && template.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );

    res.json({
      success: true,
      data: {
        query: q,
        total: results.length,
        templates: results
      }
    });
  } catch (error) {
    logger.error('Error searching templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search templates'
    });
  }
});

/**
 * Get a specific template by ID
 * GET /api/templates/:templateId
 */
router.get('/:templateId', (req, res) => {
  try {
    const { templateId } = req.params;
    logger.info(`Fetching template: ${templateId}`);

    const template = customTemplates.find(t => t.id === templateId);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    logger.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template'
    });
  }
});

/**
 * Create a new custom template
 * POST /api/templates
 */
router.post('/', (req, res) => {
  try {
    const { name, description, category, pages, industry, tags } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Template name and description are required'
      });
    }

    const newTemplate = {
      id: `template-${Date.now()}`,
      name,
      description,
      category: category || 'custom',
      industry: industry || 'Custom',
      pages: pages || [],
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true
    };

    customTemplates.push(newTemplate);
    logger.info(`New template created: ${newTemplate.id}`);

    res.status(201).json({
      success: true,
      data: newTemplate,
      message: 'Template created successfully'
    });
  } catch (error) {
    logger.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create template'
    });
  }
});

/**
 * Update a custom template
 * PUT /api/templates/:templateId
 */
router.put('/:templateId', (req, res) => {
  try {
    const { templateId } = req.params;
    const { name, description, category, pages, industry, tags } = req.body;

    const templateIndex = customTemplates.findIndex(t => t.id === templateId);

    if (templateIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    const updatedTemplate = {
      ...customTemplates[templateIndex],
      name: name || customTemplates[templateIndex].name,
      description: description || customTemplates[templateIndex].description,
      category: category || customTemplates[templateIndex].category,
      pages: pages !== undefined ? pages : customTemplates[templateIndex].pages,
      industry: industry || customTemplates[templateIndex].industry,
      tags: tags || customTemplates[templateIndex].tags,
      updatedAt: new Date().toISOString()
    };

    customTemplates[templateIndex] = updatedTemplate;
    logger.info(`Template updated: ${templateId}`);

    res.json({
      success: true,
      data: updatedTemplate,
      message: 'Template updated successfully'
    });
  } catch (error) {
    logger.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update template'
    });
  }
});

/**
 * Delete a custom template
 * DELETE /api/templates/:templateId
 */
router.delete('/:templateId', (req, res) => {
  try {
    const { templateId } = req.params;

    const templateIndex = customTemplates.findIndex(t => t.id === templateId);

    if (templateIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    const deletedTemplate = customTemplates.splice(templateIndex, 1);
    logger.info(`Template deleted: ${templateId}`);

    res.json({
      success: true,
      message: 'Template deleted successfully',
      data: deletedTemplate[0]
    });
  } catch (error) {
    logger.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete template'
    });
  }
});

/**
 * Get template suggestions based on keywords
 * POST /api/templates/suggestions
 */
router.post('/suggestions', (req, res) => {
  try {
    const { keywords } = req.body;

    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        success: false,
        error: 'Keywords array is required'
      });
    }

    logger.info(`Getting template suggestions for keywords: ${keywords.join(', ')}`);

    const suggestions = customTemplates
      .map(template => {
        let score = 0;
        const lowerKeywords = keywords.map(k => k.toLowerCase());

        lowerKeywords.forEach(keyword => {
          if (template.name.toLowerCase().includes(keyword)) score += 3;
          if (template.description.toLowerCase().includes(keyword)) score += 2;
          if (template.tags && template.tags.some(tag => tag.toLowerCase().includes(keyword))) score += 1;
          if (template.industry && template.industry.toLowerCase().includes(keyword)) score += 1;
        });

        return { ...template, score };
      })
      .filter(t => t.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Return top 10

    res.json({
      success: true,
      data: {
        keywords,
        total: suggestions.length,
        suggestions
      }
    });
  } catch (error) {
    logger.error('Error getting template suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get template suggestions'
    });
  }
});

module.exports = router;
