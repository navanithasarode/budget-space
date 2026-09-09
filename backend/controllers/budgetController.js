const BudgetSpace = require("../models/BudgetSpace");
const Expense = require("../models/Expense");
const { toMinor } = require("../utils/money");

exports.list = async (req, res) => {
  const budgets = await BudgetSpace.find({ owner: req.user.id }).sort({ createdAt: -1 });
  const ids = budgets.map(b => b._id);
  const sums = await Expense.aggregate([
    { $match: { budgetSpace: { $in: ids } } },
    { $group: { _id: "$budgetSpace", total: { $sum: "$amountMinor" } } }
  ]);
  const map = Object.fromEntries(sums.map(x => [String(x._id), x.total]));
  res.json(budgets.map(b => ({ ...b.toObject(), totalSpentMinor: map[String(b._id)] || 0 })));
};

exports.get = async (req, res) => {
  const budget = await BudgetSpace.findOne({ _id: req.params.id, owner: req.user.id });
  if (!budget) return res.status(404).json({ message: "Budget Space not found" });
  const expenses = await Expense.find({ budgetSpace: budget._id }).sort({ date: -1, createdAt: -1 });
  const totalSpentMinor = expenses.reduce((s, e) => s + e.amountMinor, 0);
  res.json({ budget, expenses, totalSpentMinor });
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const budget = await BudgetSpace.create({
      owner: req.user.id,
      name: data.name,
      description: data.description || "",
      type: data.type || "Custom",
      budgetMinor: toMinor(data.budgetAmount),
      currency: data.currency || "INR",
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      healthcare: data.healthcare || undefined
    });
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message || "Invalid budget" });
  }
};

exports.update = async (req, res) => {
  const budget = await BudgetSpace.findOne({ _id: req.params.id, owner: req.user.id });
  if (!budget) return res.status(404).json({ message: "Budget Space not found" });
  const allowed = ["name", "description", "type", "currency", "startDate", "endDate", "healthcare"];
  for (const key of allowed) if (req.body[key] !== undefined) budget[key] = req.body[key];
  if (req.body.budgetAmount !== undefined) budget.budgetMinor = toMinor(req.body.budgetAmount);
  await budget.save();
  res.json(budget);
};

exports.remove = async (req, res) => {
  const budget = await BudgetSpace.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!budget) return res.status(404).json({ message: "Budget Space not found" });
  await Expense.deleteMany({ budgetSpace: budget._id });
  res.json({ message: "Budget Space deleted" });
};
