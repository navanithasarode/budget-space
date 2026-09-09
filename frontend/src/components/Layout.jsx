import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";
import AuthModal from "./AuthModal";

export default function Layout() {
  const { mode, user, logout } = useApp();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">₹</div>

          <div>
            <strong>Budget Space</strong>
            <span>money for real life</span>
          </div>
        </div>

        <nav>
          <NavLink to="/" end>
            Overview
          </NavLink>

          <NavLink to="/budgets/new">
            + New Budget Space
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="mode-pill">
            {mode === "demo" ? "Demo mode" : "Connected"}
          </div>

          {user ? (
            <button className="text-button" onClick={logout}>
              Log out
            </button>
          ) : (
            <button
              className="text-button login-button"
              onClick={() => setShowAuth(true)}
            >
              Log in
            </button>
          )}
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}
