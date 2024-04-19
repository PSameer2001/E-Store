const mongoose = require("mongoose");

const ProductImageSchema = mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  selected_img:{
    type: String,
    default: "0",
  }
});

const ProductImageModel = new mongoose.model(
  "ProductImage",
  ProductImageSchema
);

module.exports = ProductImageModel;
