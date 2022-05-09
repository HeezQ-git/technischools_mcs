import axios from 'axios';

const MailerService = {
  sendEmail: (data) => axios.post('/api/send-email', data),
};

export { MailerService };
