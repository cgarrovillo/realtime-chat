import { Box, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: 18,
    marginRight: 18,
  },
  unreadCount: {
    backgroundColor: '#3A8DFF',
    borderRadius: '20px',
  },
  unreadCountLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: -0.4,
    lineHeight: 1,
  },
}));

const UnreadCount = ({ conversation, activeChat }) => {
  const classes = useStyles();
  const {
    unreadCount,
    otherUser: { username },
  } = conversation;

  return (
    <Box className={classes.root}>
      {unreadCount > 0 && username !== activeChat && (
        <Chip
          label={unreadCount}
          size='small'
          classes={{
            root: classes.unreadCount,
            label: classes.unreadCountLabel,
          }}
        />
      )}
    </Box>
  );
};

export default UnreadCount;
