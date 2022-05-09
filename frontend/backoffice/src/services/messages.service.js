import axios from 'axios';

const MessagesService = {
  getAllMessages: (data) => axios.post('/api/get-all-messages', data),
};

export { MessagesService };
