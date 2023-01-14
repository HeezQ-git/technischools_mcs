import axios from "axios";

const MessagesService = {
    getAllMessages: (data) => axios.post("/api/messages/get-all-messages", data),
    sendMessage: (data) => axios.post("/api/messages/send-message", data),
};

export { MessagesService };