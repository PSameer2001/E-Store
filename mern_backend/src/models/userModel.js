const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  imageUrl: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Number,
    default: 0,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  Otp: {
    type: Number,
    default: 0,
  }
});

const UserModel = new mongoose.model("User", UserSchema);

module.exports = UserModel;
