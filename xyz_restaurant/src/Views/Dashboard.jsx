import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import logo from "../img/Logo.png";
import { useEffect } from "react";

import { toast } from "react-toastify";


function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("👋 Logged out successfully!");
    navigate("/admin");
  };


  // Reusable validator
const isValidName = (name) => /^[A-Za-z]{2,}$/.test(name);
// only allows letters, at least 2 characters long


  const validatePassword = () => {
    let errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters.";
    }

    // 🚫 Prevent using the same password again
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      errors.newPassword = "New password cannot be the same as the current password.";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // ✅ Normally you'd call your backend API here
      setPasswordSuccess(true);
    }
  };
  // Staff data
  const [staff, setStaff] = useState([]);


  // Drivers data
  const [drivers, setDrivers] = useState([]);

  // Popup states
  const [showStaffPopup, setShowStaffPopup] = useState(false);
  const [newStaff, setNewStaff] = useState({ firstName: "", lastName: "", email:""});
  const [generatedStaff, setGeneratedStaff] = useState(null);
    // Handle Change Password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [showStaffConfirm, setShowStaffConfirm] = useState(false);
  const [lastCreatedStaff, setLastCreatedStaff] = useState(null);

  const [showClientPopup, setShowClientPopup] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ firstName: "", lastName: "", number: "" });
  const [generatedClient, setGeneratedClient] = useState(null);

  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const [newDriver, setNewDriver] = useState({ firstName: "", lastName: "" ,});
  const [generatedDriver, setGeneratedDriver] = useState(null);

  // Delete popups
  const [showDeleteStaffPopup, setShowDeleteStaffPopup] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");

  const [showDeleteClientPopup, setShowDeleteClientPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  const [showDeleteDriverPopup, setShowDeleteDriverPopup] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [approvedClient, setApprovedClient] = useState(null);
  const [customers, setCustomers] = useState([]);


  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAction = (action) => {
    if (action === "Add Staff") setShowStaffPopup(true);
    else if (action === "Add Client") setShowClientPopup(true);
    else if (action === "Add Driver") setShowDriverPopup(true);
    else if (action === "Delete Staff") setShowDeleteStaffPopup(true);
    else if (action === "Delete Client") setShowDeleteClientPopup(true);
    else if (action === "Remove Driver") setShowDeleteDriverPopup(true);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/staff/all")
      .then((res) => res.json())
      .then((data) => setStaff(data))
      .catch((err) => console.error("❌ Failed to load staff:", err));

      fetch("http://localhost:8080/api/drivers/all")
    .then((res) => res.json())
    .then((data) => setDrivers(data))
    .catch((err) => console.error("❌ Failed to load drivers:", err));

    fetch("http://localhost:8080/api/customers/all")
    .then((res) => res.json())
    .then((data)=> setCustomers(data))
    .catch((err) => console.error("❌ Failed to load Customers:", err));
  }, []);

  // --- Staff ---
  const handleStaffChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  // --- Driver ---
const handleDriverChange = (e) => {
  setNewDriver({ ...newDriver, [e.target.name]: e.target.value });
};


  // inside Dashboard.js (your file)
  const generateStaffCredentials = async () => {
    const { firstName, lastName, email } = newStaff;

    if (!firstName || !lastName || !email) {
      alert("⚠️ Please enter first name, last name, and email");
      return;
    }

    if (!isValidName(firstName) || !isValidName(lastName)) {
      alert("❌ Names must contain only letters and be at least 2 characters.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/staff/create?firstName=${firstName}&lastName=${lastName}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const err = await res.text();
        alert("❌ " + err);
        return;
      }

      const staffCreated = await res.json();

      // Show credentials in popup
      setLastCreatedStaff({
        username: staffCreated.username,
        password: "(sent to email)",
      });

      // Add to UI table
      setStaff([...staff, staffCreated]);

      // Close + confirm
      setShowStaffPopup(false);
      setShowStaffConfirm(true);

      // Reset form
      setNewStaff({ firstName: "", lastName: "", email: "" });

    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };




  const handleDeleteStaff = () => {
    if (!selectedStaff) return;

    const staffToDelete = staff.find(
      (s) => s.loginCredential.username === selectedStaff
    );

    if (!staffToDelete) {
      alert("❌ Staff not found.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete staff: ${selectedStaff}?`)) {
      return;
    }

    fetch(`http://localhost:8080/api/staff/delete/${staffToDelete.staffId}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          alert("❌ Delete failed: " + err);
          return;
        }

        alert("🗑️ Staff deleted successfully!");

        setStaff(staff.filter((s) => s.staffId !== staffToDelete.staffId));
        setShowDeleteStaffPopup(false);
        setSelectedStaff("");
      })
      .catch((err) => {
        alert("🚨 Server Error");
        console.log(err);
      });
  };



  // --- Client ---
  const handleClientChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };


  const handleDeleteClient = () => {
    if (!selectedClient) return;
    if (window.confirm(`Are you sure you want to delete this client: ${selectedClient}?`)) {
      setShowDeleteClientPopup(false);
    }
  };

  const generateDriverData = async () => {
    const { firstName, lastName } = newDriver;

    if (!firstName || !lastName) {
      toast.warn("⚠️ Enter first & last name");
      return;
    }

    try {
      const url = `http://localhost:8080/api/drivers/add?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;

      const res = await fetch(url, { method: "POST" });

      if (!res.ok) {
        const errorMsg = await res.text();
        toast.error(errorMsg || "Failed to add driver.");
        return;
      }

      const driverCreated = await res.json();

      toast.success("🚀 Driver added successfully!");

      // Update UI
      setDrivers([...drivers, driverCreated]);

      // Close popup + reset
      setShowDriverPopup(false);
      setNewDriver({ firstName: "", lastName: "" });

    } catch (err) {
      console.error(err);
      toast.error("🚨 Server Error");
    }
  };

  const handleDeleteDriver = async () => {
    if (!selectedDriver) return;

    const unique = selectedDriver.trim();

    console.log("Selected:", `"${selectedDriver}"`);
    console.log("Trimmed:", `"${unique}"`);
    console.log("Available drivers:", drivers.map(d => `"${d.driverUnique}"`));

    // Find driver safely
    const driverToDelete = drivers.find(
      d => d.driverUnique.trim().toLowerCase() === unique.toLowerCase()
    );

    if (!driverToDelete) {
      toast.error("❌ Driver not found (value mismatch)");
      return;
    }

    if (!window.confirm(`Are you sure you want to remove driver: ${driverToDelete.driverUnique}?`)) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/drivers/delete/${encodeURIComponent(driverToDelete.driverUnique.trim())}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const msg = await res.text();
        toast.error("❌ Delete failed: " + msg);
        return;
      }

      // Update UI safely
      setDrivers(
        drivers.filter(
          d => d.driverUnique.trim().toLowerCase() !== unique.toLowerCase()
        )
      );

      setSelectedDriver("");
      setShowDeleteDriverPopup(false);

      toast.success("🗑️ Driver removed");

    } catch (err) {
      console.error(err);
      toast.error("🚨 Server error");
    }
  };



  const approveCustomer = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/customers/approve/${id}`, {
        method: "POST"
      });

      if (!res.ok) {
        const err = await res.text();
        toast.error("❌ Approval failed: " + err);
        return;
      }

      const updated = await res.json();

      // update UI with backend value
      setCustomers(prev =>
        prev.map(c =>
          c.customerNumber === id ? updated : c
        )
      );

      toast.success("✅ Customer approved!");
    } catch (err) {
      console.error(err);
      toast.error("🚨 Server error");
    }
  };





  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
    setPasswordSuccess(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const toggleDriverActive = async (driverUnique) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/drivers/toggle/${driverUnique}`,
        { method: "POST" }
      );

      if (!res.ok) {
        toast.error("Update failed");
        return;
      }

      const updated = await res.json();

      setDrivers(prev =>
        prev.map(d => (d.driverUnique === driverUnique ? updated : d))
      );

      toast.success("Driver updated!");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header className="panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={logo} alt="Logo" style={{ width: "46px", height: "46px", borderRadius: "50%" }} />
          <h2>Admin Panel</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontWeight: 700 }}>👤 Admin</span>
          <button
            style={{ background: "#fff", color: "var(--brand)", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 700, cursor: "pointer" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="panel-toolbar">
        <button className="btn btn-outline" onClick={() => handleAction("Add Staff")}>Add New Staff</button>
        <button className="btn btn-outline" onClick={() => handleAction("Delete Staff")}>Delete Staff</button>
        <button className="btn btn-outline" onClick={() => handleAction("Add Driver")}>Add Driver</button>
        <button className="btn btn-outline" onClick={() => handleAction("Remove Driver")}>Remove Driver</button>
      </div>

      {/* Tables */}
      <div className="panel-section">
        <div className="panel-grid">
          {/* Staff */}
          <div className="card">
            <h3 className="panel-card-title">Staff</h3>
            <div className="table-wrap scroll-x">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((user) => (
                    <tr key={user.staffId}>
                      <td>
                        <span className={`badge ${user.active ? "badge-success" : "badge-danger"}`}>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.loginCredential?.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Approval Popup */}
          {showApprovalPopup && (
            <div className="modal-overlay">
              <div className="modal-sheet" style={{ width: "400px", padding: "24px", textAlign: "center" }}>
                <h3>✅ Client Approved</h3>
                <p>
                  Email will be sent to <strong>{approvedClient?.number}</strong> with a
                  unique Frequent Eater number.
                </p>
                <button className="btn btn-primary" onClick={() => setShowApprovalPopup(false)}>OK</button>
              </div>
            </div>
          )}

          {/* Drivers */}
          <div className="card">
            <h3 className="panel-card-title">Drivers</h3>
            <div className="table-wrap scroll-x">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Status</th>
                    <th>Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.driverId}>
                      <td>{driver.firstName}</td>
                      <td>{driver.lastName}</td>
                      <td>
                        <span className={`badge ${driver.active ? "badge-success" : "badge-danger"}`}>
                          {driver.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${driver.active ? "btn-danger" : "btn-primary"}`}
                          onClick={() => toggleDriverActive(driver.driverUnique)}
                        >
                          {driver.active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "22px" }}>
          <h3 className="panel-card-title">Customers</h3>
          <div className="table-wrap scroll-x">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Delivery Address</th>
                  <th>Billing Address</th>
                  <th>Credit Card</th>
                  <th>Approve</th>
                  <th>Reward Code</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.customerNumber}>
                    <td>{c.firstName} {c.lastName}</td>
                    <td>{c.phoneNumber}</td>
                    <td>{c.email}</td>
                    <td>
                      {c.deliveryAddress
                        ? `${c.deliveryAddress.buildingName} ${c.deliveryAddress.streetNumber}, ${c.deliveryAddress.city}, ${c.deliveryAddress.state} ${c.deliveryAddress.zipCode}`
                        : "-"}
                    </td>
                    <td>
                      {c.billingAddress
                        ? `${c.billingAddress.buildingName} ${c.billingAddress.streetNumber}, ${c.billingAddress.city}, ${c.billingAddress.state} ${c.billingAddress.zipCode}`
                        : "-"}
                    </td>
                    <td>
                      {c.creditCard
                        ? `**** **** **** ${c.creditCard.cardNumber}`
                        : "No Card"}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${c.approved ? "btn-danger" : "btn-primary"}`}
                        onClick={() => approveCustomer(c.customerNumber)}
                      >
                        {c.approved ? "Revoke" : "Approve"}
                      </button>
                    </td>
                    <td>{c.rewardNumber ? <strong>{c.rewardNumber}</strong> : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Staff Popup */}
      {showStaffPopup && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ width: "400px", padding: "26px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>Add New Staff</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newStaff.firstName}
                onChange={handleStaffChange}
                className="input"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newStaff.lastName}
                onChange={handleStaffChange}
                className="input"
              />
              <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={newStaff.email}
                  onChange={handleStaffChange}
                  className="input"
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <button className="btn btn-primary" onClick={generateStaffCredentials}>Add</button>
              <button className="btn btn-outline" onClick={() => setShowStaffPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Added Confirmation Popup */}
      {showStaffConfirm && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ width: "400px", padding: "26px", textAlign: "center" }}>
            <h3>✅ Staff Added Successfully</h3>
            <p><strong>Username:</strong> {lastCreatedStaff?.username}</p>
            <p style={{ fontSize: "13px", color: "var(--muted)" }}>
              <em>Password was generated internally and not shown here, and will send to your email.</em>
            </p>
            <button className="btn btn-primary" onClick={() => setShowStaffConfirm(false)}>OK</button>
          </div>
        </div>
      )}

      {showDeleteStaffPopup && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ width: "400px", padding: "26px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>Delete Staff</h3>

            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="input"
            >
              <option value="">-- Select Staff --</option>
              {staff.map((user) => (
                <option key={user.staffId} value={user.loginCredential.username}>
                  {user.loginCredential.username}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <button className="btn btn-danger" onClick={handleDeleteStaff}>Yes</button>
              <button className="btn btn-outline" onClick={() => setShowDeleteStaffPopup(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Popup */}
      {showDriverPopup && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ width: "400px", padding: "26px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>Add New Driver</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newDriver.firstName}
                onChange={handleDriverChange}
                className="input"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newDriver.lastName}
                onChange={handleDriverChange}
                className="input"
              />
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <button className="btn btn-primary" onClick={generateDriverData}>Add</button>
              <button className="btn btn-outline" onClick={() => setShowDriverPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Change Password Popup */}
      {showChangePassword && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ width: "400px", padding: "26px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>Change Password</h3>
            {passwordSuccess ? (
              <>
                <p className="field-success">✅ Password successfully changed!</p>
                <button className="btn btn-primary" onClick={() => setShowChangePassword(false)}>Close</button>
              </>
            ) : (
              <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="input"
                />
                {passwordErrors.currentPassword && <p className="field-error">{passwordErrors.currentPassword}</p>}

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="input"
                />
                {passwordErrors.newPassword && <p className="field-error">{passwordErrors.newPassword}</p>}

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="input"
                />
                {passwordErrors.confirmPassword && <p className="field-error">{passwordErrors.confirmPassword}</p>}

                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "6px" }}>
                  <button type="submit" className="btn btn-primary">Update 🔒</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowChangePassword(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Client Popup */}
      {showDeleteClientPopup && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ width: "400px", padding: "26px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>Delete Client</h3>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="input"
            >
              <option value="">-- Select Client --</option>
            </select>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <button className="btn btn-danger" onClick={handleDeleteClient}>Yes</button>
              <button className="btn btn-outline" onClick={() => setShowDeleteClientPopup(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Driver Popup */}
      {showDeleteDriverPopup && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ width: "400px", padding: "26px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "16px" }}>Remove Driver</h3>

            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="input"
            >
              <option value="">-- Select Driver --</option>
              {drivers.map((d) => (
                <option key={d.driverId} value={d.driverUnique}>
                  {d.driverUnique.trim()}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <button className="btn btn-danger" onClick={handleDeleteDriver}>Yes</button>
              <button className="btn btn-outline" onClick={() => setShowDeleteDriverPopup(false)}>No</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
