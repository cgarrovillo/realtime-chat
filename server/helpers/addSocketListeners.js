const onlineUsers = require("../util/onlineUsers");
const verifyTokenSocketPacket = require('../middleware/verifyTokenSocketPacket');
const { resetUnreadCount } = require('./updateUnreadCount');
const { Conversation } = require('../db/models');

const addSocketListeners = socket => {
  socket.use((event, next) => verifyTokenSocketPacket(socket, next))

  socket.on('new-message', data => {
    const recipientSocketIds = onlineUsers.get(data.recipientId);
    if (recipientSocketIds) {
      socket.to(recipientSocketIds).emit('new-message', {
        message: data.message,
        sender: data.sender,
      });
    }
  });

  socket.on('disconnect', () => {
    const { userId } = socket.userId
    if (onlineUsers.has(userId)) {
      const activeConnections = onlineUsers.get(userId);

      if (activeConnections.length === 1) {
        onlineUsers.delete(userId);
        socket.broadcast.emit('remove-offline-user', userId);
      }
    }
  });

  socket.on('read-message', async (data) => {
    // Similar to new-message handler;  find the socket to emit a read-message to
    // NO DB calls here.

    
  });
};

module.exports = addSocketListeners;
