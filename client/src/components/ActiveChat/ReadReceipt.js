import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Avatar } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 6
  },
  unreadMessage: {
    fontSize: 12,
    color: "#BECCE2",
    fontWeight: "bold",
  },
  avatar: {
    height: 20,
    width: 20,
    marginRight: 11,
    marginTop: 6,
  },
}));

// displays only if the last message is sent by the current user
const ReadReceipt = ({ otherUser, seen }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {!seen ? (
        <Typography className={classes.unreadMessage}>Unread</Typography>
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
