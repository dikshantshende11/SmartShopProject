import "./ProductCart.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";

function ProductCard({
  id,
  title,
  price,
  image,
  brand,
  rating,
  reviewCount,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i.id === id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("Please login to add items to cart 🔐");
      return;
    }
    dispatch(addToCart({ id, title, price, image, quantity: 1 }));
    toast.success(`🛒 ${title} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({ id, title, price, image, brand, rating }));
    if (isWishlisted) {
      toast.info(`💔 Removed "${title}" from wishlist.`);
    } else {
      toast.success(`❤️ Added "${title}" to wishlist!`);
    }
  };

  return (
    <div className="card product-card">

      <div className="image-container">
        <img src={image} alt={title} className="product-image" />

        {/* Wishlist Heart Button */}
        <button
          className={`wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

        {/* Rating Badge */}
        <div className="rating-badge">
          <span className="rating-value">{rating || 4.4}</span>
          <span className="star">★</span>
          <span className="review-count">({reviewCount || "49,063"})</span>
        </div>
      </div>

      <div className="card-body">
        <div className="product-info">
          <h6 className="product-brand">{brand}</h6>
          <h5 className="product-title">{title}</h5>
        </div>

        <p className="product-price">₹ {price?.toLocaleString()}</p>

        <div className="d-flex gap-2">
          <Link to={`/product/${id}`} className="btn btn-outline-primary w-50 product-btn">
            Details
          </Link>
          <button onClick={handleAddToCart} className="btn btn-primary w-50 product-btn">
            🛒 Add
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;