import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "../../styles/auth.css";
import "./Register.css";

// Password strength checker
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#EF4444" };
  if (score === 2) return { score, label: "Fair", color: "#F59E0B" };
  if (score === 3) return { score, label: "Good", color: "#10B981" };
  return { score, label: "Strong 💪", color: "#4F46E5" };
}

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, password, confirmPassword, role } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const responseMessage = await registerUser({ name, email, password, role });
      setSuccess(responseMessage || "Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration Error:", err);
      let errMsg = "Registration failed. Email might already be in use.";
      if (err.code === "ECONNABORTED" || err.message?.includes("Network Error")) {
        errMsg = "⚠️ Network error. Please check your internet connection and try again.";
      } else if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errMsg = err.response.data;
        } else if (err.response.data.message) {
          errMsg = err.response.data.message;
        } else if (err.response.data.error) {
          errMsg = err.response.data.error;
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-auth-page">
      <div className="ss-auth-card" style={{ maxWidth: "460px" }}>

        {/* Logo */}
        <div className="text-center mb-1">
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="reg-g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="reg-g2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <path d="M10 13C10 9 14 6 18 6C22 6 26 9 26 13C26 17 21 18 18 18" stroke="url(#reg-g1)" strokeWidth="4.5" strokeLinecap="round"/>
            <path d="M18 18C15 18 10 19 10 23C10 27 14 30 18 30C22 30 26 27 26 23" stroke="url(#reg-g2)" strokeWidth="4.5" strokeLinecap="round"/>
            <circle cx="18" cy="18" r="2.5" fill="url(#reg-g1)"/>
          </svg>
        </div>

        <div className="ss-auth-logo">SmartShop</div>
        <div className="ss-auth-subtitle">Create your account to get started 🚀</div>

        {error && <div className="ss-alert ss-alert-danger">{error}</div>}
        {success && <div className="ss-alert ss-alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="ss-form-group">
            <label className="ss-form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="ss-form-control"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div className="ss-form-group">
            <label className="ss-form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="ss-form-control"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="ss-form-group">
            <label className="ss-form-label">Password</label>
            <div className="ss-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="ss-form-control"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="ss-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Password Strength Bar */}
            {formData.password.length > 0 && (
              <div className="ss-strength-wrap">
                <div className="ss-strength-bar">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="ss-strength-seg"
                      style={{
                        background: i <= strength.score ? strength.color : "var(--border)",
                      }}
                    />
                  ))}
                </div>
                <span className="ss-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="ss-form-group">
            <label className="ss-form-label">
              Confirm Password
              {passwordsMatch && <span style={{ color: "#10B981", marginLeft: "6px" }}>✅ Match</span>}
              {passwordsMismatch && <span style={{ color: "#EF4444", marginLeft: "6px" }}>❌ Mismatch</span>}
            </label>
            <div className="ss-input-wrap">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                className={`ss-form-control ${passwordsMismatch ? "ss-input-error" : ""} ${passwordsMatch ? "ss-input-success" : ""}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="ss-eye-btn"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Account Type */}
          <div className="ss-form-group">
            <label className="ss-form-label">Account Type</label>
            <select
              name="role"
              className="ss-form-control"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="USER">👤 Customer (Standard User)</option>
              <option value="ADMIN">🛡️ Administrator (Admin)</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="ss-btn-primary mt-1"
            disabled={loading || passwordsMismatch}
          >
            {loading ? "Creating Account..." : "🚀 Create Account"}
          </button>

        </form>

        <div className="ss-auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;