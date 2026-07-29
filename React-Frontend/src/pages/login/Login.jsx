import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, fetchUsers } from "../../services/authService";
import { loginSuccess, setUser } from "../../features/auth/authSlice";
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
      const token = await loginUser(email, password);

      if (token === "Invalid credentials!") {
        setError("Invalid credentials. Please try again.");
        return;
      }

      // Temporarily store in localStorage so the axios interceptor picks it up for the fetchUsers request
      localStorage.setItem("token", token);

      let currentUser = null;
      try {
        // 2. Fetch the user details to find our matched user object
        const allUsers = await fetchUsers();
        currentUser = allUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (currentUser) {
          dispatch(loginSuccess({ token }));
          dispatch(setUser(currentUser));
          setSuccess(`Logged in successfully! Welcome back, ${currentUser.name}.`);
        } else {
          dispatch(loginSuccess({ token }));
          // Fallback if user profile lookup fails
          const fallbackUser = { id: 0, email, name: email.split("@")[0] };
          dispatch(setUser(fallbackUser));
          setSuccess("Logged in successfully!");
        }
      } catch (fetchErr) {
        // Clean up temporary token storage since validation or profile fetching failed
        localStorage.removeItem("token");
        throw fetchErr;
      }

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || "Login failed. Please check your network or credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="login-card mx-auto" style={{ maxWidth: "450px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;