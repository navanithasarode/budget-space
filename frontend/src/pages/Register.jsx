import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Register() {
  const { login, hasApi } = useApp();
  const nav=useNavigate(); const [form,setForm]=useState({name:"",email:"",password:""}); const [error,setError]=useState("");
  const submit=async e=>{e.preventDefault();try{await login(form,true);nav("/")}catch(err){setError(err.message)}};
  return <div className="auth-page"><div className="auth-brand">₹ <span>Budget Space</span></div><div className="auth-box"><span className="eyebrow">Start organizing</span><h1>Create your account</h1><p>{hasApi?"Your Budget Spaces will belong to your account.":"Demo mode: this will only create a local demo identity."}</p><form onSubmit={submit} className="auth-form"><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></label><label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></label><label>Password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></label>{error&&<div className="error">{error}</div>}<button className="primary-button">Create account</button></form><p className="auth-foot">Already have one? <Link to="/login">Log in</Link></p></div></div>;
}
