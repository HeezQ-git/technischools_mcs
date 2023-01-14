const express = require('express');
const router = express.Router();
const adminService = require('./service');

router.post('/admin/get-all-accounts', adminService.getAllAccounts);
router.post('/admin/get-all-clients', adminService.getAllClients);
router.post('/admin/create-account', adminService.createAccount);
router.post('/admin/create-client', adminService.createClient);

module.exports = router;
