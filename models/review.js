const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: {
    type: String,
    // require: true,
  },
  rating: {
    type: Number,
    // require: true,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
