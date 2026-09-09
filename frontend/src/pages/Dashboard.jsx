import React from "react";
import { Link } from "react-router-dom";
import BudgetCard from "../components/BudgetCard";
import Stat from "../components/Stat";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { budgets, user } = useApp();
  const totalBudget = budgets.reduce((s, b) => s + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.expenses.reduce((a, e) => a + Number(e.amount), 0), 0);
  const allExpenses = budgets.flatMap(b => b.expenses.map(e => ({ ...e, budgetName: b.name }))).sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0, 5);

  return <div>
    <header className="page-header">
      <div><span className="eyebrow">Good evening{user ? `, ${user.name.split(" ")[0]}` : ""} 👋</span><h1>Your money, organized around life.</h1><p>Create a Budget Space for anything you're planning, paying for or saving toward.</p></div>
      <Link className="primary-button" to="/budgets/new">＋ Create Budget Space</Link>
    </header>

    <section className="stats-grid">
      <Stat label="Active spaces" value={budgets.length} />
      <Stat label="Planned budget" value={`₹${totalBudget.toLocaleString("en-IN")}`} />
      <Stat label="Total spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} />
      <Stat label="Remaining" value={`₹${Math.max(0,totalBudget-totalSpent).toLocaleString("en-IN")}`} hint={totalBudget ? `${((totalSpent/totalBudget)*100).toFixed(0)}% of planned budget` : ""} />
    </section>

    <div className="section-heading"><div><h2>Budget Spaces</h2><p>Every situation gets the same powerful foundation.</p></div></div>
    <section className="budget-grid">{budgets.map(b => <BudgetCard key={b.id} budget={b} />)}</section>

    <section className="recent panel">
      <div className="section-heading"><div><h2>Recent expenses</h2><p>Your latest money activity.</p></div></div>
      {allExpenses.length === 0 ? <div className="empty">No expenses yet.</div> : <div className="expense-list">
        {allExpenses.map(e => <div className="expense-row" key={e.id}><div className="expense-dot" /><div className="expense-main"><strong>{e.title}</strong><span>{e.category} · {e.budgetName}</span></div><time>{new Date(e.date).toLocaleDateString("en-IN", {day:"2-digit", month:"short"})}</time><b>₹{Number(e.amount).toLocaleString("en-IN")}</b></div>)}
      </div>}
    </section>
  </div>;
}
