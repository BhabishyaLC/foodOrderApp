const express = require("express");
const User = require("../models/customer.js");
const { auth } = require("../middleware/auth.js");
const router = express.Router();

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate(
        "orderStats.favoriteRestaurants.restaurant",
        "name cuisine image"
      );

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
});

router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;

    delete updates.email;
    delete updates.password;
    delete updates.role;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
});

router.post("/address", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.addAddress(req.body);

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      message: "Address added successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({
      success: false,
      message: "Error adding address",
    });
  }
});

router.put("/address/:addressId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.updateAddress(req.params.addressId, req.body);

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      message: "Address updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Error updating address",
    });
  }
});

router.delete("/address/:addressId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.removeAddress(req.params.addressId);

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      message: "Address deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
});

module.exports = router;
