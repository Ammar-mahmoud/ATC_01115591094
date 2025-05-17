/* eslint-env jest */
const { allowedTo } = require('../services/authService');
const ApiError = require('../utils/api_error');

describe('allowedTo Middleware', () => {
  const getMockReq = (role) => ({
    user: { role }
  });

  const getMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should call next() if user role is allowed', () => {
    const req = getMockReq('admin');
    const res = getMockRes();
    const next = jest.fn();

    allowedTo('admin', 'user')(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return ApiError if user role is not allowed', () => {
    const req = getMockReq('viewer');
    const res = getMockRes();
    const next = jest.fn();

    allowedTo('admin', 'coach')(req, res, next);

    const errorArg = next.mock.calls[0][0];

    expect(errorArg).toBeInstanceOf(ApiError);
    expect(errorArg.message).toBe('Forbidden: Access denied');
    expect(errorArg.statusCode).toBe(403);
  });
});
