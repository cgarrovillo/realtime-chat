// used by both sending & receiving messages logic
export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  const existingConversationIndex = state.findIndex(convo => convo.id === message.conversationId)

  if (existingConversationIndex === -1) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      latestMessageText: message.text,
      unreadCount: 0
    };
    // add an unreadCount property on the convo,  but based off of messages with a "seen" property false
    // ---
    if (sender) newConvo.unreadCount++

    return [newConvo, ...state];
  }
  
  const stateCopy = [...state]
  const convoCopy = { ...stateCopy[existingConversationIndex]}
  convoCopy.messages.push(message);
  convoCopy.latestMessageText = message.text;

  // const unreadMessageCount = convoCopy.messages.filter(message => !message.seen).length
  // convoCopy.unreadCount = unreadMessageCount
  if (sender) convoCopy.unreadCount++
  
  stateCopy[existingConversationIndex] = convoCopy

  return stateCopy
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const resetUnreadCount = (state, conversationId) => {
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const newConvo = { ...convo };
      newConvo.unreadCount = 0
      return newConvo;
    } else {
      return convo;
    }
  });
}

export const changeReadReceipt = (state, data) => {
  // Called after listening to a read-message event
  // find conversation in `state` using the conversationId of `data`
  const { conversationId } = data

  return state.map(convo => {
    if (convo.id === conversationId) {

      // set all `seen` properties of all messages to `true
      const convoCopy = {...convo}
      const messages = [...convoCopy.messages]
      const updatedMessages = messages.map(message => {
        if (message.seen) return message

        const messageCopy = { ...message }
        messageCopy.seen = true
        return messageCopy
      })

      convoCopy.messages = updatedMessages
      return convoCopy
    } else {
      return convo
    }
  })
}