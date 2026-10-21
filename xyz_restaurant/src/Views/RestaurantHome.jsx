import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import foodData from "../data/foodData";
import CategoryBar from "../data/CategoryBar";
import MenuCard from "../Component/MenuCard"
import FoodModal from "../Component/FoodModal";
import CartDrawer from "../Component/CartDrawer";
import PaymentScreen from "../Views/PaymentScreen";
import logo from "../img/Logo.png"

function RestaurantHome() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);


  const filteredData =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);


      useEffect(() => {
        axios.get("http://localhost:8080/api/menu/all")
          .then(response => {
            console.log("Menu API response:", response.data);   // 👈 print here
            setMenuItems(response.data);   // store backend menu data
          })
          .catch(error => {
            console.error("Error fetching menu:", error);
          });
      }, []);

  const handleAddToCart = (item, qty) => {
    setCartCount(cartCount + qty);
    setCartItems((prev) => {
      const existing = prev.find((p) => p.name === item.name);
      if (existing) {
        return prev.map((p) =>
          p.name === item.name ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const handleRemoveItem = (title) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.name === title ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
    setCartCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div>
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar__actions">
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/customerRegister")}>
            Customer Registration
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/admin")}>
            Admin Login
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/staff")}>
            Staff Login
          </button>
        </div>

        <div className="topbar__brand">
          <img src={logo} alt="TastyFood Logo" />
          <h1>TastyFood Restaurant</h1>
        </div>

        <div className="topbar__cart">
          <button className="cart-button" onClick={() => setIsCartOpen(true)} aria-label="Open cart">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      {/* Category bar */}
      <div style={{ paddingTop: "24px" }}>
        <CategoryBar onSelectCategory={setSelectedCategory} />
      </div>

      {/* Food items */}
      {filteredData.length === 0 ? (
        <p className="menu-empty">No menu items in this category yet.</p>
      ) : (
        <div className="menu-grid">
          {filteredData.map((item, i) => (
            <MenuCard key={i} item={item} onSelect={setSelectedFood} />
          ))}
        </div>
      )}

      {/* Popup modal */}
      {selectedFood && (
        <FoodModal
          item={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Payment screen */}
      {isPaymentOpen && (
  <PaymentScreen
   // ✅ pass order items
    onClose={() => {
      setIsPaymentOpen(false);
      setCartItems([]);   // ✅ clear cart after payment
      setCartCount(0);    // ✅ reset cart badge
    }}

    cartItems={cartItems}
  />
)


      }
    </div>
  );
}

export default RestaurantHome;
