const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review");

const CampgroundSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async (campground) => {
  if (campground) {
    const res = await Review.deleteMany({ _id: { $in: campground.reviews } }); // if use 'id' without "_", mongoose delete all data
    console.log(res);
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
