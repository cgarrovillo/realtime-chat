const onlineUsers = require("../util/onlineUsers")
const { User } = require("../db/models");
const jwtVerify = require("../helpers/jwtVerify")

// called once on a new socket connection
const verifyTokenSocket = (socket, next) => {
  const token = socket.handshake.auth["token"]
  if (token) {
    jwtVerify(token, (err, decoded) => {
      if (err) {
        return next(new Error("Unauthorized"))
      }

      User.findOne({
        where: { id: decoded.id },
      }).then(user => {
        // keep track of multiple connections; multiple browser-tabs of the user
        let otherConnections = [];
        if (onlineUsers.has(user.id)) {
          otherConnections = onlineUsers.get(user.id);
        }

        otherConnections.push(socket.id);
        onlineUsers.set(user.id, otherConnections);
        socket.userId = user.id

        // send the id of user who just went online to everyone else who is already online
        socket.broadcast.emit('add-online-user', user.id);
        return next()
      });
    })
  }
  else {
    return next(new Error("Unauthorized"))
  }
};

module.exports = verifyTokenSocket
