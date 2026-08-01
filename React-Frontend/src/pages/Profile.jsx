import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { updateUserProfile } from "../services/authService";
import { fetchAllOrders } from "../services/orderService";
import { setUser } from "../features/auth/authSlice";
import "../styles/profile.css";
import "../styles/auth.css";

const AVATAR_OPTIONS = [
  { emoji: "🧑‍💻", label: "Tech Pro" },
  { emoji: "⚡", label: "Power Shopper" },
  { emoji: "👑", label: "VIP Collector" },
  { emoji: "🚀", label: "Innovator" },
  { emoji: "🛍️", label: "Fashionista" },
  { emoji: "🎮", label: "Gamer Pro" },
  { emoji: "🌟", label: "Trendsetter" },
  { emoji: "💎", label: "Elite Member" },
];

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [orderCount, setOrderCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem(`avatar_${user?.id}`) || "🧑‍💻";
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadUserData = async () => {
      try {
        const orders = await fetchAllOrders();
        const count = orders.filter((o) => o.userId === user.id).length;
        setOrderCount(count);
      } catch (err) {
        console.error("Failed to load user order stats:", err);
      }
    };

    loadUserData();
  }, [isAuthenticated, user?.id, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAvatarSelect = (emoji) => {
    setAvatar(emoji);
    localStorage.setItem(`avatar_${user.id}`, emoji);
  };

  const handleEditClick = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
    });
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const updatedUser = await updateUserProfile(user.id, payload);
      dispatch(setUser(updatedUser));
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setIsEditing(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Update profile failed:", err);
      setError(
        err.response?.data || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ss-page animate-fade-in">
      <div className="container">
        <div className="ss-profile-container">
          
          {/* HEADER TITLE */}
          <div className="mb-4 text-center">
            <h1 className="ss-page-title">
              User <span>Profile</span>
            </h1>
            <p className="ss-page-subtitle">
              Manage your personal information, customized avatar, and account metrics.
            </p>
          </div>

          {/* MAIN PROFILE CARD */}
          <div className="ss-profile-card shadow-lg">
            {error && <div className="ss-alert ss-alert-danger">{error}</div>}
            {success && <div className="ss-alert ss-alert-success">{success}</div>}

            {!isEditing ? (
              <div>
                {/* HERO HEADER & AVATAR */}
                <div className="text-center mb-4">
                  <div className="ss-avatar-wrap position-relative mx-auto">
                    <div className="ss-profile-avatar-emoji">
                      {avatar}
                    </div>
                    <span className="online-badge-dot" title="Active Account"></span>
                  </div>
                  <h3 className="ss-profile-name mt-2 mb-1">{user.name}</h3>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span className="ss-profile-role-badge">
                      {user.role?.toUpperCase() || "CUSTOMER"}
                    </span>
                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                      • Member since 2026
                    </span>
                  </div>
                </div>

                {/* AVATAR PICKER */}
                <div className="avatar-picker-section mb-4 p-3 rounded text-center">
                  <label className="d-block mb-2 text-muted fw-bold" style={{ fontSize: "0.82rem" }}>
                    SELECT YOUR AVATAR STYLE
                  </label>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {AVATAR_OPTIONS.map((item) => (
                      <button
                        key={item.emoji}
                        type="button"
                        className={`avatar-option-btn ${avatar === item.emoji ? "active" : ""}`}
                        onClick={() => handleAvatarSelect(item.emoji)}
                        title={item.label}
                      >
                        {item.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 METRICS CARDS GRID */}
                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-3">
                    <div className="metric-card p-3 text-center rounded">
                      <div className="metric-icon">📦</div>
                      <div className="metric-val">{orderCount}</div>
                      <div className="metric-lbl">Orders Placed</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="metric-card p-3 text-center rounded">
                      <div className="metric-icon">❤️</div>
                      <div className="metric-val">{wishlistItems.length}</div>
                      <div className="metric-lbl">Saved Wishlist</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="metric-card p-3 text-center rounded">
                      <div className="metric-icon">🛒</div>
                      <div className="metric-val">{cartItems.length}</div>
                      <div className="metric-lbl">Cart Items</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="metric-card p-3 text-center rounded">
                      <div className="metric-icon">🛡️</div>
                      <div className="metric-val" style={{ fontSize: "1.1rem", color: "var(--primary)" }}>
                        {user.role?.toUpperCase() === "ADMIN" ? "Admin" : "Verified"}
                      </div>
                      <div className="metric-lbl">Account Status</div>
                    </div>
                  </div>
                </div>

                {/* USER ACCOUNT DETAILS */}
                <div className="ss-profile-info mb-4">
                  <div className="ss-info-row">
                    <span className="ss-info-label">User ID</span>
                    <span className="ss-info-value">#{user.id}</span>
                  </div>
                  <div className="ss-info-row">
                    <span className="ss-info-label">Full Name</span>
                    <span className="ss-info-value">{user.name}</span>
                  </div>
                  <div className="ss-info-row">
                    <span className="ss-info-label">Email Address</span>
                    <span className="ss-info-value">{user.email}</span>
                  </div>
                </div>

                {/* QUICK SHORTCUT ACTIONS */}
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <button onClick={handleEditClick} className="ss-btn-primary">
                    ✏️ Edit Profile
                  </button>
                  <Link to="/orders" className="btn btn-outline-primary fw-bold" style={{ borderRadius: "10px", padding: "0.65rem 1.25rem" }}>
                    📜 My Orders
                  </Link>
                  <Link to="/wishlist" className="btn btn-outline-primary fw-bold" style={{ borderRadius: "10px", padding: "0.65rem 1.25rem" }}>
                    ❤️ My Wishlist
                  </Link>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmit} className="ss-profile-edit-form">
                <div className="text-center mb-4">
                  <div className="ss-profile-avatar-emoji mx-auto mb-2">
                    {avatar}
                  </div>
                  <h4 className="mt-2 text-muted fw-bold">Editing Profile Details</h4>
                </div>

                <div className="ss-form-group mb-3">
                  <label className="ss-form-label fw-bold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="ss-form-control"
                    placeholder="Enter your full name"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="ss-form-group mb-3">
                  <label className="ss-form-label fw-bold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="ss-form-control"
                    placeholder="Enter your email address"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="ss-form-group mb-4">
                  <label className="ss-form-label fw-bold">New Password (Leave blank to keep current)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="ss-form-control"
                    placeholder="Enter new password"
                    disabled={saving}
                  />
                </div>

                <div className="ss-edit-actions d-flex justify-content-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="ss-btn-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ss-btn-primary" disabled={saving}>
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
