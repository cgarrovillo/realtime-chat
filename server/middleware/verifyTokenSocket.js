const jwt = require("jsonwebtoken");
const onlineUsers = require("../util/onlineUsers")

const verifyTokenSocket = (socket, next) => {
  const token = socket.handshake.auth["token"];
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next();
      }
      
      if (onlineUsers.has(decoded.id)) return next()
      else return next(new Error("Unauthorized"))
    })
  } else {
    console.error("Unauthorized WS")
    return next(new Error("Unauthorized"));
  }
};

module.exports = verifyTokenSocket
