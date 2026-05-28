const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    default: "🍽️",
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users_auth",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "payment_pending",
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      default: "payment_pending",
    },
     paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["esewa", "cash"],
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    estimatedDeliveryTime: {
      type: String,
      default: "30-40 min",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${(count + 1).toString().padStart(6, "0")}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
