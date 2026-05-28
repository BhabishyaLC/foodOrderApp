const express = require("express");
const Menu = require("../models/menu.js");
const Restaurant = require("../models/restaurant.js");
const { auth } = require("../middleware/auth.js");
const router = express.Router();

router.get("/restaurant/my-menu", auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
      status: "approved",
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No approved restaurant found",
      });
    }

    const menuItems = await Menu.find({
      restaurant: restaurant._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      menuItems,
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching menu items:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching menu items",
    });
  }
});

router.post("/restaurant/add", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      ingredients,
      preparationTime,
      image,
    } = req.body;

    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No approved restaurant found",
      });
    }
    console.log("Restaurant found:", {
      id: restaurant._id,
      name: restaurant.name,
      status: restaurant.status,
    });

    const menuItem = new Menu({
      restaurant: restaurant._id,
      name,
      description,
      price,
      category,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      preparationTime,
      image: image || "🍽️",
      isAvailable: true,
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({
      success: false,
      message: "Error adding menu item",
    });
  }
});

router.put("/restaurant/update/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const menuItem = await Menu.findOneAndUpdate(
      {
        _id: id,
        restaurant: restaurant._id,
      },
      updates,
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Error updating menu item",
    });
  }
});

router.delete("/restaurant/delete/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const menuItem = await Menu.findOneAndDelete({
      _id: id,
      restaurant: restaurant._id,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting menu item",
    });
  }
});

router.patch("/restaurant/toggle-availability/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const menuItem = await Menu.findOne({
      _id: id,
      restaurant: restaurant._id,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json({
      success: true,
      message: `Menu item ${
        menuItem.isAvailable ? "enabled" : "disabled"
      } successfully`,
      menuItem,
    });
  } catch (error) {
    console.error("Error toggling menu item availability:", error);
    res.status(500).json({
      success: false,
      message: "Error updating menu item",
    });
  }
});

module.exports = router;
