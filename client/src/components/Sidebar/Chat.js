import React, { useCallback } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { setActiveChat } from '../../store/activeConversation';
import { BadgeAvatar, ChatContent, UnreadCount } from '../Sidebar';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
}));

const Chat = ({ conversation, activeChat, setActiveChat }) => {
  const classes = useStyles();
  const { otherUser } = conversation;
  const { username } = otherUser;

  const handleClick = useCallback(async () => {
    setActiveChat(username);
  }, [username, setActiveChat]);

  return (
    <Box onClick={handleClick} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} activeChat={activeChat} />
      <UnreadCount conversation={conversation} activeChat={activeChat} />
    </Box>
  );
};

const mapStateToProps = state => {
  return {
    activeChat: state.activeConversation,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveChat: id => {
      dispatch(setActiveChat(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
