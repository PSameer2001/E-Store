const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  imageUrl: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  }
});

const CategoryModel = new mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;