import React, {useEffect} from "react";
import { Box } from "@material-ui/core";
import moment from "moment";
import { connect } from "react-redux";
import { setMessageRead } from '../../store/utils/thunkCreators';
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import ReadReceipt from './ReadReceipt';

const Messages = ({ user, conversation, setMessageRead}) => {
  const { id: userId } = user
  const { id: conversationId, messages, otherUser} = conversation;
  const lastMessageIndex = messages.length - 1;

  useEffect(() => {
    if (!conversationId) return

    setMessageRead(user, otherUser, conversationId)
  }, [setMessageRead, user, otherUser, conversationId, lastMessageIndex])

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {!!(index === lastMessageIndex) && <ReadReceipt otherUser={otherUser} message={message} /> }
          </>
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMessageRead: (user, otherUser, conversationId) => {
      dispatch(setMessageRead(user, otherUser, conversationId))
    }
  };
};

export default connect(null, mapDispatchToProps)(Messages);
