import React, { useRef, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { SidebarContainer } from '../components/Sidebar';
import { ActiveChat } from '../components/ActiveChat';
import { logout, fetchConversations } from '../store/utils/thunkCreators';
import { clearOnLogout } from '../store/index';

const useStyles = makeStyles({
  root: {
    height: 'max-content',
  },
});

const Home = ({ user, logout, fetchConversations }) => {
  const classes = useStyles();
  const isMounted = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout(user.id);
  }, [logout, user]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      // set the logged in state only when the user prop changes and the component is mounted
      setIsLoggedIn(true);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (!user.id) {
    // If we were previously logged in, redirect to login instead of register
    if (isLoggedIn) return <Redirect to='/login' />;

    return <Redirect to='/register' />;
  }

  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.root} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component='main' className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
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
    logout: id => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
