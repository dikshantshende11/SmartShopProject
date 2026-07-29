import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { fetchAllProducts } from "../../services/productService";
import "../../styles/navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Load products once for suggestions
  useEffect(() => {
    fetchAllProducts()
      .then((data) => setAllProducts(data || []))
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const matches = allProducts
      .filter((p) =>
        p.name?.toLowerCase().includes(val.toLowerCase()) ||
        p.brand?.toLowerCase().includes(val.toLowerCase()) ||
        p.category?.toLowerCase().includes(val.toLowerCase())
      )
      .slice(0, 6);
    setSuggestions(matches);
    setShowDropdown(matches.length > 0);
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.name);
    setShowDropdown(false);
    navigate(`/product/${product.id}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="navbar navbar-expand-lg ss-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <Link className="ss-brand" to="/">
          <span className="ss-logo-icon-container">
            <svg className="ss-logo-s-svg" width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="s-grad-top" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="s-grad-bottom" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <path d="M10 13C10 9 14 6 18 6C22 6 26 9 26 13C26 17 21 18 18 18" stroke="url(#s-grad-top)" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M18 18C15 18 10 19 10 23C10 27 14 30 18 30C22 30 26 27 26 23" stroke="url(#s-grad-bottom)" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="18" cy="18" r="2.5" fill="#4F46E5" />
            </svg>
          </span>
          <span className="ss-brand-name">
            Smart<span className="ss-brand-accent">Shop</span>
          </span>
        </Link>

        {/* Search with Suggestions */}
        <div
          ref={searchRef}
          className="search-container flex-grow-1 d-none d-lg-block mx-5"
          style={{ maxWidth: "420px", position: "relative" }}
        >
          <form onSubmit={handleSearchSubmit} className="search-box w-100">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              autoComplete="off"
            />
          </form>

          {/* Suggestions Dropdown */}
          {showDropdown && (
            <div className="search-suggestions">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="suggestion-img"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{product.name}</span>
                    <span className="suggestion-meta">
                      {product.brand} · {product.category}
                    </span>
                  </div>
                  <span className="suggestion-price">₹{product.price?.toLocaleString()}</span>
                </div>
              ))}
              <div
                className="suggestion-view-all"
                onClick={handleSearchSubmit}
              >
                🔍 See all results for "<strong>{searchQuery}</strong>"
              </div>
            </div>
          )}
        </div>

        <div className="nav-actions d-flex align-items-center gap-3">
          <Link to="/" className="ss-nav-link">Shop</Link>

          <Link to="/cart" className="ss-nav-link">
            Cart ({cartItems.length})
          </Link>

          <Link to="/wishlist" className="ss-nav-link">
            Wishlist ({wishlistItems.length})
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/orders" className="ss-nav-link">My Orders</Link>
              <Link to="/profile" className="ss-nav-link">Profile</Link>
            </>
          )}

          {isAuthenticated && user?.role?.toUpperCase() === "ADMIN" && (
            <Link to="/admin" className="ss-nav-link active" style={{ color: "var(--accent)" }}>
              Admin Panel
            </Link>
          )}

          {isAuthenticated && (
            <span className="user-welcome" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              Hi, <strong style={{ color: "var(--text)" }}>{user?.name || "User"}</strong>
            </span>
          )}

          {isAuthenticated ? (
            <button onClick={handleLogout} className="ss-btn-logout">Logout</button>
          ) : (
            <Link to="/login" className="ss-btn-login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;