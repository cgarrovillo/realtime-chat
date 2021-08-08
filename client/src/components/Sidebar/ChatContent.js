import React from "react";
import { Box, Typography, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadCountContainer: {
    marginLeft: 18,
    marginRight: 18
  },
  unreadCount: {
    backgroundColor: "#3A8DFF",
    borderRadius: "20px",
  },
  unreadCountLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: -0.4,
    lineHeight: 1
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, unreadCount } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      <Box className={classes.unreadCountContainer}>
        {unreadCount > 0 && <Chip label={unreadCount} size="small" classes={{
          root: classes.unreadCount,
          label: classes.unreadCountLabel
        }}/>}
      </Box>
    </Box>
  );
};

export default ChatContent;
