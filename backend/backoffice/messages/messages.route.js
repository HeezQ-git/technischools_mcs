const express = require('express');
const router = express.Router();
const messagesService = require('./service');

router.post('/api/get-all-messages', messagesService.getAllMessages);

module.exports = router;
