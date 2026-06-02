const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const PORT = 5000;
const authRoutes = require("../backend/routes/authRoutes.js");
const restaurantRoutes = require("../backend/routes/restaurantRoute.js");
const adminRoutes = require("../backend/routes/admin.js");
const menuRoutes = require("./routes/menuRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const profileRoute = require("./routes/profileRoute.js");
const payment = require("./routes/payment.js");
const path = require("path");
require("dotenv").config();
require("./config/passport.js");
app.get("/", (req, res) => {
  res.send("This is server");
});

app.use(
  cors({
    origin: ["http://localhost:5173","https://fudexpress.netlify.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", profileRoute);
app.use("/api/payment", payment);
app.use(passport.initialize());

app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is active in http://localhost:${PORT}`);
});
