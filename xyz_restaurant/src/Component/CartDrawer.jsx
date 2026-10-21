import React, { useState } from "react";

function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onPlaceOrder }) {
  const [tip, setTip] = useState(0);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const serviceCharge = subtotal * 0.08;
  const total = subtotal + serviceCharge + tip;

  const handleTipPercent = (percent) => {
    setTip((subtotal * percent) / 100);
  };

  const handlePlaceOrder = () => {
    onPlaceOrder();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: "19px", marginBottom: "4px" }}>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p style={{ color: "var(--muted)", marginTop: "40px", textAlign: "center" }}>Your cart is empty</p>
        ) : (
          <>
            <div style={{ margin: "14px 0", flex: 1 }}>
              {cartItems.map((item, i) => (
                <div key={i} className="cart-item">
                  <span className="cart-item__name">
                    {item.name} <span style={{ color: "var(--muted)", fontWeight: 500 }}>×{item.qty}</span>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                    <button
                      onClick={() => onRemoveItem(item.name)}
                      className="btn-ghost"
                      style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "15px", padding: "4px" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="cart-row">
              <span>Service Charge (8%)</span>
              <span>${serviceCharge.toFixed(2)}</span>
            </div>

            <div style={{ marginTop: "16px" }}>
              <strong style={{ fontSize: "13.5px" }}>Add a tip</strong>
              <div className="tip-row">
                <button className="pill" style={{ flex: 1, padding: "8px" }} onClick={() => handleTipPercent(5)}>5%</button>
                <button className="pill" style={{ flex: 1, padding: "8px" }} onClick={() => handleTipPercent(10)}>10%</button>
                <button className="pill" style={{ flex: 1, padding: "8px" }} onClick={() => handleTipPercent(15)}>15%</button>
              </div>
              <input
                type="number"
                placeholder="Custom tip amount"
                value={tip}
                onChange={(e) => setTip(Number(e.target.value))}
                className="input"
                style={{ marginTop: "10px" }}
              />
            </div>

            <div className="cart-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </>
        )}

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "16px" }}>
          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: "13px" }}
            disabled={cartItems.length === 0}
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
