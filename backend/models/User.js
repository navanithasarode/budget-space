
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },

  // Onboarding information
  onboarding: {
    completed: { type: Boolean, default: false },
    budgetingWith: { type: String, default: "" },
    purpose: { type: String, default: "" },
    firstAction: { type: String, default: "" },
    numberOfPeople: { type: Number, default: 1, min: 1 }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
