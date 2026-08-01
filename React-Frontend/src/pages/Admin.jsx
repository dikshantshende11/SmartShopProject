import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAllOrders, deleteOrder, updateOrderStatus } from "../services/orderService";
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { fetchAllUsers, updateUserRole } from "../services/userService";
import "../styles/global.css";
import "../styles/orders.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Tooltip, Legend, Filler
);

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  imageUrl: "",
  rating: "",
  reviewCount: "",
  available: true,
};

function Admin() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role?.toUpperCase() === "ADMIN";

  // Tab state
  const [activeTab, setActiveTab] = useState("orders");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PRODUCT);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Search & Filter state
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");

  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");

  // Selected Order Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Shared feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Load orders
  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data || []);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setOrdersLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  // Load products
  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      try {
        const data = await fetchAllProducts();
        setProducts(data || []);
      } catch {
        setError("Failed to load products.");
      } finally {
        setProductsLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  // Load users
  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data || []);
      } catch {
        setError("Failed to load users.");
      } finally {
        setUsersLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  // --- Order Actions ---
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order permanently?")) return;
    clearFeedback();
    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o.id !== id));
      showSuccess("Order deleted.");
    } catch {
      setError("Failed to delete order.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    clearFeedback();
    try {
      const updated = await updateOrderStatus(id, newStatus);
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: updated.status } : o)));
      showSuccess(`Order #${id} status updated to ${newStatus}.`);
    } catch {
      setError("Failed to update order status.");
    }
  };

  // --- User Actions ---
  const handleRoleToggle = async (id, newRole) => {
    clearFeedback();
    const action = newRole === "ADMIN" ? "promote to Admin" : "remove Admin role from";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const updated = await updateUserRole(id, newRole);
      setUsers(users.map((u) => (u.id === id ? { ...u, role: updated.role } : u)));
      showSuccess(`User #${id} role updated to ${newRole}.`);
    } catch {
      setError("Failed to update user role.");
    }
  };

  // --- Product Actions ---
  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(EMPTY_PRODUCT);
    setShowForm(true);
    clearFeedback();
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      brand: product.brand || "",
      imageUrl: product.imageUrl || "",
      rating: product.rating || "",
      reviewCount: product.reviewCount || "",
      available: product.available ?? true,
    });
    setShowForm(true);
    clearFeedback();
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    clearFeedback();

    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      rating: parseFloat(formData.rating) || 0,
      reviewCount: parseInt(formData.reviewCount) || 0,
    };

    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, payload);
        setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)));
        showSuccess("Product updated successfully!");
      } else {
        await addProduct(payload);
        const refreshed = await fetchAllProducts();
        setProducts(refreshed || []);
        showSuccess("Product added successfully!");
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData(EMPTY_PRODUCT);
    } catch {
      setError("Failed to save product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product from the catalog?")) return;
    clearFeedback();
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      showSuccess("Product deleted.");
    } catch {
      setError("Failed to delete product.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="alert alert-danger mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <h4 className="alert-heading">🚫 Access Denied</h4>
          <p className="mb-0">You do not have administrative privileges.</p>
        </div>
      </div>
    );
  }

  // --- Filtering Logic ---
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toString().includes(orderSearch) ||
      order.userId?.toString().includes(orderSearch) ||
      order.productId?.toString().includes(orderSearch);
    const matchesStatus =
      orderStatusFilter === "ALL" ||
      order.status?.toUpperCase() === orderStatusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.id?.toString().includes(productSearch);
    const matchesCategory =
      productCategoryFilter === "ALL" ||
      product.category?.toUpperCase() === productCategoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id?.toString().includes(userSearch);
    const matchesRole =
      userRoleFilter === "ALL" ||
      u.role?.toUpperCase() === userRoleFilter.toUpperCase();
    return matchesSearch && matchesRole;
  });

  const categories = ["ALL", ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="container ss-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="ss-page-title">
            Admin <span>Dashboard</span>
          </h1>
          <p className="ss-page-subtitle">
            Manage your store products and customer orders
          </p>
        </div>
      </div>

      {/* 4 KPI SUMMARY CARDS GRID */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.6rem" }}>📋</div>
            <small className="text-uppercase fw-bold text-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
              Total Orders
            </small>
            <h3 className="mt-1 fw-bold mb-0" style={{ color: "var(--text)" }}>
              {orders.length}
            </h3>
            <span className="small text-success mt-1" style={{ fontSize: "0.75rem", fontWeight: "600" }}>
              {orders.filter(o => o.status === "DELIVERED" || o.status === "PLACED").length} Active
            </span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.6rem" }}>💰</div>
            <small className="text-uppercase fw-bold text-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
              Total Revenue
            </small>
            <h3 className="mt-1 fw-bold mb-0" style={{ color: "var(--accent)" }}>
              ₹ {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
            </h3>
            <span className="small text-muted mt-1" style={{ fontSize: "0.75rem" }}>
              Avg: ₹ {orders.length ? Math.round(orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / orders.length).toLocaleString() : 0}
            </span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.6rem" }}>📦</div>
            <small className="text-uppercase fw-bold text-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
              Catalog Items
            </small>
            <h3 className="mt-1 fw-bold mb-0" style={{ color: "var(--primary)" }}>
              {products.length}
            </h3>
            <span className={`small mt-1 fw-bold ${products.filter(p => p.stock <= 5).length > 0 ? "text-danger" : "text-success"}`} style={{ fontSize: "0.75rem" }}>
              {products.filter(p => p.stock <= 5).length} Low Stock
            </span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card p-3 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "1.6rem" }}>👥</div>
            <small className="text-uppercase fw-bold text-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
              Registered Users
            </small>
            <h3 className="mt-1 fw-bold mb-0" style={{ color: "var(--warning)" }}>
              {users.length}
            </h3>
            <span className="small text-muted mt-1" style={{ fontSize: "0.75rem" }}>
              {users.filter(u => u.role?.toUpperCase() === "ADMIN").length} Admins
            </span>
          </div>
        </div>
      </div>

      {/* LOW STOCK INVENTORY WARNING BANNER */}
      {products.filter((p) => p.stock <= 5).length > 0 && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4 shadow-sm" style={{ borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--warning)" }}>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "1.3rem" }}>⚠️</span>
            <div>
              <strong className="d-block">Low Stock Inventory Alert!</strong>
              <small className="text-muted">
                {products.filter((p) => p.stock <= 5).length} product(s) have 5 or fewer items remaining in stock ({products.filter((p) => p.stock <= 5).map(p => p.name).join(", ")}).
              </small>
            </div>
          </div>
          <button
            className="btn btn-sm btn-outline-dark fw-bold"
            onClick={() => setActiveTab("products")}
          >
            Manage Catalog
          </button>
        </div>
      )}

      {/* Feedback */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4" style={{ borderColor: "var(--border)" }}>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            style={{ color: activeTab === "orders" ? "var(--accent)" : "var(--text-dim)" }}
            onClick={() => { setActiveTab("orders"); clearFeedback(); }}
          >
            📋 Orders ({orders.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "products" ? "active" : ""}`}
            style={{ color: activeTab === "products" ? "var(--accent)" : "var(--text-dim)" }}
            onClick={() => { setActiveTab("products"); clearFeedback(); }}
          >
            📦 Products ({products.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            style={{ color: activeTab === "users" ? "var(--accent)" : "var(--text-dim)" }}
            onClick={() => { setActiveTab("users"); clearFeedback(); }}
          >
            👥 Users ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "analytics" ? "active" : ""}`}
            style={{ color: activeTab === "analytics" ? "var(--accent)" : "var(--text-dim)" }}
            onClick={() => { setActiveTab("analytics"); clearFeedback(); }}
          >
            📊 Analytics
          </button>
        </li>
      </ul>

      {/* ──────────── ORDERS TAB ──────────── */}
      {activeTab === "orders" && (
        <>
          {/* Search & Filter Controls */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Order ID, User ID, or Product ID..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PLACED">PLACED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {ordersLoading ? (
            <div className="text-center py-5">
              <span className="text-muted">Loading orders…</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No matching orders found.</h5>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="ss-order-card mb-3">
                <div className="ss-order-header">
                  <div className="ss-order-id">
                    Order ID <span>#{order.id}</span>
                  </div>
                  <span
                    className={`ss-badge ${
                      order.status === "PLACED" ? "ss-badge-placed" :
                      order.status === "CANCELLED" ? "ss-badge-cancelled" :
                      "ss-badge-pending"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="ss-order-meta align-items-center">
                  <div className="ss-order-meta-item">
                    <label>Customer ID</label>
                    <span>User #{order.userId}</span>
                  </div>
                  <div className="ss-order-meta-item">
                    <label>Product Details</label>
                    <span>
                      Product #{order.productId} — Qty: {order.quantity}
                    </span>
                  </div>
                  <div className="ss-order-meta-item total">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <label>Amount</label>
                        <span>₹ {order.totalAmount?.toLocaleString()}</span>
                      </div>
                      <div className="d-flex gap-2 align-items-center ms-3">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: "160px", fontSize: "0.8rem" }}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* ──────────── PRODUCTS TAB ──────────── */}
      {activeTab === "products" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Catalog Products</h5>
            <button
              className="btn btn-sm btn-success"
              onClick={openAddForm}
            >
              + Add Product
            </button>
          </div>

          {/* Add / Edit Form */}
          {showForm && (
            <div
              className="card p-4 mb-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
            >
              <h6 className="fw-bold mb-3">
                {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
              </h6>
              <form onSubmit={handleProductSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Product Name *</label>
                    <input
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. iPhone 15 Pro"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Brand</label>
                    <input
                      className="form-control"
                      name="brand"
                      value={formData.brand}
                      onChange={handleFormChange}
                      placeholder="e.g. Apple"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Category</label>
                    <input
                      className="form-control"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      placeholder="e.g. Electronics"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={2}
                      placeholder="Short product description…"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      className="form-control"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Stock *</label>
                    <input
                      className="form-control"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleFormChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Rating (0–5)</label>
                    <input
                      className="form-control"
                      name="rating"
                      type="number"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleFormChange}
                      min="0"
                      max="5"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Review Count</label>
                    <input
                      className="form-control"
                      name="reviewCount"
                      type="number"
                      value={formData.reviewCount}
                      onChange={handleFormChange}
                      min="0"
                    />
                  </div>
                  <div className="col-md-9">
                    <label className="form-label">Image URL</label>
                    <input
                      className="form-control"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleFormChange}
                      placeholder="https://…"
                    />
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="available"
                        id="available"
                        checked={formData.available}
                        onChange={handleFormChange}
                      />
                      <label className="form-check-label" htmlFor="available">
                        Available
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-success">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => { setShowForm(false); clearFeedback(); }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search & Filter Controls */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search products by Name, Brand, or ID..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "ALL" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          {productsLoading ? (
            <div className="text-center py-5">
              <span className="text-muted">Loading products…</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No matching products found.</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <small className="text-muted">#{product.id}</small>
                      </td>
                      <td>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: "48px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              background: "#eee",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.2rem",
                            }}
                          >
                            📦
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="fw-semibold">{product.name}</span>
                      </td>
                      <td>
                        <small>{product.brand || "—"}</small>
                      </td>
                      <td>
                        <small>{product.category || "—"}</small>
                      </td>
                      <td>
                        <span className="fw-bold" style={{ color: "var(--accent)" }}>
                          ₹{product.price?.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        {product.stock === 0 ? (
                          <span className="badge bg-danger">Out of Stock</span>
                        ) : product.stock <= 5 ? (
                          <span className="badge bg-warning text-dark">Low Stock ({product.stock})</span>
                        ) : (
                          <span className="badge bg-light text-dark">{product.stock}</span>
                        )}
                      </td>
                      <td>⭐ {product.rating || "—"}</td>
                      <td>
                        <span
                          className={`badge ${
                            product.available ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {product.available ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditForm(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ──────────── USERS TAB ──────────── */}
      {activeTab === "users" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Registered Users</h5>
          </div>

          {/* Search & Filter Controls */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search users by Name, Email, or ID..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          {usersLoading ? (
            <div className="text-center py-5">
              <span className="text-muted">Loading users…</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No matching users found.</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td><small className="text-muted">#{u.id}</small></td>
                      <td><span className="fw-semibold">{u.name || "—"}</span></td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role?.toUpperCase() === "ADMIN"
                              ? "bg-danger"
                              : "bg-primary"
                          }`}
                        >
                          {u.role || "USER"}
                        </span>
                      </td>
                      <td>
                        {u.role?.toUpperCase() === "ADMIN" ? (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleRoleToggle(u.id, "USER")}
                          >
                            Remove Admin
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleRoleToggle(u.id, "ADMIN")}
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <div className="modal-header" style={{ borderColor: "var(--border)" }}>
                <h5 className="modal-title fw-bold">Order Details #{selectedOrder.id}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="text-muted small text-uppercase">Status</label>
                  <div>
                    <span
                      className={`badge ${
                        selectedOrder.status === "PLACED"
                          ? "bg-primary"
                          : selectedOrder.status === "CANCELLED"
                          ? "bg-danger"
                          : "bg-info"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="text-muted small text-uppercase">Customer Info</label>
                    <div className="fw-semibold">
                      {users.find((u) => u.id === selectedOrder.userId)?.name || `User #${selectedOrder.userId}`}
                    </div>
                    <div className="small text-muted">
                      {users.find((u) => u.id === selectedOrder.userId)?.email || "No email available"}
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small text-uppercase">Product Details</label>
                    <div className="fw-semibold">
                      {products.find((p) => p.id === selectedOrder.productId)?.name || `Product #${selectedOrder.productId}`}
                    </div>
                    <div className="small text-muted">
                      Brand: {products.find((p) => p.id === selectedOrder.productId)?.brand || "—"}
                    </div>
                  </div>
                </div>

                <div className="row mb-3 border-top pt-3" style={{ borderColor: "var(--border)" }}>
                  <div className="col-6">
                    <label className="text-muted small text-uppercase">Quantity</label>
                    <div className="fw-bold">{selectedOrder.quantity} units</div>
                  </div>
                  <div className="col-6 text-end">
                    <label className="text-muted small text-uppercase">Total Amount</label>
                    <div className="fw-bold fs-5 text-success">
                      ₹ {selectedOrder.totalAmount?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderColor: "var(--border)" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────── ANALYTICS TAB ──────────── */}
      {activeTab === "analytics" && (() => {
        // 1. Products by Category — Bar chart
        const catCount = {};
        products.forEach((p) => {
          const cat = p.category || "Other";
          catCount[cat] = (catCount[cat] || 0) + 1;
        });
        const catLabels  = Object.keys(catCount);
        const catValues  = Object.values(catCount);

        // 2. Order Status — Doughnut chart
        const statusCount = { PLACED: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 };
        orders.forEach((o) => {
          const s = o.status?.toUpperCase();
          if (s in statusCount) statusCount[s]++;
          else statusCount["PLACED"]++;
        });

        // 3. Revenue trend — cumulative by order id (Line chart)
        const sortedOrders = [...orders].sort((a, b) => a.id - b.id);
        let running = 0;
        const revenueLabels = sortedOrders.map((_, i) => `Order ${i + 1}`);
        const revenueData   = sortedOrders.map((o) => {
          running += o.totalAmount || 0;
          return running;
        });

        const chartCardStyle = {
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
        };

        const baseOptions = {
          responsive: true,
          plugins: {
            legend: { labels: { color: "#64748b", font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 } } },
            tooltip: { backgroundColor: "#1e293b", titleColor: "#f1f5f9", bodyColor: "#94a3b8" },
          },
          scales: {
            x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" } },
            y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" } },
          },
        };

        return (
          <div>
            {/* KPI Strip */}
            <div className="row g-3 mb-4">
              {[
                { label: "Total Revenue", value: `₹ ${orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toLocaleString()}`, color: "#10b981", icon: "💰" },
                { label: "Avg Order Value", value: orders.length ? `₹ ${Math.round(orders.reduce((s, o) => s + (o.totalAmount || 0), 0) / orders.length).toLocaleString()}` : "₹ 0", color: "#6366f1", icon: "📈" },
                { label: "Cancelled Orders", value: statusCount.CANCELLED, color: "#ef4444", icon: "🚫" },
                { label: "Delivered Orders", value: statusCount.DELIVERED, color: "#10b981", icon: "✅" },
              ].map((kpi) => (
                <div key={kpi.label} className="col-md-3 col-6">
                  <div style={{ ...chartCardStyle, textAlign: "center" }}>
                    <div style={{ fontSize: "1.8rem" }}>{kpi.icon}</div>
                    <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 700, marginTop: "4px" }}>{kpi.label}</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: kpi.color, fontFamily: "'Syne', sans-serif" }}>{kpi.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              {/* Bar: Products by Category */}
              <div className="col-lg-6">
                <div style={chartCardStyle}>
                  <h6 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "var(--text)", marginBottom: "1rem" }}>
                    📦 Products by Category
                  </h6>
                  <Bar
                    data={{
                      labels: catLabels,
                      datasets: [{
                        label: "Products",
                        data: catValues,
                        backgroundColor: ["#6366f1","#10b981","#f59e0b","#ef4444","#3b82f6","#8b5cf6"],
                        borderRadius: 8,
                        borderSkipped: false,
                      }],
                    }}
                    options={{ ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }}
                  />
                </div>
              </div>

              {/* Doughnut: Order Status */}
              <div className="col-lg-6">
                <div style={chartCardStyle}>
                  <h6 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "var(--text)", marginBottom: "1rem" }}>
                    🧾 Order Status Breakdown
                  </h6>
                  <div style={{ maxWidth: "320px", margin: "0 auto" }}>
                    <Doughnut
                      data={{
                        labels: ["Placed", "Shipped", "Delivered", "Cancelled"],
                        datasets: [{
                          data: [statusCount.PLACED, statusCount.SHIPPED, statusCount.DELIVERED, statusCount.CANCELLED],
                          backgroundColor: ["#6366f1","#f59e0b","#10b981","#ef4444"],
                          borderWidth: 0,
                          hoverOffset: 8,
                        }],
                      }}
                      options={{
                        responsive: true,
                        cutout: "70%",
                        plugins: {
                          legend: { position: "bottom", labels: { color: "#64748b", font: { family: "'Plus Jakarta Sans', sans-serif" }, padding: 16 } },
                          tooltip: { backgroundColor: "#1e293b", titleColor: "#f1f5f9", bodyColor: "#94a3b8" },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Line: Cumulative Revenue */}
              <div className="col-12">
                <div style={chartCardStyle}>
                  <h6 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "var(--text)", marginBottom: "1rem" }}>
                    📈 Cumulative Revenue Trend
                  </h6>
                  <Line
                    data={{
                      labels: revenueLabels,
                      datasets: [{
                        label: "Revenue (₹)",
                        data: revenueData,
                        borderColor: "#6366f1",
                        backgroundColor: "rgba(99,102,241,0.08)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "#6366f1",
                      }],
                    }}
                    options={baseOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

export default Admin;
