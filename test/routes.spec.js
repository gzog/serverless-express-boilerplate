const request = require('supertest');
const { app } = require('../src/index');

describe('Route index', () => {
  test('It should return 200 OK', async () => {
    return request(app)
      .get('/')
      .expect(200);
  });
});
