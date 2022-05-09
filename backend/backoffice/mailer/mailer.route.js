const express = require('express');
const router = express.Router();
const mailerService = require('./service');

router.post('/api/send-email', mailerService.sendEmail);

module.exports = router;
