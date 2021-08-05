const router = require('express').Router();
const { Conversation, Message } = require('../../db/models');
const onlineUsers = require('../../onlineUsers');

// expects {recipientId, text, sender} in body 
router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, sender } = req.body;

    // if the senderId decoded from the JWT does not match that of the sender's id, consider the request invalid
    if (senderId !== sender.id) {
      return res.sendStatus(400)
    }

    // find the conversation containing the senderId (decoded from JWT) & the recipient Id
    let conversation = await Conversation.findConversation(senderId, recipientId);

    if (!conversation) {
      // create conversation if it doesn't exist already
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (sender !== null && onlineUsers.includes(sender.id)) {
        sender.online = true;
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
