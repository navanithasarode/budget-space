const mongoose = require("mongoose");

const budgetSpaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: "", maxlength: 500 },
  type: {
    type: String,
    enum: ["Personal", "Trip", "Birthday", "Wedding/Event", "Healthcare", "Insurance", "Household", "Education", "Shopping", "Vehicle", "Project", "Custom"],
    default: "Custom"
  },
  budgetMinor: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "INR", uppercase: true, maxlength: 3 },
  startDate: Date,
  endDate: Date,
  healthcare: {
    patientName: String,
    hospital: String,
    doctor: String,
    treatmentDescription: String,
    estimatedCostMinor: { type: Number, min: 0 },
    insuranceProvider: String,
    insuranceCoverageMinor: { type: Number, min: 0 },
    claimAmountMinor: { type: Number, min: 0 },
    approvedAmountMinor: { type: Number, min: 0 },
    pendingAmountMinor: { type: Number, min: 0 },
    outOfPocketMinor: { type: Number, min: 0 },
    claimStatus: {
      type: String,
      enum: ["Not claimed", "Preparing", "Submitted", "Under review", "Approved", "Partially approved", "Rejected"],
      default: "Not claimed"
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BudgetSpace", budgetSpaceSchema);
