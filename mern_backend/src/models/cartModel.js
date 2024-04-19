const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  user_id: {
    type: String,
  },
  product_id: {
    type: String,
  },
  coupon_id: {
    type: String,
    default : ""
  },
  coupon_text: {
    type: String,
    default : ""
  },
  quantity: {
    type: Number,
  },
  address: {
    type: String,
  },
  amount: {
    type: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

const CartModel = new mongoose.model("Cart", CartSchema);

module.exports = CartModel;
