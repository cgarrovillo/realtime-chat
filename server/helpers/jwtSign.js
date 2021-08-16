const jwt = require('jsonwebtoken');

const jwtSign = id => {
  const token = jwt.sign({ id }, process.env.SESSION_SECRET, { expiresIn: 86400 });
  return token;
};


module.exports = jwtSign