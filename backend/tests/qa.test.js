const request = require('supertest');
const express = require('express');
const qaRoutes = require('../routes/qa');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use('/api/qa', qaRoutes);

describe('QA API Endpoints', () => {
  const projectId = 'test-project-123';

  describe('GET /api/qa/score/:projectId', () => {
    it('should return default scores for a new project', async () => {
      const res = await request(app).get(`/api/qa/score/${projectId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.overall).toBe(0);
    });
  });

  describe('POST /api/qa/score/:projectId', () => {
    it('should update quality scores', async () => {
      const scores = {
        overall: 85,
        accessibility: 90,
        performance: 80,
        pedagogical: 85
      };
      const res = await request(app)
        .post(`/api/qa/score/${projectId}`)
        .send({ scores });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.overall).toBe(85);
    });

    it('should fail validation with invalid scores', async () => {
      const res = await request(app)
        .post(`/api/qa/score/${projectId}`)
        .send({ scores: { overall: 150 } }); // Invalid score > 100
      
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('Review Stages', () => {
    it('should update review status', async () => {
      const res = await request(app)
        .post(`/api/qa/review/${projectId}`)
        .send({ status: 'in-review', reviewer: 'John Doe', comment: 'Looks good' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toBe('in-review');
      expect(res.body.data.reviewers).toContain('John Doe');
    });
  });
});
