const express = require('express');
const router = express.Router();
const messagesService = require('./service');

router.post('/messages/get-all-messages', messagesService.getAllMessages);
router.post('/messages/send-message', messagesService.sendMessage);

module.exports = router;
