const jwt = require("jsonwebtoken");
const onlineUsers = require("./onlineUsers");
const { User } = require("../db/models");
const verifyTokenSocket = require('../middleware/verifyTokenSocket');

const attachListeners = socket => {

  // on every new socket connection
  let socketUserId
  const socketToken = socket.handshake.auth["token"]
  if (socketToken) {
    jwt.verify(socketToken, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return socket.disconnect()
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
        socketUserId = user.id
        // send the user who just went online to everyone else who is already online
        socket.broadcast.emit('add-online-user', user.id);
      });
    })
  }
  else {
    socket.disconnect()
  }

  // per-packet middleware
  socket.use((event, next) => verifyTokenSocket(socket, next))

  socket.on('new-message', data => {
    const recipientSocketIds = onlineUsers.get(data.recipientId);
    if (recipientSocketIds) {
      // .to() takes in arrays as of socket.io 4.x
      socket.to(recipientSocketIds).emit('new-message', {
        message: data.message,
        sender: data.sender,
      });
    }
  });

  socket.on('disconnect', () => {
    if (onlineUsers.has(socketUserId)) {
      const activeConnections = onlineUsers.get(socketUserId);

      if (activeConnections.length === 1) {
        onlineUsers.delete(socketUserId);
        socket.broadcast.emit('remove-offline-user', socketUserId);
      }
    }
  })
};

module.exports.attachListeners = attachListeners;
