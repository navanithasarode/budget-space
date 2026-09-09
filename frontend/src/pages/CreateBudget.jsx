import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { types } from "../data/mockData";
import { useApp } from "../context/AppContext";

export default function CreateBudget() {
  const { addBudget } = useApp();
  const navigate = useNavigate();
  const [form,setForm] = useState({name:"",description:"",type:"Personal",budgetAmount:"",currency:"INR",startDate:"",endDate:""});
  const [health,setHealth] = useState({patientName:"",hospital:"",insuranceProvider:"",insuranceCoverage:"",claimAmount:"",approvedAmount:"",pendingAmount:"",outOfPocket:"",claimStatus:"Not claimed"});
  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.budgetAmount) return;
    const payload = { ...form, budgetAmount:Number(form.budgetAmount) };
    if (form.type==="Healthcare" || form.type==="Insurance") payload.healthcare = {
      patientName:health.patientName,hospital:health.hospital,insuranceProvider:health.insuranceProvider,
      insuranceCoverage:health.insuranceCoverage?Number(health.insuranceCoverage):0,
      claimAmount:health.claimAmount?Number(health.claimAmount):0,
      approvedAmount:health.approvedAmount?Number(health.approvedAmount):0,
      pendingAmount:health.pendingAmount?Number(health.pendingAmount):0,
      outOfPocket:health.outOfPocket?Number(health.outOfPocket):0,
      claimStatus:health.claimStatus
    };
    await addBudget(payload);
    navigate("/");
  };
  return <div className="narrow">
    <div className="breadcrumbs"><Link to="/">Overview</Link> / New Budget Space</div>
    <header className="page-header compact"><div><span className="eyebrow">New Budget Space</span><h1>What are you planning for?</h1><p>Give any real-life situation its own budget.</p></div></header>
    <form className="panel big-form" onSubmit={submit}>
      <div className="form-grid">
        <label className="wide">Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Goa Trip" /></label>
        <label className="wide">Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What is this Budget Space for?" /></label>
        <label>Type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{types.map(t=><option key={t}>{t}</option>)}</select></label>
        <label>Budget amount (₹)<input required type="number" min="0" value={form.budgetAmount} onChange={e=>setForm({...form,budgetAmount:e.target.value})} placeholder="30000" /></label>
        <label>Currency<input value={form.currency} maxLength="3" onChange={e=>setForm({...form,currency:e.target.value.toUpperCase()})} /></label>
        <label>Start date<input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} /></label>
        <label>End date<input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} /></label>
      </div>

      {(form.type==="Healthcare" || form.type==="Insurance") && <div className="special-form"><div className="section-heading"><div><h2>Optional insurance details</h2><p>Only shown because this Budget Space is relevant to healthcare/insurance.</p></div></div><div className="form-grid">
        <label>Patient/person<input value={health.patientName} onChange={e=>setHealth({...health,patientName:e.target.value})} /></label>
        <label>Hospital<input value={health.hospital} onChange={e=>setHealth({...health,hospital:e.target.value})} /></label>
        <label>Insurance provider<input value={health.insuranceProvider} onChange={e=>setHealth({...health,insuranceProvider:e.target.value})} /></label>
        <label>Coverage (₹)<input type="number" value={health.insuranceCoverage} onChange={e=>setHealth({...health,insuranceCoverage:e.target.value})} /></label>
        <label>Claim amount (₹)<input type="number" value={health.claimAmount} onChange={e=>setHealth({...health,claimAmount:e.target.value})} /></label>
        <label>Approved (₹)<input type="number" value={health.approvedAmount} onChange={e=>setHealth({...health,approvedAmount:e.target.value})} /></label>
        <label>Pending (₹)<input type="number" value={health.pendingAmount} onChange={e=>setHealth({...health,pendingAmount:e.target.value})} /></label>
        <label>Out of pocket (₹)<input type="number" value={health.outOfPocket} onChange={e=>setHealth({...health,outOfPocket:e.target.value})} /></label>
        <label>Claim status<select value={health.claimStatus} onChange={e=>setHealth({...health,claimStatus:e.target.value})}>{["Not claimed","Preparing","Submitted","Under review","Approved","Partially approved","Rejected"].map(s=><option key={s}>{s}</option>)}</select></label>
      </div></div>}

      <div className="form-actions"><Link className="secondary-button" to="/">Cancel</Link><button className="primary-button" type="submit">Create Budget Space</button></div>
    </form>
  </div>;
}
