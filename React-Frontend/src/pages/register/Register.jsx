import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
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

    const { name, email, password, role } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const responseMessage = await registerUser({
        name,
        email,
        password,
        role,
      });

      setSuccess(responseMessage || "User Registered Successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || "Registration failed. Email might already be in use."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="register-card mx-auto" style={{ maxWidth: "450px" }}>
        <h2 className="text-center mb-4">Create Account</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

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

          <div className="mb-4">
            <label className="form-label">Account Type</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              style={{
                background: "var(--bg-card2, #22213A)",
                border: "1px solid var(--border, rgba(255,255,255,0.07))",
                color: "var(--text, #F0EFF9)",
                borderRadius: "var(--radius-sm, 10px)",
                padding: "0.75rem 1rem",
                outline: "none",
              }}
            >
              <option value="USER" style={{ background: "var(--bg-card, #1A1928)", color: "var(--text, #F0EFF9)" }}>
                Customer (Standard User)
              </option>
              <option value="ADMIN" style={{ background: "var(--bg-card, #1A1928)", color: "var(--text, #F0EFF9)" }}>
                Administrator (Admin)
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;