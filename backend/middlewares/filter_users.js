module.exports = (req, res, next) => {
  req.filterObj = { role: 'user' };
  next();
};