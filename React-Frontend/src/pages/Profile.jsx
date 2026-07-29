import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../services/authService";
import { fetchAllOrders } from "../services/orderService";
import { setUser } from "../features/auth/authSlice";
import "../styles/profile.css";
import "../styles/auth.css";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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
    <div className="ss-page">
      <div className="container">
        <div className="ss-profile-container">
          <div className="mb-4">
            <h1 className="ss-page-title">
              User <span>Profile</span>
            </h1>
            <p className="ss-page-subtitle">
              Manage your personal information and view account history.
            </p>
          </div>

          <div className="ss-profile-card">
            {error && <div className="ss-alert ss-alert-danger">{error}</div>}
            {success && <div className="ss-alert ss-alert-success">{success}</div>}

            {!isEditing ? (
              <div>
                <div className="text-center mb-4">
                  <div className="ss-avatar-wrap">
                    <div className="ss-profile-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  </div>
                  <h3 className="ss-profile-name mb-0">{user.name}</h3>
                  <div className="ss-profile-role-badge">
                    {user.role?.toUpperCase() || "CUSTOMER"}
                  </div>
                </div>

                <div className="ss-profile-stats">
                  <div className="ss-stat-item">
                    <span className="ss-stat-val">{orderCount}</span>
                    <span className="ss-stat-lbl">Orders Placed</span>
                  </div>
                  <div className="ss-stat-item">
                    <span className="ss-stat-val" style={{ color: "var(--primary)" }}>
                      {user.role?.toUpperCase() === "ADMIN" ? "Admin" : "Standard"}
                    </span>
                    <span className="ss-stat-lbl">Access Level</span>
                  </div>
                </div>

                <div className="ss-profile-info">
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

                <div className="text-center mt-4">
                  <button onClick={handleEditClick} className="ss-btn-primary" style={{ maxWidth: "200px" }}>
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="ss-profile-edit-form">
                <div className="text-center mb-4">
                  <div className="ss-avatar-wrap">
                    <div className="ss-profile-avatar">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  </div>
                  <h4 className="mt-3 text-muted">Editing Profile</h4>
                </div>

                <div className="ss-form-group">
                  <label className="ss-form-label">Full Name</label>
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

                <div className="ss-form-group">
                  <label className="ss-form-label">Email Address</label>
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

                <div className="ss-form-group">
                  <label className="ss-form-label">New Password (Leave blank to keep current)</label>
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

                <div className="ss-edit-actions">
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
