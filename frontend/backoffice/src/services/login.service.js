import axios from 'axios';

const LoginService = {
  login: (data) => axios.post('/api/login', data),
  logout: () => axios.post('/api/logout'),
  checkSession: (data) => axios.post('/api/checkSession', data),
};

export { LoginService };
