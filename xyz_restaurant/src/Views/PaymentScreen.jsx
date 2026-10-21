import React, { useState } from "react";
import OrderTracking from "../Component/OrderTracking.jsx";
import axios from "axios";

// ✅ Import logos
import mastercardLogo from "../img/MasterCard.png";
import visaLogo from "../img/visaLogo.png";
import paypalLogo from "../img/paypalLogo.png";
import discoverLogo from "../img/discoverLogo.png";

function PaymentScreen({ onClose, cartItems }) {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // 🔑 Frequent Eater code UI state
  const [customerCode, setCustomerCode] = useState("");
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [usedDiscount, setUsedDiscount] = useState(false); // UI flag for discount applied
  const [customerName, setCustomerName] = useState(null);  // just to show in success screen later
  const [skipPaymentMethod, setSkipPaymentMethod] = useState(false);


  const [formData, setFormData] = useState({
    deliveryFirstName: "",
    deliveryLastName: "",
    deliveryPhone: "",
    deliveryStreet: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryZipcode: "",
    cardNumber: "",
    firstName: "",
    lastName: "",
    expiration: "",
    cvc: "",
    buildingNumber: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState({});

  const states = ["CA", "NY", "TX", "FL", "IL", "MA", "MN" ,"Other"];
  const paymentMethods = [
    { name: "MasterCard", logo: mastercardLogo },
    { name: "Visa", logo: visaLogo },
    { name: "PayPal", logo: paypalLogo },
    { name: "Discover", logo: discoverLogo },
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addMinutes = (date, mins) =>
    new Date(new Date(date).getTime() + mins * 60000);

  // ✅ Delivery validation
  const validateDelivery = () => {
    let newErrors = {};
    if (!/^[A-Za-z]{2,}$/.test(formData.deliveryFirstName))
      newErrors.deliveryFirstName = "First name must be at least 2 letters.";
    if (!/^[A-Za-z]{2,}$/.test(formData.deliveryLastName))
      newErrors.deliveryLastName = "Last name must be at least 2 letters.";
    const phone = formData.deliveryPhone.replace(/\D/g, "");
    if (!/^[1-9]\d{9}$/.test(phone))
      newErrors.deliveryPhone = "Phone must be 10 digits.";
    if (!formData.deliveryStreet)
      newErrors.deliveryStreet = "Street is required.";
    if (!formData.deliveryCity) newErrors.deliveryCity = "City is required.";
    if (!formData.deliveryState) newErrors.deliveryState = "State is required.";
    if (!/^\d{5}$/.test(formData.deliveryZipcode))
      newErrors.deliveryZipcode = "Zipcode must be 5 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitDelivery = (e) => {
    e.preventDefault();
    if (validateDelivery()) setStep(2);
  };

  // ✅ Payment validation
  const validatePayment = () => {
    let newErrors = {};
    if (!/^[1-9]\d{15}$/.test(formData.cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^[A-Za-z]{2,}$/.test(formData.firstName))
      newErrors.firstName = "First name must be at least 2 letters.";
    if (!/^[A-Za-z]{2,}$/.test(formData.lastName))
      newErrors.lastName = "Last name must be at least 2 letters.";
    if (!formData.expiration) {
      newErrors.expiration = "Expiration date is required.";
    } else {
      const today = new Date();
      const exp = new Date(formData.expiration + "-01");
      if (exp < today) newErrors.expiration = "Card is expired.";
    }
    if (!/^\d{3}$/.test(formData.cvc))
      newErrors.cvc = "CVC must be 3 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔄 UI-only: pretend to send order, same as before
  const handleSubmitPayment = (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      alert("⚠️ Add items before placing order.");
      return;
    }

    if (validatePayment()) {
      const orderRequest = {
        customerName: `${formData.deliveryFirstName} ${formData.deliveryLastName}`,
        customerPhone: formData.deliveryPhone,
        tipAmount: formData.tipAmount,

        deliveryAddress: {
          streetNumber: formData.buildingNumber,
          unitNumber: "",
          buildingName: "",
          city: formData.deliveryCity,
          state: formData.deliveryState,
          zipCode: formData.deliveryZipcode,
          country: "USA",
        },

        items: cartItems.map((item) => ({
          menuItemId: item.itemId, // MUST be itemId from backend
          quantity: item.qty,
        })),
      };

      console.log("REQ:", orderRequest);

      axios
        .post("http://localhost:8080/api/orders/create", orderRequest)
        .then((res) => {
          console.log("Order created:", res.data);
          setLastOrder(res.data);
          setCustomerName(orderRequest.customerName);
          setStep(3);
        })
        .catch((err) => {
          console.error("Order error:", err);
          alert("Order failed to save. Check backend logs.");
        });
    }
  };

  const fetchCustomerByCode = async () => {
    if (!customerCode.trim()) return;

    setLoadingCustomer(true);
    setErrors({});

    try {
      // 1️⃣ Fetch customer by unique code
      const customerRes = await axios.get(
        `http://localhost:8080/api/customers/code/${customerCode.trim()}`
      );

      const customer = customerRes.data;
      console.log("Fetched customer:", customer);

      if (!customer.approved) {
        alert("❌ This customer is not approved yet.");
        setLoadingCustomer(false);
        return;
      }

      // 2️⃣ Autofill delivery info from customer
      setFormData((prev) => ({
        ...prev,
        deliveryFirstName: customer.firstName,
        deliveryLastName: customer.lastName,
        deliveryPhone: customer.phoneNumber,
        deliveryStreet: customer.deliveryAddress?.streetNumber || "",
        deliveryCity: customer.deliveryAddress?.city || "",
        deliveryState: customer.deliveryAddress?.state || "",
        deliveryZipcode: customer.deliveryAddress?.zipCode || ""
      }));

      // ⭐ Save name for success screen
      setCustomerName(`${customer.firstName} ${customer.lastName}`);

      // 3️⃣ Fetch saved credit card (if exists)
      try {
        const cardRes = await axios.get(
          `http://localhost:8080/api/cards/customer/${customer.customerNumber}`
        );

        const card = cardRes.data;
        console.log("Fetched saved card:", card);

        // Autofill billing + card info
        setFormData((prev) => ({
          ...prev,
          firstName: customer.firstName,
          lastName: customer.lastName,
          cardNumber: card.cardNumber,
          expiration: card.expiryDate,   // must be yyyy-MM format
          cvc: card.cvv,
          buildingNumber: customer.deliveryAddress?.streetNumber || "",
          street: customer.deliveryAddress?.street || "",
          city: customer.deliveryAddress?.city || "",
          state: customer.deliveryAddress?.state || "",
          zipcode: customer.deliveryAddress?.zipCode || "",
        }));

        // Skip payment method selection since card is saved
        setSkipPaymentMethod(true);
        setSelectedMethod("Saved Card");

      } catch (cardErr) {
        console.log("No saved card for this customer.");
        setSkipPaymentMethod(false);
      }

      // 4️⃣ Discount UI flag (backend will compute real discount)
      if (customer.points >= 100) {
        setUsedDiscount(true);
        alert("🎉 You have 100+ points! A 10% discount will be applied.");
      } else {
        setUsedDiscount(false);
      }

    } catch (err) {
      alert("❌ Customer not found for this code.");
      console.error(err);
      setUsedDiscount(false);
    }

    setLoadingCustomer(false);
  };



  // 📊 For success screen: compute bill & points (UI only)
  const billBeforeCharges = cartItems?.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  ) || 0;
  const pointsEarnedThisOrder = Math.floor(billBeforeCharges); // 1 point per dollar (UI-only)

  // ✅ Success screen
  if (step === 3 && lastOrder) {
    const orderDate = new Date(lastOrder.orderDateTime).toLocaleString();
    const eta = addMinutes(lastOrder.orderDateTime, 30).toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    );

    return (
      <div className="modal-overlay">
        <div className="modal-sheet" style={{ width: "520px", maxWidth: "100%", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "18px" }}>🎉 Order Placed Successfully!</h2>

          <div className="card" style={{ padding: "16px 18px", marginBottom: "18px", background: "#faf7f5" }}>
            {customerName && (
              <p style={{ margin: "4px 0" }}><strong>Customer:</strong> {customerName}</p>
            )}
            <p style={{ margin: "4px 0" }}><strong>Order ID:</strong> {lastOrder.orderId}</p>
            <p style={{ margin: "4px 0" }}><strong>Order Date & Time:</strong> {orderDate}</p>
            <p style={{ margin: "4px 0" }}><strong>Estimated Delivery Time:</strong> {eta}</p>
          </div>

          <h3 className="panel-card-title">Reward Summary</h3>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Bill before service & tip:</strong> ${billBeforeCharges.toFixed(2)}
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Points earned this order:</strong> {pointsEarnedThisOrder} pts
          </p>
          <p style={{ margin: "4px 0 18px", fontSize: "14px" }}>
            <strong>Discount applied:</strong>{" "}
            {usedDiscount ? (
              <span className="badge badge-success">10% discount</span>
            ) : (
              "None this order"
            )}
          </p>

          <OrderTracking deliveryTime={eta} />

          <button className="btn btn-primary" style={{ width: "100%", marginTop: "20px", padding: "13px" }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // 🧾 Main modal (steps 1 & 2)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        style={{ width: "520px", maxWidth: "100%", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Steps */}
        <div className="step-indicator">
          <div className={`step-indicator__item${step >= 1 ? " is-active" : ""}`}>1. Delivery</div>
          <div className={`step-indicator__item${step >= 2 ? " is-active" : ""}`}>2. Payment</div>
          <div className={`step-indicator__item${step >= 3 ? " is-active" : ""}`}>3. Success</div>
        </div>

        {/* Step 1: Delivery + Frequent Eater Number section */}
        {step === 1 && (
          <>
            {/* Frequent Eater Box (UI) */}
            <div className="frequent-eater">
              <h3 style={{ fontSize: "14.5px", marginBottom: "10px" }}>Have a Frequent Eater Number?</h3>

              <input
                type="text"
                placeholder="Enter your unique code (e.g. FE1234)"
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
                className="input"
                style={{ marginBottom: "10px" }}
              />

              <button
                className="btn btn-primary btn-sm"
                onClick={fetchCustomerByCode}
                disabled={!customerCode || loadingCustomer}
              >
                {loadingCustomer ? "Loading..." : "Autofill My Info"}
              </button>

              {usedDiscount && (
                <p className="field-success" style={{ marginTop: "8px" }}>
                  ✅ Discount will be applied for this order.
                </p>
              )}
            </div>

            <h2 style={{ textAlign: "center", marginBottom: "16px", fontSize: "19px" }}>Delivery Address</h2>
            <form style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={handleSubmitDelivery}>
              <div className="field">
                <input
                  className="input"
                  name="deliveryFirstName"
                  placeholder="First Name"
                  value={formData.deliveryFirstName}
                  onChange={handleChange}
                />
                {errors.deliveryFirstName && <p className="field-error">{errors.deliveryFirstName}</p>}
              </div>

              <div className="field">
                <input
                  className="input"
                  name="deliveryLastName"
                  placeholder="Last Name"
                  value={formData.deliveryLastName}
                  onChange={handleChange}
                />
                {errors.deliveryLastName && <p className="field-error">{errors.deliveryLastName}</p>}
              </div>

              <div className="field">
                <input
                  className="input"
                  name="deliveryPhone"
                  placeholder="Phone"
                  value={formData.deliveryPhone}
                  onChange={handleChange}
                />
                {errors.deliveryPhone && <p className="field-error">{errors.deliveryPhone}</p>}
              </div>

              <div className="field">
                <input
                  className="input"
                  name="deliveryStreet"
                  placeholder="Street"
                  value={formData.deliveryStreet}
                  onChange={handleChange}
                />
                {errors.deliveryStreet && <p className="field-error">{errors.deliveryStreet}</p>}
              </div>

              <div className="field">
                <input
                  className="input"
                  name="buildingNumber"
                  placeholder="Building Number"
                  value={formData.buildingNumber}
                  onChange={handleChange}
                />
                {errors.buildingNumber && <p className="field-error">{errors.buildingNumber}</p>}
              </div>

              <div className="field">
                <input
                  className="input"
                  name="deliveryCity"
                  placeholder="City"
                  value={formData.deliveryCity}
                  onChange={handleChange}
                />
                {errors.deliveryCity && <p className="field-error">{errors.deliveryCity}</p>}
              </div>

              <div className="field">
                <select
                  className="input"
                  name="deliveryState"
                  value={formData.deliveryState}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.deliveryState && <p className="field-error">{errors.deliveryState}</p>}
              </div>

              <div className="field">
                <input
                  className="input"
                  name="deliveryZipcode"
                  placeholder="Zipcode"
                  value={formData.deliveryZipcode}
                  onChange={handleChange}
                />
                {errors.deliveryZipcode && <p className="field-error">{errors.deliveryZipcode}</p>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "13px", marginTop: "6px" }}>
                Continue to Payment ➡️
              </button>
            </form>
          </>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <>
            {(!selectedMethod && !skipPaymentMethod) ? (
              <>
                <h2 style={{ textAlign: "center", marginBottom: "16px", fontSize: "19px" }}>Select Payment Method</h2>
                <div className="payment-methods">
                  {paymentMethods.map((m) => {
                    const isSelected = selectedMethod === m.name;
                    return (
                      <div
                        key={m.name}
                        className={`payment-method${isSelected ? " is-selected" : ""}`}
                        onMouseEnter={() => setHoveredMethod(m.name)}
                        onMouseLeave={() => setHoveredMethod(null)}
                        onClick={() => setSelectedMethod(m.name)}
                      >
                        <img src={m.logo} alt={m.name} />
                        <span>{m.name}</span>
                      </div>
                    );
                  })}
                </div>
                <button type="button" className="btn btn-outline" style={{ marginTop: "18px" }} onClick={() => setStep(1)}>
                  ⬅ Back
                </button>
              </>
            ) : (
              <>
                <h2 style={{ textAlign: "center", marginBottom: "16px", fontSize: "19px" }}>{selectedMethod} Payment Info</h2>
                <form style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={handleSubmitPayment}>
                  <div className="field">
                    <input
                      className="input"
                      name="cardNumber"
                      placeholder="Card Number (16 digits)"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                    {errors.cardNumber && <p className="field-error">{errors.cardNumber}</p>}
                  </div>

                  <div className="field">
                    <input
                      className="input"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <p className="field-error">{errors.firstName}</p>}
                  </div>

                  <div className="field">
                    <input
                      className="input"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <p className="field-error">{errors.lastName}</p>}
                  </div>

                  <div className="field">
                    <label htmlFor="expiration" className="label">Exp. Month/Year</label>
                    <input
                      id="expiration"
                      className="input"
                      type="month"
                      name="expiration"
                      value={formData.expiration}
                      onChange={handleChange}
                    />
                    {errors.expiration && <p className="field-error">{errors.expiration}</p>}
                  </div>

                  <div className="field">
                    <input
                      className="input"
                      name="cvc"
                      placeholder="CVC"
                      value={formData.cvc}
                      onChange={handleChange}
                    />
                    {errors.cvc && <p className="field-error">{errors.cvc}</p>}
                  </div>

                  <h3 className="panel-card-title" style={{ marginTop: "8px" }}>Billing Address</h3>

                  <input
                    className="input"
                    name="street"
                    placeholder="Street"
                    value={formData.street}
                    onChange={handleChange}
                  />

                  <input
                    className="input"
                    name="buildingNumber"
                    placeholder="Building Number"
                    value={formData.buildingNumber}
                    onChange={handleChange}
                  />

                  <input
                    className="input"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />

                  <select
                    className="input"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  >
                    <option value="">Select State</option>
                    {["CA", "NY", "TX", "FL", "IL", "MA","MN", "Other"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>

                  <input
                    className="input"
                    name="zipcode"
                    placeholder="Zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "10px" }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                      ⬅ Back
                    </button>

                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Pay Now 💳
                    </button>
                  </div>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentScreen;
