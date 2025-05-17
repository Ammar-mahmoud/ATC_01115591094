/* global jest, describe, it, expect */
const { validationResult } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('validatorMiddleware', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  it('should call next if no errors', () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    validatorMiddleware({}, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation errors exist', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Invalid input' }],
    });

    validatorMiddleware({}, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Invalid input' }],
    });
  });
});
