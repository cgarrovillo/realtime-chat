const onlineUsers = require("../util/onlineUsers");
const verifyTokenSocketPacket = require('../middleware/verifyTokenSocketPacket');

const addSocketListeners = socket => {
  socket.use((event, next) => verifyTokenSocketPacket(socket, next))

  socket.on('new-message', data => {
    const recipientSocketIds = onlineUsers.get(data.recipientId);
    if (recipientSocketIds) {
      socket.to(recipientSocketIds).emit('new-message', data);
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
    const { otherUser } = data
    const recipientSocketIds = onlineUsers.get(otherUser.id)
    if (recipientSocketIds) {
      socket.to(recipientSocketIds).emit('read-message', data);
    }
  });
};

module.exports = addSocketListeners;
