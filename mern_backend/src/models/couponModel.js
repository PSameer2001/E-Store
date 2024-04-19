const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  min_amount: {
    type: Number,
    required: true,
  },
  coupon_amount:{
    type: Number,
    required: true,
  }
});

const CouponModel = new mongoose.model("Coupon", CouponSchema);

module.exports = CouponModel;