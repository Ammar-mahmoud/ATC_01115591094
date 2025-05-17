/* eslint-env jest */
describe('fileFilter', () => {
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  };

  it('should allow image files', () => {
    const file = { mimetype: 'image/jpeg' };
    const cb = jest.fn();

    fileFilter({}, file, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('should reject non-image files', () => {
    const file = { mimetype: 'application/pdf' };
    const cb = jest.fn();

    fileFilter({}, file, cb);
    expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(cb.mock.calls[0][0].message).toBe('Only image files are allowed');
    expect(cb.mock.calls[0][1]).toBe(false);
  });
});
