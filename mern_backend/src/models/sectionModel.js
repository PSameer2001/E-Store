const mongoose = require("mongoose");

const SectionSchema = mongoose.Schema({
  category_id: {
    type: String,
    required: true
  },
  sequence: {
    type: String,
    required: true,
  },
  type:{
    type: String,
    required: true,
  }
});

const SectionModel = new mongoose.model("Section", SectionSchema);

module.exports = SectionModel;