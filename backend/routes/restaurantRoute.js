const express = require("express");
const Restaurant = require("../models/restaurant.js");
const User = require("../models/customer.js");
const Menu = require("../models/menu.js");
const Order = require("../models/order.js");
const router = express.Router();
const { auth } = require("../middleware/auth.js");
const upload = require("../middleware/uploads.js");

router.post("/apply", upload.single("images"), async (req, res) => {
  try {
    console.log("Restaurant application received:", req.body);

    const {
      ownerId,
      name,
      description,
      regNum,
      address,
      contact,

      openingHours,
    } = req.body;

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(400).json({ message: "User not found" });
    }

    if (owner.role !== "restaurant_pending") {
      return res
        .status(400)
        .json({ message: "User role not set to restaurant" });
    }

    const existingRestaurant = await Restaurant.findOne({ owner: ownerId });
    if (existingRestaurant) {
      return res
        .status(400)
        .json({ message: "Restaurant application already submitted" });
    }

    const restaurant = new Restaurant({
      owner: ownerId,
      name,
      description,
      regNum,
      address: JSON.parse(req.body.address),
      contact: JSON.parse(req.body.contact),
      openingHours: JSON.parse(req.body.openingHours),
      status: "pending",
      images: req.file ? `/uploads/restaurants/${req.file.filename}` : null,
    });

    await restaurant.save();

    console.log(" Restaurant application saved:", restaurant._id);

    owner.hasSubmittedForm = true;
    owner.restaurantStatus = "pending";

    const updatedUser = await owner.save();
    res.status(201).json({
      success: true,
      message:
        "Restaurant application submitted successfully! We will review it and get back to you soon.",
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        status: restaurant.status,
        images:restaurant.images,
      },
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        hasSelectedRole: updatedUser.hasSelectedRole,
        hasSubmittedForm: updatedUser.hasSubmittedForm,
        restaurantStatus: updatedUser.restaurantStatus,
      },
    });

   
  } catch (error) {
    console.error("Restaurant application error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during restaurant application",
      error: error.message,
    });
  }
});

router.get("/my-restaurant", async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const restaurant = await Restaurant.findOne({ owner: ownerId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/approved", async (req, res) => {
  try {
    console.log("🍽️ Fetching approved restaurants...");

    const restaurants = await Restaurant.find({
      status: "approved",
      isActive: true,
    })
      .populate("owner", "name email")
      .select(
        "name regNum description images openingHours contact address rating deliveryTime"
      );

    console.log(`Found ${restaurants.length} approved restaurants`);

    res.json({
      success: true,
      restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching restaurants",
    });
  }
});

router.get("/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      _id: id,
      status: "approved",
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or not approved",
      });
    }

    const menuItems = await Menu.find({
      restaurant: id,
      isAvailable: true,
    }).select(
      "name description price category ingredients images preparationTime isAvailable"
    );

    res.json({
      success: true,
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        regNum: restaurant.regNum,
        deliveryTime: restaurant.deliveryTime,
        rating: restaurant.rating,
      },
      menuItems,
    });
  } catch (error) {
    console.error("Error fetching restaurant menu:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching restaurant menu",
    });
  }
});

router.get("/owner/my-restaurant", auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
      status: "approved",
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No approved restaurant found for this user",
      });
    }

    res.json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Error fetching owner restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching restaurant data",
    });
  }
});

module.exports = router;
