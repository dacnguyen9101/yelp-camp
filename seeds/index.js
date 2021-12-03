const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("../models/campground");

const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

main()
  .then((data) => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
}

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "61a50bb3ab47699ce3976942",
      location: `${cities[random].city},  ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "http://source.unsplash.com/collection/484351",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus fugit quaerat necessitatibus voluptate perferendis ducimus commodi cum praesentium quisquam voluptates quos assumenda, ex rerum, dicta obcaecati vitae itaque recusandae perspiciatis.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
