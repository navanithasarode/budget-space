import React from "react";
import { Link } from "react-router-dom";

const icons = { Trip: "✈️", Healthcare: "🏥", Birthday: "🎂", Household: "🏠", Education: "🎓", Shopping: "🛍️", Vehicle: "🚗", Personal: "💰", "Wedding/Event": "💍", Project: "💻", Insurance: "🛡️", Custom: "✨" };

export default function BudgetCard({ budget }) {
  const spent = budget.expenses.reduce((s, e) => s + Number(e.amount), 0);
  const pct = budget.budgetAmount ? Math.min(100, (spent / budget.budgetAmount) * 100) : 0;
  return <Link className="budget-card" to={`/budgets/${budget.id}`}>
    <div className="card-top"><span className="type-icon">{icons[budget.type] || "✨"}</span><span className="type-label">{budget.type}</span></div>
    <h3>{budget.name}</h3>
    <p>{budget.description || "No description"}</p>
    <div className="money-row"><strong>₹{spent.toLocaleString("en-IN")}</strong><span>/ ₹{budget.budgetAmount.toLocaleString("en-IN")}</span></div>
    <div className="progress"><i style={{ width: `${pct}%` }} /></div>
    <div className="card-footer"><span>{pct.toFixed(0)}% used</span><span>₹{Math.max(0, budget.budgetAmount - spent).toLocaleString("en-IN")} left</span></div>
  </Link>;
}
