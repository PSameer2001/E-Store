const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  user_id: {
    type: String,
  },
  product_data: [],
  coupon_id: {
    type: String,
    default: "",
  },
  coupon_amount: {
    type: String,
    default: "",
  },
  finalAmount: {
    type: Number,
  },
  shippingAmount: {
    type: Number,
  },
  shippingAddress: {
    type: String,
  },
  ContactNo: {
    type: String,
  },
  expectedDelivery: {
    todaydate: String,
    nextdate: String,
  },
  paymentStatus: {
    type: String,
    default: "Not Paid",
  },
  paymentInitialize: {
    type: String,
    default: "0",
  },
  deliveryStatus: {
    type: String,
    default: "Not Delivered",
  },
  deliverydate: { type: Date, default: "" },
  deliveryOtp: {
    type: String,
    default: "",
  },
  razorpay_order_id: {
    type: String,
    default: "",
  },
  razorpay_payment_id: {
    type: String,
    default: "",
  },
  razorpay_signature: {
    type: String,
    default: "",
  },
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = new mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
