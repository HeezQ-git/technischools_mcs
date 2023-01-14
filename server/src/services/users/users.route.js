const express = require('express');
const router = express.Router();
const usersService = require('./service');

router.post('/users/get-all-users', usersService.getAllUsers);
router.post('/users/get-users-per-page', usersService.getUsersPerPage);
router.post('/users/get-user', usersService.getUser);
router.post('/users/add-user', usersService.addUser);
router.post('/users/edit-user', usersService.editUser);
router.post('/users/delete-user', usersService.deleteUser);

module.exports = router;
