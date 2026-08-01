import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, fetchUsers } from "../../services/authService";
import { loginSuccess, setUser } from "../../features/auth/authSlice";
import "../../styles/auth.css";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const resData = await loginUser(cleanEmail, password);

      // Backend may return string "Invalid credentials!" or token
      if (typeof resData === "string" && resData.toLowerCase().includes("invalid")) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      const token = typeof resData === "string" ? resData : resData?.token || "mock-jwt-token";

      // Store in localStorage so axios interceptor picks it up
      localStorage.setItem("token", token);

      let currentUser = null;
      try {
        const allUsers = await fetchUsers();
        currentUser = Array.isArray(allUsers)
          ? allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
          : null;

        if (currentUser) {
          dispatch(loginSuccess({ token }));
          dispatch(setUser(currentUser));
          setSuccess(`Logged in successfully! Welcome back, ${currentUser.name}.`);
        } else {
          dispatch(loginSuccess({ token }));
          const fallbackUser = { id: 0, email, name: email.split("@")[0], role: "USER" };
          dispatch(setUser(fallbackUser));
          setSuccess("Logged in successfully!");
        }
      } catch (fetchErr) {
        console.warn("Failed to fetch user profile, using basic profile:", fetchErr);
        dispatch(loginSuccess({ token }));
        const fallbackUser = { id: 0, email, name: email.split("@")[0], role: "USER" };
        dispatch(setUser(fallbackUser));
        setSuccess("Logged in successfully!");
      }

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Login Error:", err);
      // Clean up token if failure occurs
      localStorage.removeItem("token");

      let errMsg = "Login failed. Please check your credentials or network connection.";
      if (err.code === "ECONNABORTED" || err.message?.includes("Network Error")) {
        errMsg = "⚠️ Network error. Please check your internet connection and try again.";
      } else if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errMsg = err.response.data;
        } else if (err.response.data.message) {
          errMsg = err.response.data.message;
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-auth-page">
      <div className="ss-auth-card">
        {/* Brand Logo */}
        <div className="text-center mb-1">
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
            <defs>
              <linearGradient id="log-g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="log-g2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <path d="M10 13C10 9 14 6 18 6C22 6 26 9 26 13C26 17 21 18 18 18" stroke="url(#log-g1)" strokeWidth="4.5" strokeLinecap="round"/>
            <path d="M18 18C15 18 10 19 10 23C10 27 14 30 18 30C22 30 26 27 26 23" stroke="url(#log-g2)" strokeWidth="4.5" strokeLinecap="round"/>
            <circle cx="18" cy="18" r="2.5" fill="url(#log-g1)"/>
          </svg>
        </div>

        <div className="ss-auth-logo">SmartShop</div>
        <div className="ss-auth-subtitle">Welcome back! Please enter your details 🔑</div>

        {error && <div className="ss-alert ss-alert-danger">{error}</div>}
        {success && <div className="ss-alert ss-alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="ss-form-group">
            <label className="ss-form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="ss-form-control"
              placeholder="Enter your email"
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
                placeholder="Enter your password"
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="ss-btn-primary mt-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "🔓 Login to SmartShop"}
          </button>
        </form>

        <div className="ss-auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;