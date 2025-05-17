const jwt = require('jsonwebtoken');

const createToken = (payload) =>
  jwt.sign(
    { id: payload.id, role: payload.role }, // ✅ use 'id' and include role if needed
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );

module.exports = createToken;
