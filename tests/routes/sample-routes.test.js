const request = require('supertest');
const app = require('../../src/server');

describe('Unit testing the /sample route', () => {
  it('should return OK status', () => {
    return request(app)
      .get('/sample')
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('should return proper response object', () => {
    return request(app)
      .get('/sample')
      .then((response) => expect(response.status).toBe(200));
  });
});
