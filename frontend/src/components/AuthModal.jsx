import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function AuthModal() {
  const { login } = useApp();

  const [signup, setSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        {
          name,
          email,
          password,
        },
        signup
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setSignup(!signup);
    setError("");
  }

  return (
    <div className="auth-screen">
      <div className="auth-brand">
        <div className="brand-mark">₹</div>

        <div>
          <strong>Budget Space</strong>
          <span>money for real life</span>
        </div>
      </div>

      <div className="auth-modal">
        <div className="auth-modal-icon">₹</div>

        <span className="eyebrow">
          {signup ? "Start organizing" : "Welcome back"}
        </span>

        <h2>
          {signup
            ? "Create your account"
            : "Welcome to Budget Space"}
        </h2>

        <p className="auth-modal-subtitle">
          {signup
            ? "Create an account to start building your Budget Space."
            : "Log in to organize your money, plans and real-life situations."}
        </p>

        <form onSubmit={submit} className="auth-form">

          {signup && (
            <label>
              Name

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <div className="password-box">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    minLength="6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
        </label>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : signup
              ? "Create account"
              : "Log in"}
          </button>
        </form>

        <p className="auth-foot">
          {signup
            ? "Already have an account?"
            : "Don't have an account?"}

          {" "}

          <button
            type="button"
            className="auth-switch"
            onClick={switchMode}
          >
            {signup ? "Log in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}