import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CustomerRegister() {
  const states = ["CA", "NY", "TX", "FL", "IL", "WA", "Other"];

  const [formData, setFormData] = useState({
    firstName:"",
    lastName:"",
    deliveryPhone: "",
    email: "",

    deliveryStreet: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryZipcode: "",

    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZipcode: "",

    cardNumber: "",
    expiration: "",
    cvc: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateRegistration = () => {
    let newErrors = {};

    if (!/^[A-Za-z\s]{2,}$/.test(formData.firstName))
      newErrors.firstName = "First name must be at least 2 letters.";

    if (!/^[A-Za-z\s]{2,}$/.test(formData.lastName))
      newErrors.lastName = "Last name must be at least 2 letters.";

    const phone = formData.deliveryPhone.replace(/\D/g, "");
    if (!/^[1-9]\d{9}$/.test(phone))
      newErrors.deliveryPhone = "Phone must be 10 digits.";

    if (!formData.billingStreet) newErrors.billingStreet = "Billing street is required.";
if (!formData.billingCity) newErrors.billingCity = "Billing city is required.";
if (!formData.billingState) newErrors.billingState = "Billing state is required.";

if (!/^\d{5}$/.test(formData.billingZipcode))
  newErrors.billingZipcode = "Billing zipcode must be 5 digits.";

    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email address.";

    if (!formData.deliveryStreet) newErrors.deliveryStreet = "Street is required.";
    if (!formData.deliveryCity) newErrors.deliveryCity = "City is required.";
    if (!formData.deliveryState) newErrors.deliveryState = "State is required.";
    if (!/^\d{5}$/.test(formData.deliveryZipcode))
      newErrors.deliveryZipcode = "Zipcode must be 5 digits.";

    if (!/^[1-9]\d{15}$/.test(formData.cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits and cannot start with 0.";

    if (!formData.expiration)
      newErrors.expiration = "Expiration date is required.";
    else {
      const today = new Date();
      const exp = new Date(formData.expiration + "-01");
      if (exp < today) newErrors.expiration = "Card is expired.";
    }

    if (!/^\d{3}$/.test(formData.cvc))
      newErrors.cvc = "CVC must be 3 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegistration()) return;

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.deliveryPhone,
      email: formData.email,

      deliveryAddress: {
        street: formData.deliveryStreet,
        city: formData.deliveryCity,
        state: formData.deliveryState,
        zip: formData.deliveryZipcode,
        unit: "",
        building: ""
      },

      billingAddress: {
        street: formData.billingStreet,
        city: formData.billingCity,
        state: formData.billingState,
        zip: formData.billingZipcode,
        unit: "",
        building: ""
      },

      cardNumber: formData.cardNumber,
      expiryDate: formData.expiration,
      cvv: formData.cvc
    };

    try {
      const res = await fetch("http://localhost:8080/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        toast.error("❌ Registration failed: " + errText);
        return;
      }

      const data = await res.json();
      if (data.creditCard.verified === false) {
        toast.error("❌ Card was declined.");
        return;
      }

      // If approved:
      toast.success("🎉 Registration successful! Credit card approved!")

      // ✅ SUCCESS MESSAGE HERE
      toast.success("🎉 Registration submitted successfully!");

      // Optional small delay before redirect
      setTimeout(() => navigate("/RestaurantHome"), 1500);

    } catch (err) {
      toast.error("🚨 Server error");
      console.error(err);
    }
  };

  return (
    <div className="auth-shell" style={{ alignItems: "flex-start", paddingTop: "48px", paddingBottom: "48px" }}>
      <div className="auth-card auth-card--wide" style={{ maxWidth: "620px", textAlign: "left" }}>
        <h2 className="auth-title" style={{ textAlign: "center" }}>📝 Customer Registration</h2>
        <p className="auth-subtitle" style={{ textAlign: "center" }}>Join TastyFood and start earning rewards on every order</p>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* --- BASIC INFO --- */}
          <section>
            <h3 className="panel-card-title">Basic Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="field">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input"
                />
                {errors.firstName && <p className="field-error">{errors.firstName}</p>}
              </div>
              <div className="field">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input"
                />
                {errors.lastName && <p className="field-error">{errors.lastName}</p>}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.deliveryPhone}
                  onChange={(e) => setFormData({ ...formData, deliveryPhone: e.target.value })}
                  className="input"
                />
                {errors.deliveryPhone && <p className="field-error">{errors.deliveryPhone}</p>}
              </div>
              <div className="field">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
            </div>
          </section>

          {/* --- DELIVERY ADDRESS --- */}
          <section>
            <h3 className="panel-card-title">📦 Delivery Address</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Street"
                  value={formData.deliveryStreet}
                  onChange={(e) => setFormData({ ...formData, deliveryStreet: e.target.value })}
                  className="input"
                />
                {errors.deliveryStreet && <p className="field-error">{errors.deliveryStreet}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.deliveryCity}
                    onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                    className="input"
                  />
                  {errors.deliveryCity && <p className="field-error">{errors.deliveryCity}</p>}
                </div>
                <div className="field">
                  <select
                    value={formData.deliveryState}
                    onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value })}
                    className="input"
                  >
                    <option value="">Select State</option>
                    {states.map((s, index) => (
                      <option key={index} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.deliveryState && <p className="field-error">{errors.deliveryState}</p>}
                </div>
              </div>

              <div className="field" style={{ maxWidth: "200px" }}>
                <input
                  type="text"
                  placeholder="Zipcode"
                  value={formData.deliveryZipcode}
                  onChange={(e) => setFormData({ ...formData, deliveryZipcode: e.target.value })}
                  className="input"
                />
                {errors.deliveryZipcode && <p className="field-error">{errors.deliveryZipcode}</p>}
              </div>
            </div>
          </section>

          {/* --- BILLING ADDRESS --- */}
          <section>
            <h3 className="panel-card-title">💳 Billing Address</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder="Billing Street"
                value={formData.billingStreet}
                onChange={(e) => setFormData({ ...formData, billingStreet: e.target.value })}
                className="input"
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Billing City"
                  value={formData.billingCity}
                  onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                  className="input"
                />
                <select
                  value={formData.billingState}
                  onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
                  className="input"
                >
                  <option value="">Select State</option>
                  {states.map((s, index) => (
                    <option key={index} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Billing Zipcode"
                value={formData.billingZipcode}
                onChange={(e) => setFormData({ ...formData, billingZipcode: e.target.value })}
                className="input"
                style={{ maxWidth: "200px" }}
              />
            </div>
          </section>

          {/* --- PAYMENT --- */}
          <section>
            <h3 className="panel-card-title">💰 Payment Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="input"
                />
                {errors.cardNumber && <p className="field-error">{errors.cardNumber}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <input
                    type="month"
                    value={formData.expiration}
                    onChange={(e) => setFormData({ ...formData, expiration: e.target.value })}
                    className="input"
                  />
                  {errors.expiration && <p className="field-error">{errors.expiration}</p>}
                </div>
                <div className="field">
                  <input
                    type="text"
                    placeholder="CVC"
                    value={formData.cvc}
                    onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                    className="input"
                  />
                  {errors.cvc && <p className="field-error">{errors.cvc}</p>}
                </div>
              </div>
            </div>
          </section>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegister;
