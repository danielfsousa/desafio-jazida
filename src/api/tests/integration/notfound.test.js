/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const app = require('../../../index');

describe('Error 404: Not Found', () => {
  describe('GET /does-not-exist', () => {
    it('should report 404 error when the route does not exist', () => {
      return request(app)
        .post('/does-not-exist')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Não Encontrado');
        });
    });
  });
});
