import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../services/orderService";
import { clearCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import PaymentModal from "../components/PaymentModal/PaymentModal";
import UpiModal from "../components/UpiModal/UpiModal";
import "./Checkout.css";

const GST_RATE  = 0.05;
const SHIP_FREE = 999;
const SHIP_FEE  = 99;

function Checkout() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email:    user?.email || "",
    phone:    "",
    address:  "",
    city:     "",
    pincode:  "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpiModal, setShowUpiModal]         = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const subtotal  = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst       = subtotal * GST_RATE;
  const shipping  = subtotal >= SHIP_FREE ? 0 : SHIP_FEE;
  const grandTotal = subtotal + gst + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const required = ["fullName", "phone", "address", "city", "pincode"];
    if (required.some((k) => !formData[k].trim())) {
      setError("Please fill in all required fields.");
      return;
    }

    // Trigger specific payment modal
    if (paymentMethod === "CARD") {
      setShowPaymentModal(true);
      return;
    }

    if (paymentMethod === "UPI") {
      setShowUpiModal(true);
      return;
    }

    await executeOrder();
  };

  const executeOrder = async () => {
    try {
      setLoading(true);
      const orderPromises = cartItems.map((item) =>
        placeOrder({
          userId:      user.id,
          productId:   item.id,
          quantity:    item.quantity,
          totalAmount: item.price * item.quantity,
          status:      "PLACED",
        })
      );
      const createdOrders = await Promise.all(orderPromises);
      dispatch(clearCart());
      toast.success("🎉 Order placed successfully!");
      navigate("/order-success", { state: { orders: createdOrders, items: cartItems } });
    } catch (err) {
      console.error("Order Placement Error:", err);
      setError(
        err.response?.data?.message ||
        "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container mt-5 mb-5">
      <div className="checkout-header mb-4">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-steps">
          <span className="step done">🛒 Cart</span>
          <span className="step-arrow">→</span>
          <span className="step active">📋 Details</span>
          <span className="step-arrow">→</span>
          <span className="step">✅ Confirm</span>
        </div>
      </div>

      <div className="row g-4">
        {/* ── LEFT: Form ── */}
        <div className="col-lg-7">
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <form onSubmit={handlePlaceOrder}>
            {/* Delivery Info */}
            <div className="checkout-section">
              <h5 className="section-heading">📦 Delivery Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="checkout-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="checkout-input"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="checkout-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="checkout-input"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="col-12">
                  <label className="checkout-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="checkout-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="checkout-label">Street Address *</label>
                  <textarea
                    name="address"
                    className="checkout-input"
                    rows="2"
                    placeholder="House no., Street, Area..."
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="col-md-8">
                  <label className="checkout-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="checkout-input"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="checkout-label">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    className="checkout-input"
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section mt-3">
              <h5 className="section-heading">💳 Payment Method</h5>
              <div className="payment-options">
                {[
                  { id: "COD",   icon: "💵", label: "Cash on Delivery",    desc: "Pay when you receive" },
                  { id: "UPI",   icon: "📱", label: "UPI / QR Code",       desc: "GPay, PhonePe, Paytm" },
                  { id: "CARD",  icon: "💳", label: "Credit / Debit Card", desc: "Visa, Mastercard, Rupay" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`payment-option ${paymentMethod === opt.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      hidden
                    />
                    <span className="payment-icon">{opt.icon}</span>
                    <div>
                      <span className="payment-label">{opt.label}</span>
                      <span className="payment-desc">{opt.desc}</span>
                    </div>
                    {paymentMethod === opt.id && <span className="payment-check">✓</span>}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 mt-4 place-order-btn"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" /> Placing Order...</>
              ) : (
                `🎉 Place Order — ₹${Math.round(grandTotal).toLocaleString()}`
              )}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div className="col-lg-5">
          <div className="checkout-summary-card">
            <h5 className="section-heading mb-3">🧾 Order Summary</h5>

            <div className="checkout-items">
              {cartItems.map((item, i) => (
                <div key={i} className="checkout-item">
                  <img src={item.image} alt={item.title} className="checkout-item-img" />
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.title}</span>
                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <hr className="checkout-divider" />

            <div className="checkout-price-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="checkout-price-row">
              <span>GST (5%)</span>
              <span>₹{Math.round(gst).toLocaleString()}</span>
            </div>
            <div className="checkout-price-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? "free-text" : ""}>
                {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
              </span>
            </div>

            <hr className="checkout-divider" />

            <div className="checkout-price-row grand-total">
              <span>Grand Total</span>
              <span>₹{Math.round(grandTotal).toLocaleString()}</span>
            </div>

            <div className="checkout-badges">
              <span>🔒 Secure Checkout</span>
              <span>🚚 Free Returns</span>
              <span>✅ Trusted Store</span>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT GATEWAY MODALS */}
      {showPaymentModal && (
        <PaymentModal
          total={Math.round(grandTotal)}
          onSuccess={() => {
            setShowPaymentModal(false);
            executeOrder();
          }}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showUpiModal && (
        <UpiModal
          total={Math.round(grandTotal)}
          onSuccess={() => {
            setShowUpiModal(false);
            executeOrder();
          }}
          onClose={() => setShowUpiModal(false)}
        />
      )}
    </div>
  );
}

export default Checkout;