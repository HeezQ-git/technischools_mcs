const express = require('express');
const router = express.Router();
const groupsService = require('./service');

router.post('/groups/get-all-groups', groupsService.getAllGroups);
router.post('/groups/get-group-by-id', groupsService.getGroupById);
router.post('/groups/create-group', groupsService.createGroup);
router.post('/groups/edit-group', groupsService.editGroup);
router.post('/groups/delete-group', groupsService.deleteGroup);
router.post('/groups/add-to-group', groupsService.addToGroup);
router.post('/groups/remove-from-group', groupsService.removeFromGroup);

module.exports = router;
