/**
 * Pedagogical Analysis Utility
 * Provides functions for content flow analysis, gap detection, and objective alignment.
 */

/**
 * Analyzes the flow of content blocks to ensure logical progression.
 * @param {Array} blocks - The list of content blocks in the course.
 * @returns {Object} Analysis results including flow score and suggestions.
 */
export const analyzeContentFlow = (blocks) => {
  if (!blocks || blocks.length === 0) {
    return { score: 0, issues: ['No content blocks found.'] };
  }

  const issues = [];
  let score = 100;

  // Check for introductory content
  const hasIntro = blocks.some(b => 
    b.type === 'text' && (b.content?.toLowerCase().includes('introduction') || b.content?.toLowerCase().includes('welcome'))
  );
  if (!hasIntro) {
    issues.push('Missing introductory content.');
    score -= 15;
  }

  // Check for assessment at the end
  const lastBlock = blocks[blocks.length - 1];
  if (lastBlock.type !== 'assessment' && lastBlock.type !== 'knowledgeCheck') {
    issues.push('Course does not end with an assessment or knowledge check.');
    score -= 10;
  }

  // Check for density (too much text without interaction)
  let consecutiveTextBlocks = 0;
  blocks.forEach(block => {
    if (block.type === 'text') {
      consecutiveTextBlocks++;
      if (consecutiveTextBlocks > 3) {
        issues.push('High cognitive load: Too many consecutive text blocks without interaction.');
        score -= 5;
        consecutiveTextBlocks = 0; // Reset to avoid multiple penalties for same stretch
      }
    } else {
      consecutiveTextBlocks = 0;
    }
  });

  return {
    score: Math.max(0, score),
    issues,
    timestamp: new Date().toISOString()
  };
};

/**
 * Detects gaps in the learning material based on defined objectives.
 * @param {Array} blocks - The list of content blocks.
 * @param {Array} objectives - The list of learning objectives.
 * @returns {Array} List of detected gaps.
 */
export const detectLearningGaps = (blocks, objectives) => {
  if (!objectives || objectives.length === 0) return ['No learning objectives defined.'];
  
  const gaps = [];
  const coveredObjectives = new Set();

  blocks.forEach(block => {
    if (block.metadata?.linkedObjectives) {
      block.metadata.linkedObjectives.forEach(objId => coveredObjectives.add(objId));
    }
  });

  objectives.forEach(obj => {
    if (!coveredObjectives.has(obj.id)) {
      gaps.push(`Objective "${obj.title}" is not covered by any content block.`);
    }
  });

  return gaps;
};

/**
 * Maps content blocks to learning objectives and calculates alignment.
 * @param {Array} blocks - The list of content blocks.
 * @param {Array} objectives - The list of learning objectives.
 * @returns {Object} Alignment mapping and statistics.
 */
export const mapObjectivesAlignment = (blocks, objectives) => {
  const mapping = objectives.map(obj => {
    const linkedBlocks = blocks.filter(b => b.metadata?.linkedObjectives?.includes(obj.id));
    return {
      objectiveId: obj.id,
      objectiveTitle: obj.title,
      blockCount: linkedBlocks.length,
      isCovered: linkedBlocks.length > 0,
      isAssessed: linkedBlocks.some(b => b.type === 'assessment' || b.type === 'knowledgeCheck')
    };
  });

  const coverage = (mapping.filter(m => m.isCovered).length / objectives.length) * 100;

  return {
    mapping,
    coverage: isNaN(coverage) ? 0 : coverage,
    unmappedBlocks: blocks.filter(b => !b.metadata?.linkedObjectives || b.metadata.linkedObjectives.length === 0).length
  };
};
