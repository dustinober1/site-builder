/**
 * Learner Simulator for predicting outcomes based on personas.
 */

export const PERSONAS = {
  FAST: {
    name: 'Fast Learner',
    speedMultiplier: 0.5, // Completes in 50% of time
    accuracyBase: 0.95,
    engagementDecay: 0.05
  },
  TYPICAL: {
    name: 'Typical Learner',
    speedMultiplier: 1.0,
    accuracyBase: 0.8,
    engagementDecay: 0.02
  },
  STRUGGLING: {
    name: 'Struggling Learner',
    speedMultiplier: 1.5,
    accuracyBase: 0.6,
    engagementDecay: 0.1
  }
};

/**
 * Simulates a learner's journey through a course.
 * @param {Array} blocks - The course content blocks.
 * @param {Object} persona - The learner persona from PERSONAS.
 * @returns {Object} Simulation results.
 */
export const simulateLearner = (blocks, persona) => {
  let totalTime = 0;
  let totalScore = 0;
  let assessmentCount = 0;
  let currentEngagement = 1.0;
  const path = [];

  blocks.forEach((block, index) => {
    // Base time for a block (mocked if not present)
    const baseTime = block.estimatedTime || 300; // 5 mins default
    const timeSpent = baseTime * persona.speedMultiplier;
    
    totalTime += timeSpent;
    
    // Engagement decay over time
    currentEngagement = Math.max(0.1, currentEngagement - persona.engagementDecay);

    let blockResult = {
      id: block.id,
      type: block.type,
      timeSpent,
      engagement: currentEngagement
    };

    if (block.type === 'assessment' || block.type === 'knowledgeCheck') {
      const score = Math.random() < persona.accuracyBase ? 100 : 60;
      totalScore += score;
      assessmentCount++;
      blockResult.score = score;
    }

    path.push(blockResult);
  });

  return {
    persona: persona.name,
    totalTime,
    averageScore: assessmentCount > 0 ? totalScore / assessmentCount : 100,
    finalEngagement: currentEngagement,
    path
  };
};
