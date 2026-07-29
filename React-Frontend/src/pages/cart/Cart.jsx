import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../../features/cart/cartSlice";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VALID_COUPONS = {
  SMART20: { discount: 0.20, label: "20% OFF" },
  SAVE10:  { discount: 0.10, label: "10% OFF" },
  FLAT500: { discount: 500,  label: "₹500 OFF", flat: true },
};

const GST_RATE  = 0.05;
const SHIP_FREE = 999;
const SHIP_FEE  = 99;

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [couponInput, setCouponInput]     = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError]     = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  let discountAmt = 0;
  if (appliedCoupon) {
    const coupon = VALID_COUPONS[appliedCoupon];
    discountAmt = coupon.flat ? coupon.discount : subtotal * coupon.discount;
  }

  const afterDiscount = Math.max(0, subtotal - discountAmt);
  const gst           = afterDiscount * GST_RATE;
  const shipping      = afterDiscount >= SHIP_FREE ? 0 : SHIP_FEE;
  const grandTotal    = afterDiscount + gst + shipping;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
      toast.success(`🎉 Coupon "${code}" applied — ${VALID_COUPONS[code].label}!`);
    } else {
      setCouponError("Invalid coupon. Try SMART20, SAVE10, or FLAT500.");
      setAppliedCoupon(null);
      toast.error("❌ Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    toast.info("Coupon removed.");
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="cart-page-title mb-4">🛒 Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart-state text-center py-5">
          <div className="empty-cart-icon">🛍️</div>
          <h4 className="mt-3">Your cart is empty</h4>
          <p className="text-muted">Add some products to get started!</p>
          <Link to="/" className="btn btn-primary mt-2">Browse Products</Link>
        </div>
      ) : (
        <div className="row g-4">

          {/* ── LEFT: Cart Items ── */}
          <div className="col-lg-8">
            {cartItems.map((item, index) => (
              <div key={index} className="card p-3 mb-3 cart-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <img src={item.image} alt={item.title} className="cart-image" />
                    <div>
                      <h6 className="mb-1 fw-bold">{item.title}</h6>
                      <p className="mb-2 text-muted" style={{ fontSize: "0.85rem" }}>
                        ₹ {item.price.toLocaleString()} × {item.quantity}
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => dispatch(decrementQuantity(item.id))}
                        >−</button>
                        <span className="fw-bold px-2">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => dispatch(incrementQuantity(item.id))}
                        >+</button>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>
                      ₹ {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        toast.warn(`🗑️ ${item.title} removed from cart.`);
                        dispatch(removeFromCart(index));
                      }}
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="col-lg-4">
            <div className="card total-card">

              <h5 className="summary-title mb-3">Order Summary</h5>

              {/* Coupon */}
              <div className="coupon-section mb-3">
                <label className="coupon-label mb-1">🎟️ Promo Code</label>
                {appliedCoupon ? (
                  <div className="coupon-applied">
                    <span>
                      <strong>{appliedCoupon}</strong> — {VALID_COUPONS[appliedCoupon].label}
                    </span>
                    <button className="coupon-remove-btn" onClick={handleRemoveCoupon}>✕</button>
                  </div>
                ) : (
                  <>
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control coupon-input"
                        placeholder="e.g. SMART20"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <button className="btn coupon-apply-btn" onClick={handleApplyCoupon}>
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="coupon-error mt-1">{couponError}</p>}
                  </>
                )}
              </div>

              <hr className="summary-divider" />

              {/* Price rows */}
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹ {subtotal.toLocaleString()}</span>
              </div>

              {appliedCoupon && (
                <div className="price-row discount-row">
                  <span>Discount ({VALID_COUPONS[appliedCoupon].label})</span>
                  <span>− ₹ {Math.round(discountAmt).toLocaleString()}</span>
                </div>
              )}

              <div className="price-row">
                <span>GST (5%)</span>
                <span>₹ {Math.round(gst).toLocaleString()}</span>
              </div>

              <div className="price-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-ship" : ""}>
                  {shipping === 0 ? "FREE 🎉" : `₹ ${shipping}`}
                </span>
              </div>

              {shipping !== 0 && afterDiscount < SHIP_FREE && (
                <p className="ship-hint">
                  Add ₹ {(SHIP_FREE - afterDiscount).toLocaleString(undefined, { maximumFractionDigits: 0 })} more for free shipping!
                </p>
              )}

              <hr className="summary-divider" />

              <div className="price-row grand-total-row">
                <span>Grand Total</span>
                <span>₹ {Math.round(grandTotal).toLocaleString()}</span>
              </div>

              <Link to="/checkout" className="btn btn-success w-100 mt-4 checkout-btn">
                Proceed to Checkout →
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;