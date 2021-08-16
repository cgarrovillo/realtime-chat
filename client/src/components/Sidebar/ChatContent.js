import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: theme.spacing(2),
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    letterSpacing: -0.17,
  },
  previewTextUnread: {
    fontSize: 12,
    color: "#000",
    letterSpacing: -0.17,
    fontWeight: "bold"
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, activeChat } = props;
  const { latestMessageText, otherUser, unreadCount } = conversation;
  const { username } = otherUser

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {username}
        </Typography>
        <Typography className={(unreadCount > 0 && username !== activeChat) ? classes.previewTextUnread : classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
