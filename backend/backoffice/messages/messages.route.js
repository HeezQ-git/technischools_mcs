const express = require('express');
const router = express.Router();
const messagesService = require('./service');

router.post('/api/get-all-messages', messagesService.getAllMessages);
router.post('/api/send-message', messagesService.sendMessage);
router.post('/api/get-messages-groups', messagesService.getMessagesGroups);

module.exports = router;
