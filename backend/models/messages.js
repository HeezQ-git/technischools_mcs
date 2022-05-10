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
      type: [{ type: String }],
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'messages' }
);

const messages = mongoose.model('messages', messagesSchema);

module.exports = messages;
