import React, {useEffect} from "react";
import { Box } from "@material-ui/core";
import moment from "moment";
import { connect } from "react-redux";
import { readMessage } from '../../store/utils/thunkCreators';
import { SenderBubble, OtherUserBubble, ReadReceipt } from "../ActiveChat";

const Messages = ({user, conversation, readMessage}) => {
  const { id: userId } = user
  const { id: conversationId, messages, otherUser, latestMessageText, seen} = conversation;
  // TODO: optimize into a latestMessage object
  const latestMessageIndex = messages.length !== 0 ? messages.length - 1 : 0
  const latestMessageSenderId = messages[latestMessageIndex]?.senderId

  useEffect(() => {
    readMessage(user, otherUser, conversationId)
  }, [readMessage, user, otherUser, conversationId, latestMessageText, seen])

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
      {userId === latestMessageSenderId && <ReadReceipt otherUser={otherUser} seen={seen}/>}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    readMessage: (user, otherUser, conversationId) => {
      dispatch(readMessage(user, otherUser, conversationId))
    }
  };
};

export default connect(null, mapDispatchToProps)(Messages);
