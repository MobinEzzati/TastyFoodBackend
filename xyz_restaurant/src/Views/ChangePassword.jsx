import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const username = localStorage.getItem("staffUsername"); // logged-in user

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setMessage("⚠️ Please fill in both fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            oldPassword: currentPassword,  // 🔥 FIXED
            newPassword: newPassword,
          }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("❌ " + data.message);
        return;
      }

      setMessage("✅ Password updated successfully!");

      // Optional: logout automatically
      setTimeout(() => {
        localStorage.clear();
        navigate("/staff");
      }, 1500);
    } catch (e) {
      setMessage("🚨 Server error");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2 className="auth-title">🔑 Change Password</h2>
        <p className="auth-subtitle">Update your staff account password</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="field">
            <label className="label">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input"
            />
          </div>

          <div className="field">
            <label className="label">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
            />
          </div>

          {message && <p className={message.startsWith("✅") ? "field-success" : "field-error"}>{message}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "13px" }}>
            Update Password
          </button>
        </form>

        <button className="btn btn-ghost" style={{ marginTop: "16px" }} onClick={() => navigate("/staffpanel")}>
          ← Back
        </button>
      </div>
    </div>
  );
}
