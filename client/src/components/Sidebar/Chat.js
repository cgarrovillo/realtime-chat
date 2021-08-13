import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setActiveChat } from "../../store/activeConversation";
import { BadgeAvatar, ChatContent, UnreadCount } from "../Sidebar";

const styles = {
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
};

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = { activeChat: "" }
  }

  handleClick = async (conversation) => {
    this.setState({
      activeChat: conversation.otherUser.username
    })
    await this.props.setActiveChat(conversation.otherUser.username);
  };

  render() {
    const { classes } = this.props;
    const otherUser = this.props.conversation.otherUser;
    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={this.props.conversation} activeChat={this.state.activeChat} />
        <UnreadCount conversation={this.props.conversation} activeChat={this.state.activeChat} />
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
