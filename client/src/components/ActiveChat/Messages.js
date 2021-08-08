import React, {useEffect} from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { connect } from "react-redux";
import { readMessage } from '../../store/utils/thunkCreators';

const Messages = ({user, conversation, readMessage}) => {
  const { id: userId } = user
  const { messages, otherUser} = conversation;

  useEffect(() => {
    // whole conversation object is kept as dependency instead of destructuring id when passed,
    // since we need to keep track of conversation object updates
    const conversationId = conversation.id
    readMessage(user, conversationId)
  }, [readMessage, user, conversation])

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
    readMessage: (user, conversationId) => {
      dispatch(readMessage(user, conversationId))
    }
  };
};

export default connect(null, mapDispatchToProps)(Messages);
