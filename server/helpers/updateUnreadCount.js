const { Conversation } = require('../db/models');

// is this even necessary if the seen logic is in Message?

const updateUnreadCount = async (recipientId, conversation) => {
    // optimize into one DB update
}

const resetUnreadCount = (userId, conversation) => {
    // optimize into one DB update
}

module.exports.updateUnreadCount = updateUnreadCount
module.exports.resetUnreadCount = resetUnreadCount