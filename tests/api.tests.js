const request = require('supertest');

const BASE_URL = process.env.API_URL || 'http://localhost:4200';

describe('API Tests', () => {
  describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(BASE_URL)
        .get('/api/health')
        .expect(500);//Modifié pour testé l'échec

      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('should return uptime field', async () => {
      const response = await request(BASE_URL)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return ai_connection field', async () => {
      const response = await request(BASE_URL)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('ai_connection');
      expect(typeof response.body.ai_connection).toBe('boolean');
    });
  });

  describe('POST /api/generate-lorem', () => {
    it('should return 400 with empty theme', async () => {
      const response = await request(BASE_URL)
        .post('/api/generate-lorem')
        .send({ 
          theme: '',
          paragraphs: 1,
          paragraphLength: 'moyen',
          stream: false
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });

    it('should return 400 without theme', async () => {
      const response = await request(BASE_URL)
        .post('/api/generate-lorem')
        .send({
          paragraphs: 1,
          paragraphLength: 'moyen',
          stream: false
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });

    it('should respect paragraphLength parameter - court vs long', async () => {
      // Test avec paragraphe court
      const shortResponse = await request(BASE_URL)
        .post('/api/generate-lorem')
        .send({ 
          theme: 'technology',
          paragraphs: 1,
          paragraphLength: 'court',
          stream: false
        })
        .expect(200);

      expect(shortResponse.body).toHaveProperty('text');
      expect(shortResponse.body.success).toBe(true);

      // Test avec paragraphe long
      const longResponse = await request(BASE_URL)
        .post('/api/generate-lorem')
        .send({ 
          theme: 'technology',
          paragraphs: 1,
          paragraphLength: 'long',
          stream: false
        })
        .expect(200);

      expect(longResponse.body).toHaveProperty('text');
      expect(longResponse.body.success).toBe(true);

      // Le texte long devrait être plus long que le texte court
      expect(longResponse.body.text.length).toBeGreaterThan(shortResponse.body.text.length);
    });

    it('should generate text with different paragraph counts', async () => {
      const threeParagraphs = await request(BASE_URL)
        .post('/api/generate-lorem')
        .send({ 
          theme: 'science',
          paragraphs: 3,
          paragraphLength: 'moyen',
          stream: false
        })
        .expect(200);

      expect(threeParagraphs.body.success).toBe(true);
      expect(threeParagraphs.body).toHaveProperty('text');
      expect(typeof threeParagraphs.body.text).toBe('string');
      expect(threeParagraphs.body.text.length).toBeGreaterThan(0);
    }, 45000); // Timeout de 45 secondes pour ce test

    it('should return text when valid parameters are provided', async () => {
      const response = await request(BASE_URL)
        .post('/api/generate-lorem')
        .send({ 
          theme: 'technology',
          paragraphs: 2,
          paragraphLength: 'moyen',
          stream: false
        })
        .expect(200);

      expect(response.body).toHaveProperty('text');
      expect(response.body).toHaveProperty('success', true);
      expect(typeof response.body.text).toBe('string');
      expect(response.body.text.length).toBeGreaterThan(0);
    });

    it('should return 400 with invalid paragraphLength', async () => {
      const response = await request(BASE_URL)
        .post('/api/generate-lorem')
        .send({ 
          theme: 'technology',
          paragraphs: 1,
          paragraphLength: 'invalid',
          stream: false
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });

    it('should return 400 with invalid paragraphs count', async () => {
      const response = await request(BASE_URL)
        .post('/api/generate-lorem')
        .send({ 
          theme: 'technology',
          paragraphs: 0,
          paragraphLength: 'moyen',
          stream: false
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });
  });
});
