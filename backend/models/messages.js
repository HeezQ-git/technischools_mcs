const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
  { collection: 'messages' }
);

const messages = mongoose.model('messages', messagesSchema);

module.exports = messages;
