import React, {useEffect} from "react";
import { Box } from "@material-ui/core";
import moment from "moment";
import { connect } from "react-redux";
import { readMessage } from '../../store/utils/thunkCreators';
import { SenderBubble, OtherUserBubble, ReadReceipt } from "../ActiveChat";

const Messages = ({user, conversation, readMessage}) => {
  const { id: userId } = user
  const { id: conversationId, messages, otherUser, latestMessageText, unreadCount} = conversation;
  // TODO: optimize into a latestMessage object
  const latestMessageIndex = messages.length !== 0 ? messages.length - 1 : 0
  const latestMessageSenderId = messages[latestMessageIndex]?.senderId

  useEffect(() => {
    readMessage(user, conversationId)
  }, [readMessage, user, conversationId, latestMessageText])

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
      {userId === latestMessageSenderId && <ReadReceipt otherUser={otherUser} unreadCount={unreadCount}/>}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    readMessage: (user, conversationId) => {
      dispatch(readMessage(user, conversationId))
    }
  };
};

export default connect(null, mapDispatchToProps)(Messages);
