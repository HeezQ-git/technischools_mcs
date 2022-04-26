const express = require("express");
const router = express.Router();
const messagesService = require("./service");

router.get("/api/send", messagesService.sendMessage);

module.exports = router;
