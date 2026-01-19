/**
 * A/B Testing Framework for Course Variants
 */

export class ABTestingManager {
  constructor(projectId) {
    this.projectId = projectId;
    this.variants = [];
    this.activeTest = null;
  }

  createTest(name, variantA, variantB) {
    this.activeTest = {
      id: `test_${Date.now()}`,
      name,
      variants: [
        { id: 'A', data: variantA, metrics: { completions: 0, avgTime: 0, score: 0 } },
        { id: 'B', data: variantB, metrics: { completions: 0, avgTime: 0, score: 0 } }
      ],
      startDate: new Date().toISOString(),
      status: 'active'
    };
    this.saveTest();
    return this.activeTest;
  }

  trackPerformance(variantId, learnerData) {
    if (!this.activeTest) return;

    const variant = this.activeTest.variants.find(v => v.id === variantId);
    if (variant) {
      variant.metrics.completions++;
      // Rolling average for time and score
      variant.metrics.avgTime = (variant.metrics.avgTime * (variant.metrics.completions - 1) + learnerData.timeSpent) / variant.metrics.completions;
      variant.metrics.score = (variant.metrics.score * (variant.metrics.completions - 1) + learnerData.assessmentScore) / variant.metrics.completions;
      
      this.saveTest();
    }
  }

  getResults() {
    if (!this.activeTest) return null;
    
    const [a, b] = this.activeTest.variants;
    return {
      testName: this.activeTest.name,
      winner: a.metrics.score > b.metrics.score ? 'A' : 'B',
      improvement: Math.abs(((b.metrics.score - a.metrics.score) / (a.metrics.score || 1)) * 100).toFixed(2) + '%',
      variants: this.activeTest.variants
    };
  }

  saveTest() {
    const tests = JSON.parse(localStorage.getItem('ab_tests') || '{}');
    tests[this.projectId] = this.activeTest;
    localStorage.setItem('ab_tests', JSON.stringify(tests));
  }

  loadTest() {
    const tests = JSON.parse(localStorage.getItem('ab_tests') || '{}');
    this.activeTest = tests[this.projectId] || null;
    return this.activeTest;
  }
}
