const request = require('supertest');
const app = require('../src/server');

describe('Unit testing the server', () => {
  it('should return "pong" for /ping route', () => {
    return request(app)
      .get('/ping')
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.text).toBe('pong');
      });
  });

  it('should return html for /server-info route', () => {
    return request(app)
      .get('/server-info')
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });

  it('should return 404 status for invalid route', function () {
    return request(app)
      .get('/dummy')
      .then((response) => {
        const textResponse = JSON.parse(response.text);
        expect(textResponse.message).toBe('Route not found for the URL: /dummy');
        expect(response.status).toBe(404);
      });
  });

  it('should return 500 status for errors in route', function () {
    return request(app)
      .get('/error')
      .then((response) => {
        const textResponse = JSON.parse(response.text);
        expect(textResponse.message).toBe('Some error');
        expect(response.status).toBe(500);
      });
  });

  it('should return 500 status for errors in route', function () {
    return request(app)
      .get('/sample')
      .set('x-no-compression', true)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});
