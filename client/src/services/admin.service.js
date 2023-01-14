import axios from 'axios';

const AdminService = {
  getAllAccounts: (data) => axios.post('/api/admin/get-all-accounts', data),
  getAllClients: (data) => axios.post('/api/admin/get-all-clients', data),
  createAccount: (data) => axios.post('/api/admin/create-account', data),
  createClient: (data) => axios.post('/api/admin/create-client', data),
};

export { AdminService };
