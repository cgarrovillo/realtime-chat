const router = require('express').Router();
const { Conversation, Message } = require('../../db/models');
const onlineUsers = require('../../util/onlineUsers');

// expects {recipientId, text, sender} in body
router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender} = req.body;

    // find the conversation by the conversation Id
    let conversation = await Conversation.findConversationById(conversationId);

    if (!conversation) {
      // create conversation if it doesn"t exist already
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.has(sender.id)) {
        sender.online = true;
      }
    } else {
      // if the senderId decoded from the JWT does not match that of the conversation's user ids, consider the request invalid
      if (senderId !== conversation.user1Id && senderId !== conversation.user2Id) {
        return res.sendStatus(403)
      }
    }
    
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
