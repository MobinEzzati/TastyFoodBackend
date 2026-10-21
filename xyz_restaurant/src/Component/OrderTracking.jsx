import React from "react";

function OrderTracking({ deliveryTime }) {
  return (
    <div className="tracking">
      <h2 style={{ fontSize: "18px", marginBottom: "26px" }}>Order Tracking</h2>

      <div className="tracking__row">
        <div className="tracking__step">
          <div className="tracking__icon">✅</div>
          <p className="tracking__label">Order sent to Tasty Food</p>
        </div>

        <div className="tracking__line"></div>

        <div className="tracking__step">
          <div className="tracking__icon">👨‍🍳</div>
          <p className="tracking__label">Preparing food...</p>
          <p className="tracking__time">~15 min left</p>
        </div>

        <div className="tracking__line"></div>

        <div className="tracking__step">
          <div className="tracking__icon">🍽️</div>
          <p className="tracking__label">Enjoy your meal!</p>
        </div>
      </div>

      <div className="delivery-box">
        <h3 style={{ fontSize: "14px", marginBottom: "6px" }}>📅 Delivery Info</h3>
        <p style={{ fontSize: "14px", margin: 0 }}>
          Estimated delivery: <strong>{deliveryTime || "Today at 7:30 PM"}</strong>
        </p>
      </div>
    </div>
  );
}

export default OrderTracking;
