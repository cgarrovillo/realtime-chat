import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Avatar } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  avatar: {
    height: 30,
    width: 30,
    marginRight: 11,
    marginTop: 6,
  },
}));

// displays only if the last message is sent by the current user
const ReadReceipt = ({ otherUser, unreadCount }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {unreadCount === 0 ? (
        <Typography>Unread</Typography>
      ) : (
        <Avatar
          alt={otherUser.username}
          src={otherUser.photoUrl}
          className={classes.avatar}></Avatar>
      )}
    </Box>
  );
};

export default ReadReceipt;
