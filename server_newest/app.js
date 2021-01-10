const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

// DB
const connectDB = require("./api/config/db");

// Routes
const userRoutes = require("./api/routes/users");
const itemRoutes = require("./api/routes/items");
const giffcodeRoutes = require("./api/routes/giffcodes");
const blogRoutes = require("./api/routes/blogs");
const rollupRoutes = require("./api/routes/rollups");
// const userItemRoutes = require('./api/routes/userItems')
// const historiesRoutes = require('./api/routes/histories')
const statisticsRoutes = require("./api/routes/statistics");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/uploads", express.static("./uploads"));
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/giffcodes", giffcodeRoutes);
app.use("/blogs", blogRoutes);
app.use("/rolls", rollupRoutes);
// app.use('/user-items', userItemRoutes)
// app.use('/histories', historiesRoutes)
app.use("/statistics", statisticsRoutes);

// Handling server errors
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    msg: error.message,
  });
});

module.exports = app;
