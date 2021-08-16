import React, { useState, useCallback } from 'react';
import { FormControl, FilledInput } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { postMessage } from '../../store/utils/thunkCreators';

const useStyles = makeStyles(theme => ({
  root: {
    justifySelf: 'flex-end',
    marginTop: theme.spacing(2),
  },
  input: {
    height: 70,
    backgroundColor: '#F4F6FA',
    borderRadius: 8,
    marginBottom: theme.spacing(2.5),
  },
}));

const Input = ({user, otherUser, conversationId, postMessage}) => {
  const classes = useStyles();
  const [text, setText] = useState('');

  const handleSubmit = useCallback(async event => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId: conversationId,
      sender: user,
    };
    await postMessage(reqBody);
    setText('');
  }, [user, otherUser, conversationId, postMessage]);

  const handleChange = useCallback(event => {
    setText(event.target.value);
  }, []);

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder='Type something...'
          value={text}
          name='text'
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postMessage: message => {
      dispatch(postMessage(message));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Input);
