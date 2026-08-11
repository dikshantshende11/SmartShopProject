import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { fetchAllProducts } from "../../services/productService";
import "../../styles/navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Sidebar Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Theme Toggle State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Load products once for suggestions
  useEffect(() => {
    fetchAllProducts()
      .then((data) => setAllProducts(data || []))
      .catch(() => {});
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)
      ) {
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

  const userAvatarEmoji = user ? localStorage.getItem(`avatar_${user.id}`) || "🧑‍💻" : "👤";

  return (
    <>
      <nav className="navbar navbar-expand-lg ss-navbar">
        <div className="container-fluid px-3 px-md-4 px-lg-5 d-flex align-items-center justify-content-between">

          {/* LEFT SIDE: HAMBURGER + SMARTSHOP LOGO (NUDGED RIGHT) */}
          <div className="d-flex align-items-center gap-3 gap-md-4">
            {/* 3-LINE HAMBURGER BUTTON */}
            <button
              className="ss-hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              title="Open Navigation Menu"
              aria-label="Open Navigation Drawer"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            {/* PRESERVED OFFICIAL SMARTSHOP LOGO (NUDGED RIGHT) */}
            <Link className="ss-brand ms-2 ms-md-3" to="/">
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
          </div>

          {/* SEARCH BAR & RIGHT ICONS WITH CLEAN TIED SPACING */}
          <div className="d-flex align-items-center gap-2 gap-md-3 flex-grow-1 justify-content-end ms-2 ms-md-4">
            
            {/* DESKTOP SEARCH BAR */}
            <div
              ref={searchRef}
              className="search-container d-none d-md-block flex-grow-1"
              style={{ maxWidth: "440px", position: "relative" }}
            >
              <form onSubmit={handleSearchSubmit} className="search-box w-100">
                <input
                  type="text"
                  placeholder="Search products, brands & categories..."
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

            {/* MOBILE SEARCH TOGGLE BUTTON */}
            <button
              className="ss-nav-icon-btn d-md-none"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              title="Search Products"
              aria-label="Toggle Search"
            >
              <span>🔍</span>
            </button>

            {/* THEME TOGGLE ICON (DESKTOP & MOBILE) */}
            <button
              className="ss-nav-icon-btn ss-theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
              aria-label="Toggle Color Theme"
            >
              <span>{theme === "light" ? "🌙" : "☀️"}</span>
            </button>

            {/* WISHLIST ICON BUTTON (DESKTOP) */}
            <Link to="/wishlist" className="ss-nav-icon-btn position-relative d-none d-sm-inline-flex" title="Saved Wishlist">
              <span style={{ fontSize: "1.15rem" }}>❤️</span>
              {wishlistItems.length > 0 && (
                <span className="nav-icon-badge bg-danger">{wishlistItems.length}</span>
              )}
            </Link>

            {/* CART ICON BUTTON */}
            <Link to="/cart" className="ss-nav-icon-btn position-relative" title="Shopping Cart">
              <span style={{ fontSize: "1.15rem" }}>🛒</span>
              {cartItems.length > 0 && (
                <span className="nav-icon-badge bg-primary">{cartItems.length}</span>
              )}
            </Link>

            {/* USER PROFILE AVATAR / LOGIN BUTTON */}
            {isAuthenticated ? (
              <Link to="/profile" className="ss-nav-profile-avatar-btn position-relative" title={`Profile: ${user?.name}`}>
                <span className="ss-nav-avatar-emoji">{userAvatarEmoji}</span>
                <span className="online-dot" />
              </Link>
            ) : (
              <Link to="/login" className="ss-btn-login ms-1">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* EXPANDABLE MOBILE SEARCH ROW */}
        {isMobileSearchOpen && (
          <div className="ss-mobile-search-bar px-3 pt-2 pb-3 d-md-none border-top" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="search-box w-100 position-relative">
              <input
                type="text"
                placeholder="Search products, brands..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                autoComplete="off"
                autoFocus
              />
            </form>

            {/* Mobile Suggestions Dropdown */}
            {showDropdown && (
              <div className="search-suggestions search-suggestions-mobile mt-2">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => {
                      handleSuggestionClick(product);
                      setIsMobileSearchOpen(false);
                    }}
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
                  onClick={(e) => {
                    handleSearchSubmit(e);
                    setIsMobileSearchOpen(false);
                  }}
                >
                  🔍 See all results for "<strong>{searchQuery}</strong>"
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* SIDEBAR DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div className="ss-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SLIDING GLASSMORPHIC SIDEBAR DRAWER */}
      <div className={`ss-sidebar-drawer ${isSidebarOpen ? "open" : ""}`}>
        {/* DRAWER HEADER */}
        <div className="ss-drawer-header d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="ss-logo-icon-container" style={{ width: "30px", height: "30px" }}>
              <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
                <path d="M10 13C10 9 14 6 18 6C22 6 26 9 26 13C26 17 21 18 18 18" stroke="#4F46E5" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M18 18C15 18 10 19 10 23C10 27 14 30 18 30C22 30 26 27 26 23" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="18" cy="18" r="2.5" fill="#4F46E5" />
              </svg>
            </span>
            <span className="ss-brand-name" style={{ fontSize: "1.2rem" }}>
              Smart<span className="ss-brand-accent">Shop</span>
            </span>
          </div>
          <button className="ss-drawer-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close Drawer">
            ✕
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="ss-drawer-body p-3">
          {/* USER WELCOME BADGE */}
          {isAuthenticated && (
            <div className="ss-drawer-user-card mb-4 p-3 rounded d-flex align-items-center gap-3">
              <div className="ss-drawer-avatar-emoji">
                {userAvatarEmoji}
              </div>
              <div className="text-truncate">
                <div className="fw-bold text-white" style={{ fontSize: "0.95rem" }}>
                  {user?.name}
                </div>
                <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {user?.email}
                </small>
              </div>
            </div>
          )}

          {/* MAIN NAVIGATION */}
          <div className="ss-drawer-section mb-4">
            <div className="ss-drawer-section-title mb-2 text-muted fw-bold" style={{ fontSize: "0.72rem", letterSpacing: "1px" }}>
              NAVIGATION
            </div>
            <div className="d-flex flex-column gap-1">
              <Link to="/" className="ss-drawer-item" onClick={() => setIsSidebarOpen(false)}>
                <span className="me-2">🏠</span> Home / Shop Catalog
              </Link>
              <Link to="/cart" className="ss-drawer-item d-flex justify-content-between align-items-center" onClick={() => setIsSidebarOpen(false)}>
                <div><span className="me-2">🛒</span> Shopping Cart</div>
                <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
              </Link>
              <Link to="/wishlist" className="ss-drawer-item d-flex justify-content-between align-items-center" onClick={() => setIsSidebarOpen(false)}>
                <div><span className="me-2">❤️</span> Saved Wishlist</div>
                <span className="badge bg-danger rounded-pill">{wishlistItems.length}</span>
              </Link>
              {isAuthenticated && (
                <Link to="/orders" className="ss-drawer-item" onClick={() => setIsSidebarOpen(false)}>
                  <span className="me-2">📜</span> My Order History
                </Link>
              )}
            </div>
          </div>

          {/* PRODUCT CATEGORIES */}
          <div className="ss-drawer-section mb-4">
            <div className="ss-drawer-section-title mb-2 text-muted fw-bold" style={{ fontSize: "0.72rem", letterSpacing: "1px" }}>
              CATEGORIES
            </div>
            <div className="d-flex flex-column gap-1">
              <Link to="/?category=Electronics" className="ss-drawer-item" onClick={() => setIsSidebarOpen(false)}>
                <span className="me-2">📱</span> Electronics & Gadgets
              </Link>
              <Link to="/?category=Groceries" className="ss-drawer-item" onClick={() => setIsSidebarOpen(false)}>
                <span className="me-2">🥑</span> Organic Groceries
              </Link>
              <Link to="/?category=Fashion" className="ss-drawer-item" onClick={() => setIsSidebarOpen(false)}>
                <span className="me-2">👟</span> Fashion & Footwear
              </Link>
              <Link to="/?category=Home" className="ss-drawer-item" onClick={() => setIsSidebarOpen(false)}>
                <span className="me-2">🏠</span> Home Essentials
              </Link>
            </div>
          </div>

          {/* USER ACCOUNT & ADMIN */}
          <div className="ss-drawer-section mb-4">
            <div className="ss-drawer-section-title mb-2 text-muted fw-bold" style={{ fontSize: "0.72rem", letterSpacing: "1px" }}>
              ACCOUNT & SETTINGS
            </div>
            <div className="d-flex flex-column gap-1">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="ss-drawer-item" onClick={() => setIsSidebarOpen(false)}>
                    <span className="me-2">👤</span> My Profile & Avatar
                  </Link>
                  {user?.role?.toUpperCase() === "ADMIN" && (
                    <Link to="/admin" className="ss-drawer-item admin-item" onClick={() => setIsSidebarOpen(false)}>
                      <span className="me-2">🛡️</span> Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <Link to="/login" className="ss-drawer-item" onClick={() => setIsSidebarOpen(false)}>
                  <span className="me-2">🔑</span> Login / Register
                </Link>
              )}

              {/* THEME TOGGLE BUTTON IN SIDEBAR */}
              <div className="ss-drawer-item d-flex justify-content-between align-items-center" onClick={toggleTheme} style={{ cursor: "pointer" }}>
                <div>
                  <span className="me-2">{theme === "light" ? "🌙" : "☀️"}</span>
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </div>
                <span className="badge bg-secondary">{theme.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DRAWER FOOTER */}
        {isAuthenticated && (
          <div className="ss-drawer-footer p-3 border-top">
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                handleLogout();
              }}
              className="btn btn-outline-danger w-100 fw-bold py-2"
              style={{ borderRadius: "10px" }}
            >
              🚪 Logout Account
            </button>
          </div>
        )}
      </div>

      {/* ── MOBILE APP-LIKE BOTTOM NAVIGATION BAR ── */}
      <nav className="ss-mobile-bottom-nav d-md-none">
        <Link
          to="/"
          className={`ss-bottom-nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <span className="ss-bottom-nav-icon">🏠</span>
          <span className="ss-bottom-nav-label">Home</span>
        </Link>

        <button
          className="ss-bottom-nav-item ss-bottom-nav-btn"
          onClick={() => setIsSidebarOpen(true)}
        >
          <span className="ss-bottom-nav-icon">☰</span>
          <span className="ss-bottom-nav-label">Menu</span>
        </button>

        <Link
          to="/wishlist"
          className={`ss-bottom-nav-item position-relative ${location.pathname === "/wishlist" ? "active" : ""}`}
        >
          <span className="ss-bottom-nav-icon">❤️</span>
          {wishlistItems.length > 0 && (
            <span className="ss-bottom-nav-badge bg-danger">{wishlistItems.length}</span>
          )}
          <span className="ss-bottom-nav-label">Wishlist</span>
        </Link>

        <Link
          to="/cart"
          className={`ss-bottom-nav-item position-relative ${location.pathname === "/cart" ? "active" : ""}`}
        >
          <span className="ss-bottom-nav-icon">🛒</span>
          {cartItems.length > 0 && (
            <span className="ss-bottom-nav-badge bg-primary">{cartItems.length}</span>
          )}
          <span className="ss-bottom-nav-label">Cart</span>
        </Link>

        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className={`ss-bottom-nav-item ${location.pathname === "/profile" || location.pathname === "/login" ? "active" : ""}`}
        >
          <span className="ss-bottom-nav-icon">{isAuthenticated ? userAvatarEmoji : "👤"}</span>
          <span className="ss-bottom-nav-label">{isAuthenticated ? "Profile" : "Login"}</span>
        </Link>
      </nav>
    </>
  );
}

export default Navbar;