const jwt = require('jsonwebtoken');

const jwtVerify = (token, callback) => {
  return jwt.verify(token, process.env.SESSION_SECRET, callback);
};


module.exports = jwtVerify