const express = require("express");
const passport = require("passport");
const User = require("../models/customer.js");
const { generateToken } = require("../middleware/auth.js");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("=== REGISTRATION ATTEMPT ===");
  console.log("Request body:", req.body);

  try {
    const { name, email, password, c_password } = req.body;

    if (!name || !email || !password || !c_password) {
      console.log("Missing fields");
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== c_password) {
      console.log("Password mismatch");
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    console.log("Checking for existing user:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    console.log("Creating user object...");
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      authMethod: "local",
      isVerified: true,
    });

    console.log("Attempting to save user...");

    try {
      const savedUser = await user.save();
      console.log("User saved successfully:", savedUser._id);

      const token = generateToken(savedUser._id);

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          hasSelectedRole: savedUser.hasSelectedRole,
          restaurantStatus: savedUser.restaurantStatus,
          hasSubmittedForm: user.hasSubmittedForm,
        },
      });
    } catch (saveError) {
      console.error("Save operation failed:", saveError);
      console.error("Save error name:", saveError.name);
      console.error("Save error message:", saveError.message);

      if (saveError.name === "ValidationError") {
        const errors = Object.values(saveError.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      throw saveError;
    }
  } catch (error) {
    console.error("REGISTRATION ERROR:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      errorName: error.name,
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.authMethod !== "local") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasSelectedRole: user.hasSelectedRole,
        restaurantStatus: user.restaurantStatus,
        hasSubmittedForm: user.hasSubmittedForm,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/role", async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role === "restaurant" ? "restaurant_pending" : "customer";
    user.hasSelectedRole = true;
    user.restaurantStatus = role === "restaurant" ? "pending" : "none";

    await user.save();

    res.json({
      message: `Role set to ${role} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasSelectedRole: user.hasSelectedRole,
        restaurantStatus: user.restaurantStatus,
        hasSubmittedForm: user.hasSubmittedForm,
      },
    });
  } catch (error) {
    console.error("Role selection error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    session: false,
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id);

      res.redirect(`${process.env.CLIENT_URL}/role`);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
  }
);

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "name email role hasSelectedRole restaurantStatus createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasSelectedRole: user.hasSelectedRole,
      restaurantStatus: user.restaurantStatus,
      hasSubmittedForm: user.hasSubmittedForm,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error in /me endpoint:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
