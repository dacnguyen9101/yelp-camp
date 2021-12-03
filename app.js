const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const { RSA_NO_PADDING } = require("constants");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const flash = require("connect-flash");
const { reviewSchema } = require("./schemas");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const userRoutes = require("./routes/user");
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");

main()
  .then((data) => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
}

// ejs-mate
app.engine("ejs", ejsMate);

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// serve static
app.use(express.static(path.join(__dirname, "public")));

// req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for parsing application/json

// session

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (!["/login", "/", "/register"].includes(req.originalUrl)) {
    // req.session.returnTo = req.originalUrl;
    console.log(req.originalUrl);
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not found", 404));
});

// ================= hadling error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
