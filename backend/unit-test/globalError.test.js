/* eslint-env jest */
const globalError = require('../middlewares/error_middleware');
const ApiError = require('../utils/api_error');

describe('Global Error Handler', () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should send full error in development mode', () => {
    process.env.NODE_ENV = 'development';

    const err = new ApiError('Test Error', 400);
    const res = mockRes();

    globalError(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      error: err,
      message: 'Test Error',
    });
  });

  it('should handle JWT error in production mode', () => {
    process.env.NODE_ENV = 'production';

    const jwtError = new Error('jwt malformed');
    jwtError.name = 'JsonWebTokenError';
    const res = mockRes();

    globalError(jwtError, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid token, please login again..',
    });
  });
});
