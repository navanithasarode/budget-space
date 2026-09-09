import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categories } from "../data/mockData";
import { useApp } from "../context/AppContext";

export default function BudgetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { budgets, addExpense, deleteExpense, deleteBudget } = useApp();
  const budget = budgets.find(b => b.id === id);
  const [category, setCategory] = useState("All");
  const [form, setForm] = useState({ title:"", amount:"", category:"Food", date:new Date().toISOString().slice(0,10), paidBy:"Me", note:"" });

  if (!budget) return <div className="empty-page"><h2>Budget Space not found</h2><Link to="/">Back home</Link></div>;

  const spent = budget.expenses.reduce((s,e)=>s+Number(e.amount),0);
  const remaining = budget.budgetAmount-spent;
  const pct = budget.budgetAmount ? Math.min(100, spent/budget.budgetAmount*100) : 0;
  const filtered = category === "All" ? budget.expenses : budget.expenses.filter(e=>e.category===category);
  const breakdown = useMemo(() => {
    const m = {};
    budget.expenses.forEach(e => m[e.category] = (m[e.category] || 0) + Number(e.amount));
    return Object.entries(m).sort((a,b)=>b[1]-a[1]);
  }, [budget.expenses]);

  const submit = async e => {
    e.preventDefault();
    if (!form.title || !form.amount || Number(form.amount)<=0) return;
    await addExpense(id, { ...form, amount:Number(form.amount) });
    setForm({ ...form, title:"", amount:"", note:"" });
  };

  const removeBudget = async () => {
    if (confirm("Delete this Budget Space and its expenses?")) {
      await deleteBudget(id);
      navigate("/");
    }
  };

  return <div>
    <div className="breadcrumbs"><Link to="/">Overview</Link> / {budget.name}</div>
    <header className="detail-header">
      <div><span className="type-label">{budget.type}</span><h1>{budget.name}</h1><p>{budget.description}</p></div>
      <button className="danger-button" onClick={removeBudget}>Delete</button>
    </header>

    <section className="hero-budget panel">
      <div><div className="hero-money">₹{spent.toLocaleString("en-IN")} <span>/ ₹{budget.budgetAmount.toLocaleString("en-IN")}</span></div><p>{remaining >= 0 ? `₹${remaining.toLocaleString("en-IN")} remaining` : `₹${Math.abs(remaining).toLocaleString("en-IN")} over budget`}</p></div>
      <div className="hero-progress"><div className="progress big"><i style={{width:`${pct}%`}} /></div><span>{pct.toFixed(0)}% used</span></div>
    </section>

    {budget.type === "Healthcare" && budget.healthcare && <section className="panel specialized">
      <div className="section-heading"><div><h2>Insurance snapshot</h2><p>Optional information relevant to this healthcare Budget Space.</p></div><span className="status">{budget.healthcare.claimStatus}</span></div>
      <div className="detail-grid">
        <div><span>Patient</span><b>{budget.healthcare.patientName || "—"}</b></div>
        <div><span>Hospital</span><b>{budget.healthcare.hospital || "—"}</b></div>
        <div><span>Provider</span><b>{budget.healthcare.insuranceProvider || "—"}</b></div>
        <div><span>Coverage</span><b>₹{(budget.healthcare.insuranceCoverage||0).toLocaleString("en-IN")}</b></div>
        <div><span>Claim amount</span><b>₹{(budget.healthcare.claimAmount||0).toLocaleString("en-IN")}</b></div>
        <div><span>Approved</span><b>₹{(budget.healthcare.approvedAmount||0).toLocaleString("en-IN")}</b></div>
        <div><span>Pending</span><b>₹{(budget.healthcare.pendingAmount||0).toLocaleString("en-IN")}</b></div>
        <div><span>Out of pocket</span><b>₹{(budget.healthcare.outOfPocket||0).toLocaleString("en-IN")}</b></div>
      </div>
    </section>}

    <div className="two-column">
      <section className="panel">
        <div className="section-heading"><div><h2>Add expense</h2><p>Keep every payment attached to this situation.</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          <label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Dinner" /></label>
          <label>Amount (₹)<input type="number" min="1" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="2500" /></label>
          <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
          <label>Date<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></label>
          <label>Paid by<input value={form.paidBy} onChange={e=>setForm({...form,paidBy:e.target.value})} /></label>
          <label className="wide">Note<textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Optional note" /></label>
          <button className="primary-button wide" type="submit">Add expense</button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading"><div><h2>Category breakdown</h2><p>Where this Budget Space is spending.</p></div></div>
        {breakdown.length === 0 ? <div className="empty">Add expenses to see insights.</div> : <div className="breakdown">{breakdown.map(([name,value])=><div key={name} className="break-item"><div><span>{name}</span><b>₹{value.toLocaleString("en-IN")}</b></div><div className="progress"><i style={{width:`${spent ? value/spent*100 : 0}%`}} /></div></div>)}</div>}
      </section>
    </div>

    <section className="panel">
      <div className="section-heading"><div><h2>Expenses</h2><p>{filtered.length} recorded expense{filtered.length!==1?"s":""}.</p></div>
        <select className="filter" value={category} onChange={e=>setCategory(e.target.value)}><option>All</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
      </div>
      <div className="expense-list">
        {filtered.map(e=><div className="expense-row" key={e.id}><div className="expense-dot" /><div className="expense-main"><strong>{e.title}</strong><span>{e.category} · paid by {e.paidBy}{e.note ? ` · ${e.note}` : ""}</span></div><time>{new Date(e.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</time><b>₹{Number(e.amount).toLocaleString("en-IN")}</b><button className="icon-button" title="Delete" onClick={()=>deleteExpense(id,e.id)}>×</button></div>)}
        {!filtered.length && <div className="empty">No matching expenses.</div>}
      </div>
    </section>
  </div>;
}
