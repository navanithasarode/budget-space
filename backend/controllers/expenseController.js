const BudgetSpace = require("../models/BudgetSpace");
const Expense = require("../models/Expense");
const { toMinor } = require("../utils/money");

async function ownedBudget(id, userId) {
  return BudgetSpace.findOne({ _id: id, owner: userId });
}

exports.list = async (req, res) => {
  if (!(await ownedBudget(req.params.budgetId, req.user.id))) return res.status(404).json({ message: "Budget Space not found" });
  res.json(await Expense.find({ budgetSpace: req.params.budgetId }).sort({ date: -1, createdAt: -1 }));
};

exports.create = async (req, res) => {
  try {
    if (!(await ownedBudget(req.params.budgetId, req.user.id))) return res.status(404).json({ message: "Budget Space not found" });
    const { title, category, date, paidBy, note } = req.body;
    const expense = await Expense.create({
      budgetSpace: req.params.budgetId,
      title,
      category,
      date: date || new Date(),
      paidBy: paidBy || "Me",
      note: note || "",
      amountMinor: toMinor(req.body.amount)
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message || "Invalid expense" });
  }
};

exports.update = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  if (!(await ownedBudget(expense.budgetSpace, req.user.id))) return res.status(403).json({ message: "Not authorized" });
  for (const key of ["title", "category", "date", "paidBy", "note"]) if (req.body[key] !== undefined) expense[key] = req.body[key];
  if (req.body.amount !== undefined) expense.amountMinor = toMinor(req.body.amount);
  await expense.save();
  res.json(expense);
};

exports.remove = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  if (!(await ownedBudget(expense.budgetSpace, req.user.id))) return res.status(403).json({ message: "Not authorized" });
  await expense.deleteOne();
  res.json({ message: "Expense deleted" });
};
