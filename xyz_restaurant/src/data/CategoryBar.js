
import React, { useState } from "react";

function CategoryBar({ onSelectCategory }) {
    const categories = ["All", "Burger", "Chicken", "Pizza"];
    const [active, setActive] = useState("All");

    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", padding: "8px 20px 28px", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`pill${active === cat ? " is-active" : ""}`}
            onClick={() => {
              setActive(cat);
              onSelectCategory(cat.toLowerCase());
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }

  export default CategoryBar;
