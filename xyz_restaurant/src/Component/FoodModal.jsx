import React, { useState } from "react";

function FoodModal({ item, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!item) return null; // no food selected

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        style={{ width: "420px", maxWidth: "100%", padding: "28px", textAlign: "center", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>
        <img
          src={item.image_url}
          alt={item.name}
          style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "var(--radius-sm)", marginBottom: "16px" }}
        />
        <h2 style={{ fontSize: "20px", marginBottom: "6px" }}>{item.name}</h2>
        <p style={{ color: "var(--ink-soft)", fontSize: "14px", marginBottom: "10px" }}>{item.description}</p>
        <p style={{ fontSize: "13.5px", color: "var(--muted)" }}><strong style={{ color: "var(--ink)" }}>Calories:</strong> 520 kcal &nbsp;·&nbsp; <strong style={{ color: "var(--ink)" }}>Popularity:</strong> 87%</p>

        <div className="qty-stepper" style={{ margin: "22px 0" }}>
          <button onClick={decrease} className="qty-btn">−</button>
          <span className="qty-value">{quantity}</span>
          <button onClick={increase} className="qty-btn">+</button>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: "15px" }}
          onClick={() => {
            onAddToCart(item, quantity);
            onClose();
          }}
        >
          Add {quantity} to Cart · ${(quantity * item.price).toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export default FoodModal;
