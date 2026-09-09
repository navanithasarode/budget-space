import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login, hasApi } = useApp();
  const nav=useNavigate(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  const submit=async e=>{e.preventDefault();try{await login({email,password});nav("/")}catch(err){setError(err.message)}};
  return <AuthShell title="Welcome back" subtitle={hasApi?"Log in to your Budget Space account.":"Demo mode is active. You can explore without an account."}>
    <form onSubmit={submit} className="auth-form"><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>{error&&<div className="error">{error}</div>}<button className="primary-button">Log in</button></form>
    <p className="auth-foot">No account? <Link to="/register">Create one</Link></p>
  </AuthShell>;
}
function AuthShell({title,subtitle,children}){return <div className="auth-page"><div className="auth-brand">₹ <span>Budget Space</span></div><div className="auth-box"><span className="eyebrow">Your money, your situations</span><h1>{title}</h1><p>{subtitle}</p>{children}</div></div>}
