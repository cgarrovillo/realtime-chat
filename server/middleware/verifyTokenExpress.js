const { User } = require("../db/models");
const jwtVerify = require("../helpers/jwtVerify")

const verifyTokenExpress = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwtVerify(token, (err, decoded) => {
      if (err) {
        return next();
      }
      User.findOne({
        where: { id: decoded.id },
      }).then(user => {
        req.user = user;
        return next();
      });
    });
  } else {
    return next();
  }
};

module.exports = verifyTokenExpress
