const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  oldprice: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  review :[]
});

const ProductModel = new mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
