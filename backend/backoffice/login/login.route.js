const express = require('express');
const router = express.Router();
const loginService = require('./service');

router.post('/api/login', loginService.login);
router.post('/api/logout', loginService.logout);
router.post('/api/checkSession', loginService.checkSession);

module.exports = router;
