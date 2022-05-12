import axios from "axios";

const MessagesService = {
  getAllMessages: (data) => axios.post("/api/get-all-messages", data),
  sendMessage: (data) => axios.post("/api/send-message", data),
};

export { MessagesService };
