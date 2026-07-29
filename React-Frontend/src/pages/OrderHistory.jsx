import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllOrders, cancelOrder } from "../services/orderService";
import { fetchAllProducts } from "../services/productService";
import "../styles/orders.css";

function OrderHistory() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmingCancelId, setConfirmingCancelId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadOrderData = async () => {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([
          fetchAllOrders(),
          fetchAllProducts(),
        ]);

        // Map products by ID
        const productMap = {};
        if (Array.isArray(productsData)) {
          productsData.forEach((p) => {
            productMap[p.id] = p;
          });
        }

        // Filter and merge product info into orders
        const userOrders = ordersData
          .filter((order) => order.userId === user.id)
          .map((order) => ({
            ...order,
            product: productMap[order.productId] || null,
          }))
          .sort((a, b) => b.id - a.id); // Newest first

        setOrders(userOrders);
      } catch (err) {
        console.error("Fetch orders failed: ", err);
        setError("Failed to retrieve your order history.");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [isAuthenticated, user?.id, navigate]);

  const handleCancelClick = (orderId) => {
    setConfirmingCancelId(orderId);
  };

  const handleCancelConfirm = async (orderId) => {
    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      
      // Update local state status to CANCELLED
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );
      setSuccess(`Order #${orderId} has been successfully cancelled.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Failed to cancel order:", err);
      setError("Failed to cancel the order. Please try again.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setConfirmingCancelId(null);
      setCancellingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    const s = status?.toUpperCase();
    if (s === "DELIVERED") return "ss-badge-placed";
    if (s === "PLACED")    return "ss-badge-placed";
    if (s === "CANCELLED") return "ss-badge-cancelled";
    return "ss-badge-pending";
  };

  const TIMELINE_STEPS = [
    { key: "PLACED",           label: "Order Placed",      icon: "🧾" },
    { key: "SHIPPED",          label: "Shipped",           icon: "📦" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery",  icon: "🚚" },
    { key: "DELIVERED",        label: "Delivered",         icon: "✅" },
  ];

  const getStepIndex = (status) => {
    const s = status?.toUpperCase();
    if (s === "DELIVERED")        return 3;
    if (s === "OUT_FOR_DELIVERY") return 2;
    if (s === "SHIPPED")          return 1;
    if (s === "PLACED")           return 0;
    return -1; // CANCELLED
  };

  const OrderTimeline = ({ status }) => {
    if (status?.toUpperCase() === "CANCELLED") {
      return (
        <div className="order-timeline-cancelled">
          <span>🚫</span> This order was cancelled.
        </div>
      );
    }
    const activeIdx = getStepIndex(status);
    return (
      <div className="order-timeline">
        {TIMELINE_STEPS.map((step, idx) => (
          <div
            key={step.key}
            className={`timeline-step ${
              idx < activeIdx  ? "completed" :
              idx === activeIdx ? "active"    : "pending"
            }`}
          >
            <div className="timeline-dot">
              <span>{step.icon}</span>
            </div>
            <div className="timeline-label">{step.label}</div>
            {idx < TIMELINE_STEPS.length - 1 && (
              <div className={`timeline-line ${idx < activeIdx ? "filled" : ""}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ss-spinner-wrap">
        <div className="ss-spinner"></div>
      </div>
    );
  }

  return (
    <div className="ss-page">
      <div className="container" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="ss-page-title">
              My <span>Order History</span>
            </h1>
            <p className="ss-page-subtitle">
              Manage and track your smartshop orders.
            </p>
          </div>
          <Link to="/" className="ss-btn-secondary">
            Back to Shop
          </Link>
        </div>

        {error && <div className="ss-alert ss-alert-danger">{error}</div>}
        {success && <div className="ss-alert ss-alert-success">{success}</div>}

        {orders.length === 0 ? (
          <div className="ss-empty">
            <div className="ss-empty-icon">📦</div>
            <h3 className="ss-empty-title">No Orders Found</h3>
            <p className="ss-empty-text">You haven't placed any orders yet.</p>
            <Link to="/" className="ss-btn-primary" style={{ maxWidth: "200px", margin: "0 auto" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="ss-orders-list">
            {orders.map((order) => {
              const product = order.product;
              const isCancelable =
                order.status?.toUpperCase() !== "CANCELLED" &&
                order.status?.toUpperCase() !== "DELIVERED";

              return (
                <div key={order.id} className="ss-order-card">
                  <div className="ss-order-header">
                    <h5 className="ss-order-id mb-0">
                      Order ID: <span>#{order.id}</span>
                    </h5>
                    <span className={`ss-badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {product ? (
                    <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center mb-3">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid var(--border)",
                          }}
                        />
                      )}
                      <div>
                        <h6 className="mb-0 text-white fw-bold">{product.name}</h6>
                        <small className="text-muted">Brand: {product.brand || "SmartShop"}</small>
                        {product.description && (
                          <p className="mb-0 text-muted d-none d-md-block" style={{ fontSize: "0.8rem", marginTop: "2px" }}>
                            {product.description.length > 80
                              ? `${product.description.substring(0, 80)}...`
                              : product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                        Product Information Unavailable (Product ID: {order.productId})
                      </p>
                    </div>
                  )}

                  {/* ORDER TRACKING TIMELINE */}
                  <OrderTimeline status={order.status} />

                  <div className="ss-order-meta align-items-center">
                    <div className="ss-order-meta-item">
                      <label>Details</label>
                      <span>
                        Qty: {order.quantity} {product ? `× ₹${product.price}` : ""}
                      </span>
                    </div>
                    <div className="ss-order-meta-item total">
                      <label>Total Price</label>
                      <span>₹{order.totalAmount?.toLocaleString()}</span>
                    </div>

                    <div className="text-end">
                      {isCancelable && confirmingCancelId !== order.id && (
                        <button
                          onClick={() => handleCancelClick(order.id)}
                          className="btn btn-outline-danger btn-sm"
                          style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                        >
                          Cancel Order
                        </button>
                      )}

                      {confirmingCancelId === order.id && (
                        <div className="d-flex flex-column align-items-end gap-1">
                          <small className="text-danger fw-bold" style={{ fontSize: "0.75rem" }}>
                            Are you sure?
                          </small>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => setConfirmingCancelId(null)}
                              className="btn btn-secondary btn-sm py-1"
                              style={{ borderRadius: "6px", fontSize: "0.7rem" }}
                              disabled={cancellingId === order.id}
                            >
                              No
                            </button>
                            <button
                              onClick={() => handleCancelConfirm(order.id)}
                              className="btn btn-danger btn-sm py-1"
                              style={{ borderRadius: "6px", fontSize: "0.7rem" }}
                              disabled={cancellingId === order.id}
                            >
                              {cancellingId === order.id ? "Cancelling..." : "Yes"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
