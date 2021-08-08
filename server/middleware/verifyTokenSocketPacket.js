const onlineUsers = require("../util/onlineUsers")
const jwtVerify = require("../helpers/jwtVerify")

// called on every packet receive
const verifyTokenSocketPacket = (socket, next) => {
  const token = socket.handshake.auth["token"];
  if (token) {
    jwtVerify(token, (err, decoded) => {
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

module.exports = verifyTokenSocketPacket
