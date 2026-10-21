import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/Logo.png"

function StaffLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username || !password) {
      setError("⚠️ Please enter both username and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // ❌ incorrect login
      if (!res.ok || data.success === false) {
        setError("❌ " + (data.message || "Invalid credentials"));
        return;
      }

      // ✅ success
      localStorage.setItem("staffLoggedIn", "true");
      localStorage.setItem("staffUsername", data.username);
      localStorage.setItem("isAdmin", data.isAdmin);

      navigate("/staffpanel");
    } catch (err) {
      setError("🚨 Server error");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <button className="btn btn-ghost auth-back" onClick={() => navigate("/")}>← Back</button>

        <img src={logo} alt="Restaurant Logo" className="auth-logo" />
        <h2 className="auth-title">Staff Login</h2>
        <p className="auth-subtitle">Access the order management panel</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="field">
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              placeholder="Enter your username"
            />
          </div>

          <div className="field">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "13px" }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
