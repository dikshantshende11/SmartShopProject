import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract parameters from router state
  const orders = location.state?.orders || [];
  const items = location.state?.items || [];

  // Calculate order metrics
  const totalAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalItemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // If no orders data is found and user refreshed, show a generic fallback or redirect after delay
  const hasOrderData = orders.length > 0;

  return (
    <div className="container order-success-page mt-5 mb-5 animate-fade-in">
      <div className="success-card">
        {hasOrderData ? (
          <>
            {/* Animated Checkmark */}
            <div className="success-checkmark-wrapper">
              <div className="checkmark-circle">✓</div>
            </div>

            {/* Title */}
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-subtitle">
              Thank you for shopping with SmartShop. Your order is being processed.
            </p>

            {/* Details Box */}
            <div className="order-details-box">
              <div className="details-row">
                <strong>Order ID(s):</strong>
                <div className="order-ids-list">
                  {orders.map((o) => (
                    <span key={o.id} className="order-id-badge">#{o.id}</span>
                  ))}
                </div>
              </div>
              <div className="details-row">
                <strong>Total Items:</strong>
                <span>{totalItemsCount} product{totalItemsCount > 1 ? "s" : ""}</span>
              </div>
              <div className="details-row">
                <strong>Total Amount:</strong>
                <span className="fw-bold text-success" style={{ fontSize: "1.05rem" }}>
                  ₹ {totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="details-row">
                <strong>Payment Mode:</strong>
                <span>Cash on Delivery (COD)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="success-actions">
              <Link to="/orders" className="btn btn-primary px-4">
                📋 Track Orders
              </Link>
              <Link to="/" className="btn btn-outline-secondary px-4">
                🛍️ Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="success-checkmark-wrapper">
              <div className="checkmark-circle" style={{ borderColor: "#ef4444", color: "#ef4444", background: "rgba(239, 68, 68, 0.1)" }}>✕</div>
            </div>
            <h1 className="success-title">No Order Details Found</h1>
            <p className="success-subtitle">
              It looks like you navigated to this page directly or refreshed the screen.
            </p>
            <div className="success-actions">
              <Link to="/" className="btn btn-primary">
                Back to Shop
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderSuccess;