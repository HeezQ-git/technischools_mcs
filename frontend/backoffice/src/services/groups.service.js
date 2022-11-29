import axios from 'axios';

const GroupsService = {
  getAllGroups: (data) => axios.post('/api/groups/get-all-groups', data),
  getGroupById: (data) => axios.post('/api/groups/get-group-by-id', data),
  getGroupsUsers: (data) => axios.post('/api/groups/get-groups-users', data),
  getAllGroupsUsers: (data) => axios.post('/api/groups/get-all-groups-users', data),
  createGroup: (data) => axios.post('/api/groups/create-group', data),
  editGroup: (data) => axios.post('/api/groups/edit-group', data),
  deleteGroup: (data) => axios.post('/api/groups/delete-group', data),
  addToGroup: (data) => axios.post('/api/groups/add-to-group', data),
  removeFromGroup: (data) => axios.post('/api/groups/remove-from-group', data),
};

export { GroupsService };
