const { expect } = require('chai');
const APIError = require('../../utils/APIError');

describe('APIError', () => {
  describe('constructor()', () => {
    it('sould return an Error', () => {
      const options = {
        message: 'message',
        errors: 'errors',
        stack: 'stack',
        status: 'status',
      };
      const error = new APIError(options);
      expect(error).to.be.an('error');
      expect(error.name).to.be.equal('APIError');
      expect(error.message).to.be.equal(options.message);
      expect(error.errors).to.be.equal(options.errors);
      expect(error.stack).to.be.equal(options.stack);
      expect(error.status).to.be.equal(options.status);
    });

    it('sould set default status to 500', () => {
      const options = {
        message: 'message',
        errors: 'errors',
        stack: 'stack',
      };
      const error = new APIError(options);
      expect(error.status).to.be.equal(500);
    });
  });
});
