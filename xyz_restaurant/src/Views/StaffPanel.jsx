import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STATUSES = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  DELIVERED: "DELIVERED",
};



const fmtMoney = (n) => {
  if (n == null || isNaN(n)) return "$0.00";
  return `$${Number(n).toFixed(2)}`;
};

const fmtDateTime = (d) =>
  new Date(d).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function StaffPanel() {
  const navigate = useNavigate();



  const [filter, setFilter] = useState(STATUSES.PENDING);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);


  // ✅ Staff name from localStorage
  const [staffName, setStaffName] = useState("");

  const filtered = useMemo(() => {
    if (filter === "All") return orders;
    return orders.filter((o) => o.orderStatus === filter);
  }, [orders, filter]);



  useEffect(() => {
    // 1️⃣ Load orders from backend
    fetch("http://localhost:8080/api/orders/all")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(o => ({
          id: o.orderId,
          customerName: o.customerName,
          orderDateTime: o.orderDateTime,
          eta: o.eta,

          // address object from backend
          deliveryAddress: o.deliveryAddress,

          // 2️⃣ Fix: properly convert orderItems to readable format
          items: (o.orderItems || []).map(item => ({
            name: item.menuItem.name,
            qty: item.quantity,
            subtotal: item.subtotal
          })),

          total: o.grandTotal,
          driver: o.driver,
          orderStatus: o.orderStatus,
          deliveredAt: o.deliveredAt
        }));

        setOrders(mapped);
      })
      .catch(err => console.error("Failed to load orders", err));

      fetch("http://localhost:8080/api/drivers/all")
      .then(res => res.json())
      .then(data => {
        const activeDrivers = data.filter(d => d.active === true);
        setDrivers(activeDrivers);
      })
      .catch(err => console.error("Failed to load drivers", err));

    // 2️⃣ Load staff username from localStorage
    const username = localStorage.getItem("staffUsername");
    if (username) setStaffName(username);

  }, []);



  useEffect(() => {
    console.log("Drivers updated:", drivers);
  }, [drivers]);


  const assignDriver = (orderId, driverId) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/assignDriver?driverId=${driverId}`, {
      method: "POST",
    })
      .then(res => res.text())
      .then(() => {
        const assigned = drivers.find(d => d.driverId === Number(driverId));

        setOrders(prev =>
          prev.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  driver: assigned,
                  orderStatus: STATUSES.ASSIGNED
                }
              : o
          )
        );
      })
      .catch(err => console.error("Driver assign error:", err));
  };


  const markDelivered = (orderId) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/deliver`, {
      method: "POST",
    })
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, orderStatus: STATUSES.DELIVERED, deliveredAt: new Date().toISOString() }
              : o
          )
        );
      })
      .catch((err) => console.error("Delivery error:", err));
  };

  const handleLogout = async () => {
    const username = localStorage.getItem("staffUsername");

  if (username) {
    await fetch(`http://localhost:8080/api/auth/logout?username=${username}`, {
      method: "POST"
    });
  }

  localStorage.removeItem("staffLoggedIn");
  localStorage.removeItem("staffUsername");
  localStorage.removeItem("isAdmin");

  navigate("/staff");
  };

  const handleChangePassword = () => {
    console.log("going to change Password")
    navigate("/change-password");
  };

  const tabs = [
    { key: STATUSES.PENDING, label: "Incoming Orders" },
    { key: STATUSES.ASSIGNED, label: "Assigned Driver" },
    { key: STATUSES.DELIVERED, label: "Delivered" },
    { key: "All", label: "All" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header className="staff-header">
        <div>
          <h2 style={{ margin: 0, fontSize: "20px" }}>📦 Staff Panel — Orders</h2>
          <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--brand)", marginTop: "4px" }}>
            ⚡ Assign drivers and mark orders delivered.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 600, color: "var(--ink-soft)" }}>👤 {staffName}</span>
          <button onClick={handleChangePassword} className="btn btn-outline btn-sm">🔑 Change Password</button>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">🚪 Logout</button>
        </div>
      </header>

      {/* ✅ Filters (Incoming → Delivered → All) */}
      <div className="tabs-row">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`pill${filter === t.key ? " is-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="panel-section">
        <div className="card table-wrap scroll-x">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Placed</th>
                <th>ETA</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Driver</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "var(--muted)", padding: "28px" }}>
                    No orders in this view yet.
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{fmtDateTime(o.orderDateTime)}</td>
                <td>{o.eta ? fmtDateTime(o.eta) : "—"}</td>
                <td>{o.customerName}</td>
                <td>{o.items.map(i => `${i.name} x${i.qty}`).join(", ")}</td>
                <td style={{ fontWeight: 700 }}>{fmtMoney(o.total)}</td>

                <td>
          {o.orderStatus === STATUSES.PENDING ? (
            <select
              onChange={(e) => assignDriver(o.id, e.target.value)}
              className="input"
              style={{ padding: "6px 8px", fontSize: "13px" }}
              defaultValue=""
            >
              <option value="" disabled>Assign Driver</option>
              {drivers.map(d => (
                 <option key={d.driverId} value={d.driverId}>
                 {d.firstName} {d.lastName}
               </option>
             ))}
            </select>
        ) : (
            <span>{o.driver ? o.driver.firstName : "—"}</span>
        )}
          </td>

                <td>
                  <span className={`badge ${o.orderStatus === STATUSES.DELIVERED ? "badge-success" : o.orderStatus === STATUSES.ASSIGNED ? "badge-neutral" : "badge-danger"}`}>
                    {o.orderStatus}
                  </span>
                </td>

                <td style={{ textAlign: "right" }}>
                  {o.orderStatus !== STATUSES.DELIVERED ? (
                    <button className="btn btn-primary btn-sm" onClick={() => markDelivered(o.id)}>
                      Mark Delivered
                    </button>
                  ) : (
                    <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: "1.4" }}>
                      ✅ Delivered<br />
                      <span style={{ fontStyle: "italic" }}>{fmtDateTime(o.deliveredAt)}</span>
                    </div>
                  )}
                </td>
              </tr>

              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
