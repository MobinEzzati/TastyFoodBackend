import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerLogin() {
  const [uniqueId, setUniqueId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Login Validation
  const validateCustomerLogin = () => {
    let newErrors = {};
    if (!uniqueId || uniqueId.trim().length < 5) {
      newErrors.uniqueId = "Unique number must be at least 5 characters.";
    }
    setError(newErrors.uniqueId || "");
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateCustomerLogin()) return;
    localStorage.setItem("customerId", uniqueId);
    navigate("/"); // back to home
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <button className="btn btn-ghost auth-back" onClick={() => navigate("/")}>← Back</button>
        <h2 className="auth-title">👤 Customer Login</h2>
        <p className="auth-subtitle">Sign in with your frequent eater number</p>

        <form onSubmit={handleLogin} className="field" style={{ gap: "14px" }}>
          <input
            type="text"
            placeholder="Enter Unique Number"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            className="input"
          />
          {error && <p className="field-error">{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "13px" }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: "18px", fontSize: "14px", color: "var(--ink-soft)" }}>
          New user?{" "}
          <span
            style={{ color: "var(--brand)", cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/customerregister")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default CustomerLogin;
