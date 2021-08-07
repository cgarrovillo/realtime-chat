const onlineUsers = require('./onlineUsers');

const attachListeners = socket => {
  socket.on('go-online', id => {
    // keep track of multiple connections; multiple browser-tabs of the user
    let otherConnections = [];
    if (onlineUsers.has(id)) {
      otherConnections = onlineUsers.get(id);
    }

    otherConnections.push(socket.id);
    onlineUsers.set(id, otherConnections);
    // send the user who just went online to everyone else who is already online
    socket.broadcast.emit('add-online-user', id);
  });

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

  socket.on('logout', id => {
    if (onlineUsers.has(id)) {
      onlineUsers.delete(id);
      socket.broadcast.emit('remove-offline-user', id);
    }
  });
};

module.exports.attachListeners = attachListeners;
