const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "0",
  },
  createdAt : { type: Date, default: Date.now },
  chats : []
});

const ContactModel = new mongoose.model("Contact", ContactSchema);

module.exports = ContactModel;
