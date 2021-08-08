import io from "socket.io-client";
import store from "../store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "../store/conversations";

const socket = io(window.location.origin, {
  autoConnect: false,
  auth: cb => {
    const token = localStorage.getItem("messenger-token")
    cb({token})
  }
});

socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("add-online-user", (id) => {
  store.dispatch(addOnlineUser(id));
});

socket.on("remove-offline-user", (id) => {
  store.dispatch(removeOfflineUser(id));
});

socket.on("new-message", (data) => {
  store.dispatch(setNewMessage(data.message, data.sender));
});

socket.on("connect_error", () => {
  console.error("Cannot establish connection.")
})

export default socket;