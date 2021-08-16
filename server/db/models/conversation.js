const { Op, INTEGER} = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {
  user1Id: {
    type: INTEGER,
    allowNull: false
  },
  user2Id: {
    type: INTEGER,
    allowNull: false
  },
});

// find conversation given two user Ids
Conversation.findConversationByUserId = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

Conversation.findConversationById = async function (conversationId) {
  if (!conversationId) return null

  const conversation = await Conversation.findByPk(conversationId)
  return conversation
}

module.exports = Conversation;
