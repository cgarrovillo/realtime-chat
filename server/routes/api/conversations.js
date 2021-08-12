const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../util/onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "user1UnreadCount", "user2UnreadCount"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.get();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;

        // whether the other user has seen *this* user's messages
        convoJSON.seen = convoJSON.user1UnreadCount === 0
        // set *this* user's unread count
        convoJSON.unreadCount = convoJSON.user2UnreadCount
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;

        // whether the other user has seen *this* user's messages
        convoJSON.seen = convoJSON.user2UnreadCount === 0
        // set *this* user's unread count
        convoJSON.unreadCount = convoJSON.user1UnreadCount
      }
      delete convoJSON.user1;
      delete convoJSON.user2;
      delete convoJSON.user1UnreadCount
      delete convoJSON.user2UnreadCount

      // set property for online status of the other user
      if (onlineUsers.has(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      const lastMessageIndex = convoJSON.messages.length - 1
      convoJSON.latestMessageText = convoJSON.messages[lastMessageIndex].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
