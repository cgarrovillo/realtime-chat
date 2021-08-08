const { Conversation } = require('../db/models');

const USER1_UNREAD_COUNT = 'user1UnreadCount'
const USER2_UNREAD_COUNT = 'user2UnreadCount'

// increment the other user's unread count
const updateUnreadCount = async (recipientId, conversation) => {
    if (conversation.user1Id === recipientId) {
        const convoCopy = {...conversation}
        convoCopy[USER1_UNREAD_COUNT]++
        return Conversation.update(convoCopy, {
            where: {
                id: conversation.id
            }
        })
    }

    const convoCopy = { ...conversation }
    convoCopy[USER2_UNREAD_COUNT]++
    return Conversation.update(convoCopy, {
        where: {
            id: conversation.id
        }
    })
}

// reset the current user's unread count
const resetUnreadCount = (userId, conversation) => {
    if (conversation.user1Id === userId) {
        const convoCopy = { ...conversation }
        convoCopy[USER1_UNREAD_COUNT] = 0
        return Conversation.update(convoCopy, {
            where: {
                id: conversation.id
            }
        })
    }

    const convoCopy = { ...conversation }
    convoCopy[USER2_UNREAD_COUNT] = 0
    return Conversation.update(convoCopy, {
        where: {
            id: conversation.id
        }
    })
}

module.exports.updateUnreadCount = updateUnreadCount
module.exports.resetUnreadCount = resetUnreadCount