
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, "Zip code is required"],
      trim: true,
    },
    country: {
      type: String,
      default: "United States",
      trim: true,
    },
    apartment: {
      type: String,
      default: "",
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return this.authMethod == "local";
    },
  },
  role: {
    type: String,
    enum: ["customer", "restaurant", "restaurant_pending"],
    default: "customer",
  },
  googleId: { type: String, sparse: true },
  authMethod: { type: String, enum: ["local", "google"], default: "local" },
  isVerified: { type: Boolean, default: false },
  hasSelectedRole: {
    type: Boolean,
    default: false,
  },
  hasSubmittedForm: {
    type: Boolean,
    default: false,
  },
  restaurantStatus: {
    type: String,
    enum: ["none", "pending", "approved", "rejected"],
    default: "none",
  },
  rejectionReason: String,
  

  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number"],
  },
  profileImage: {
    url: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
  },
  dateOfBirth: {
    type: Date,
  },
  addresses: [addressSchema],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    dietaryRestrictions: [
      {
        type: String,
        enum: [
          "Vegetarian",
          "Vegan",
          "Gluten-Free",
          "Dairy-Free",
          "Nut-Free",
          "Kosher",
          "Halal",
        ],
      },
    ],
    favoriteCuisines: [
      {
        type: String,
        enum: [
          "Italian",
          "Indian",
          "Chinese",
          "Mexican",
          "Japanese",
          "Thai",
          "American",
          "Mediterranean",
        ],
      },
    ],
    spiceLevel: {
      type: String,
      enum: ["Mild", "Medium", "Hot", "Extra Hot"],
      default: "Medium",
    },
  },
  orderStats: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    favoriteRestaurants: [
      {
        restaurant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
        },
        orderCount: { type: Number, default: 0 },
      },
    ],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.authMethod !== "local") {
    throw new Error("This user used Google authentication");
  }
  if (!this.password) {
    throw new Error("No password set for this user");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.addAddress = function (addressData) {
  if (this.addresses.length === 0 || addressData.isDefault) {
    this.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
    addressData.isDefault = true;
  }
  this.addresses.push(addressData);
  return this.save();
};

UserSchema.methods.updateAddress = function (addressId, updateData) {
  const address = this.addresses.id(addressId);
  if (!address) throw new Error("Address not found");
  if (updateData.isDefault) {
    this.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }
  Object.assign(address, updateData);
  return this.save();
};

UserSchema.methods.removeAddress = function (addressId) {
  const address = this.addresses.id(addressId);
  if (!address) throw new Error("Address not found");
  const wasDefault = address.isDefault;
  address.remove();
  if (wasDefault && this.addresses.length > 0) {
    this.addresses[0].isDefault = true;
  }
  return this.save();
};

// ✅ ADD VIRTUAL FIELDS
UserSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});


const UserModel = mongoose.model("users_auth", UserSchema);
module.exports = UserModel;