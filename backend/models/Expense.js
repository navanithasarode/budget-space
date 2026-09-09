const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  budgetSpace: { type: mongoose.Schema.Types.ObjectId, ref: "BudgetSpace", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  amountMinor: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, trim: true, maxlength: 50 },
  date: { type: Date, required: true },
  paidBy: { type: String, default: "Me", maxlength: 80 },
  note: { type: String, default: "", maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expense", expenseSchema);
