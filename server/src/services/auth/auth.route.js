const express = require('express');
const router = express.Router();
const authService = require('./service/auth');

router.post('/login', authService.login);
router.post('/logout', authService.logout);
router.post('/checkSession', authService.checkSession);

module.exports = router;
