const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
      default: "🍽️",
    },
    preparationTime: {
      type: String,
      default: "15-20 min",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    spiceLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

menuSchema.index({ restaurant: 1, name: 1 }, { unique: true });

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
