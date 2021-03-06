import axios from "axios";
import socket from "../../utils/socket";
import {
  getConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  resetUnread
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");

    if (data.id) {
      dispatch(gotUser(data));
      if (!socket.connected) socket.connect()
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    localStorage.setItem("messenger-token", data.token);

    if (data.id) {
      dispatch(gotUser(data));
      if (!socket.connected) socket.connect()
    }
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    localStorage.setItem("messenger-token", data.token);

    if (data.id) {
      dispatch(gotUser(data));
      if (!socket.connected) socket.connect()
    }
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    localStorage.removeItem("messenger-token");

    dispatch(gotUser({}));
    socket.disconnect()
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(getConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

const readMessage = (data) => {
  socket.emit("read-message", data)
}

// message format to send: {text, recipientId, conversationId, sender}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const setMessageRead = (user, otherUser, conversationId) => async (dispatch) => {
  try {
    // API call to /messages to change the read status of a message
    // Should be similar to postMessage in functionality;  API call first, Socket second
    // socket emit
    const convoData = { user, otherUser, conversationId }
    const { status } = await axios.patch(`/api/conversations/read`, convoData)
    
    if (status === 204) {
      // reset this client's displayed read count
      dispatch(resetUnread(conversationId))

      readMessage(convoData)
    }
  } catch (error) {
    console.error(error)
  }
}