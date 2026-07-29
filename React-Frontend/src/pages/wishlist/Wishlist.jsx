import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCart/ProductCart";
import "./Wishlist.css";

function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <div className="container wishlist-page mt-5 mb-5 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="wishlist-title">
            My <span>Wishlist</span> ❤️
          </h1>
          <p className="wishlist-subtitle">
            Manage your favorite saved items here.
          </p>
        </div>
        <Link to="/" className="ss-btn-secondary">
          Back to Shop
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty-state text-center py-5">
          <div className="wishlist-empty-icon">❤️</div>
          <h3 className="mt-3 fw-bold text-white">Your wishlist is empty</h3>
          <p className="text-muted">
            Explore our collections and tap the heart icon on any product to save it here.
          </p>
          <Link to="/" className="btn btn-primary mt-3 px-4 py-2" style={{ borderRadius: "8px", fontWeight: "700" }}>
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map((product) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
              <ProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                brand={product.brand}
                rating={product.rating}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
