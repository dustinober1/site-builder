/**
 * Quality Metrics Utility
 * Calculates automated quality scores for course content
 */

export const calculateQualityMetrics = (projectData) => {
  const metrics = {
    altTextCoverage: 0,
    readabilityScore: 0,
    accessibilityScore: 0,
    overallScore: 0,
    details: {
      missingAltText: [],
      lowReadabilityBlocks: [],
      accessibilityIssues: []
    }
  };

  if (!projectData || !projectData.pages) return metrics;

  let totalMediaBlocks = 0;
  let mediaWithAltText = 0;
  let totalTextLength = 0;
  let totalSentences = 0;
  let totalSyllables = 0;
  let totalBlocks = 0;

  projectData.pages.forEach(page => {
    page.blocks.forEach(block => {
      totalBlocks++;
      
      // Alt-text coverage
      if (block.type === 'image' || block.type === 'video') {
        totalMediaBlocks++;
        if (block.content && block.content.altText && block.content.altText.trim().length > 0) {
          mediaWithAltText++;
        } else {
          metrics.details.missingAltText.push({ pageId: page.id, blockId: block.id });
        }
      }

      // Readability (Flesch-Kincaid simplified)
      if (block.type === 'text' && block.content && block.content.text) {
        const text = block.content.text;
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.length > 0);
        
        totalTextLength += words.length;
        totalSentences += sentences.length;
        // Rough syllable estimation
        totalSyllables += words.reduce((acc, word) => acc + (word.match(/[aeiouy]{1,2}/g) || []).length, 0);

        if (words.length > 0 && sentences.length > 0) {
          const blockReadability = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (totalSyllables / words.length);
          if (blockReadability < 50) {
            metrics.details.lowReadabilityBlocks.push({ pageId: page.id, blockId: block.id, score: blockReadability });
          }
        }
      }

      // Accessibility checks
      if (block.type === 'interactive' && (!block.content.ariaLabel || block.content.ariaLabel === '')) {
        metrics.details.accessibilityIssues.push({ 
          pageId: page.id, 
          blockId: block.id, 
          issue: 'Missing ARIA label on interactive element' 
        });
      }
    });
  });

  // Final calculations
  metrics.altTextCoverage = totalMediaBlocks > 0 ? (mediaWithAltText / totalMediaBlocks) * 100 : 100;
  
  if (totalTextLength > 0 && totalSentences > 0) {
    metrics.readabilityScore = Math.max(0, Math.min(100, 206.835 - 1.015 * (totalTextLength / totalSentences) - 84.6 * (totalSyllables / totalTextLength)));
  } else {
    metrics.readabilityScore = 100;
  }

  const accessibilityDeductions = metrics.details.accessibilityIssues.length * 5;
  metrics.accessibilityScore = Math.max(0, 100 - accessibilityDeductions);

  metrics.overallScore = (metrics.altTextCoverage + metrics.readabilityScore + metrics.accessibilityScore) / 3;

  return metrics;
};
