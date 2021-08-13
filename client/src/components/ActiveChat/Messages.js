import React, {useEffect} from "react";
import { Box } from "@material-ui/core";
import moment from "moment";
import { connect } from "react-redux";
import { readMessage } from '../../store/utils/thunkCreators';
import { SenderBubble, OtherUserBubble } from "../ActiveChat";

const Messages = ({user, conversation, readMessage}) => {
  const { id: userId } = user
  const { id: conversationId, messages, otherUser} = conversation;

  useEffect(() => {
    readMessage(user, otherUser, conversationId)
  }, [readMessage, user, otherUser, conversationId])

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
