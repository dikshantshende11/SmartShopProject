import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../api/axiosConfig";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCart/ProductCart";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const isWishlisted = product ? wishlistItems.some((i) => i.id === product.id) : false;
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Reviews Section State
  const [reviews, setReviews] = useState([
    { id: 1, name: "Aarav Sharma", rating: 5, date: "2026-07-10", comment: "Outstanding product! Exceeded my expectations in quality and speed." },
    { id: 2, name: "Priya Patel", rating: 4, date: "2026-07-08", comment: "Very good value for money. Built well and looks very premium." },
    { id: 3, name: "Rohan Das", rating: 5, date: "2026-07-05", comment: "Perfect choice! Shipping was fast and the product is amazing." },
    { id: 4, name: "Neha Sen", rating: 3, date: "2026-06-28", comment: "Decent performance, but shipping took slightly longer than expected." }
  ]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
        setQuantity(1);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      axiosInstance
        .get("/api/products")
        .then((response) => {
          const related = response.data.filter(
            (p) => p.category === product.category && p.id !== product.id
          );
          setRelatedProducts(related.slice(0, 4));
        })
        .catch((error) => {
          console.error("Error fetching related products:", error);
        });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h3>Loading Product...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container text-center mt-5">
        <h2>Product Not Found</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("Please login to add items 🔐");
      return;
    }
    dispatch(
      addToCart({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: quantity,
      })
    );
    toast.success(`🛒 ${quantity} × ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("Please login to continue 🔐");
      return;
    }
    dispatch(
      addToCart({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: quantity,
      })
    );
    navigate("/checkout");
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.info("Please login to manage wishlist 🔐");
      return;
    }
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.imageUrl,
        brand: product.brand,
        rating: product.rating,
      })
    );
    if (isWishlisted) {
      toast.info(`💔 Removed "${product.name}" from wishlist.`);
    } else {
      toast.success(`❤️ Added "${product.name}" to wishlist!`);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }
    const newReview = {
      id: Date.now(),
      name: reviewName.trim() || "Anonymous Buyer",
      rating: reviewRating,
      date: new Date().toISOString().split("T")[0],
      comment: reviewComment.trim(),
    };
    setReviews([newReview, ...reviews]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    toast.success("🎉 Thank you for your review!");
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row g-5">
        {/* LEFT SIDE */}
        <div className="col-lg-5">
          <div className="image-card">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="details-image"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-7">
          <div className="details-card">
            <h2 className="product-heading">
              <span className="brand-name">
                {product.brand}
              </span>
              <span className="product-name">
                {" "}
                {product.name}
              </span>
            </h2>

            <div className="rating-box">
              ⭐ {product.rating}
              <span>
                {" "}
                | {product.reviewCount} Reviews
              </span>
            </div>

            <h1 className="price">
              ₹ {product.price.toLocaleString()}
            </h1>

            <p
              className={
                product.available
                  ? "stock available"
                  : "stock unavailable"
              }
            >
              {product.available
                ? "✔ In Stock"
                : "❌ Out of Stock"}
            </p>

            <hr />

            <div className="info-row">
              <strong>Brand</strong>
              <span>{product.brand}</span>
            </div>

            <div className="info-row">
              <strong>Category</strong>
              <span>{product.category}</span>
            </div>

            <div className="info-row">
              <strong>Available Stock</strong>
              <span>{product.stock}</span>
            </div>

            <hr />

            {/* QUANTITY SELECTOR */}
            <div className="info-row align-items-center mb-4">
              <strong>Select Quantity</strong>
              <div className="d-flex align-items-center gap-2">
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  style={{ width: "32px", height: "32px", borderRadius: "50%", fontWeight: "bold" }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="fs-5 px-2" style={{ minWidth: "30px", textAlign: "center", fontWeight: "600" }}>{quantity}</span>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  style={{ width: "32px", height: "32px", borderRadius: "50%", fontWeight: "bold" }}
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <hr />

            <h5>Description</h5>
            <p className="description text-muted">
              {product.description}
            </p>

            <div className="mt-4 d-flex gap-3">
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={handleAddToCart}
                disabled={!product.available}
              >
                🛒 Add To Cart
              </button>

              <button
                className="btn btn-warning btn-lg"
                onClick={handleBuyNow}
                disabled={!product.available}
              >
                Buy Now
              </button>

              <button
                className={`btn btn-lg ${isWishlisted ? "btn-danger" : "btn-outline-danger"}`}
                onClick={handleWishlist}
              >
                {isWishlisted ? "❤️ Wishlisted" : "🖤 Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMER REVIEWS */}
      <div className="reviews-section mt-5 pt-5 border-top">
        <h3 className="mb-4" style={{ fontFamily: "'Syne', sans-serif", fontWeight: "700", color: "var(--text)" }}>
          Customer Reviews
        </h3>
        
        <div className="row g-5">
          {/* Summary Ratings Column */}
          <div className="col-lg-4">
            <div className="rating-summary-card">
              <div className="d-flex align-items-center gap-3 mb-3">
                <h1 className="display-4 fw-extrabold mb-0 text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {avgRating}
                </h1>
                <div>
                  <div className="stars-row">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`star-icon ${i < Math.round(avgRating) ? "active" : ""}`}>★</span>
                    ))}
                  </div>
                  <small className="text-muted">{reviews.length} rating{reviews.length > 1 ? "s" : ""}</small>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="rating-bars-container">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter((r) => r.rating === stars).length;
                  const percent = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="rating-bar-row">
                      <span className="rating-bar-label">{stars} Star</span>
                      <div className="rating-bar-progress">
                        <div className="rating-bar-fill" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="rating-bar-value">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List & Form Column */}
          <div className="col-lg-8">
            <div className="reviews-list-container">
              {reviews.map((r) => (
                <div key={r.id} className="review-card-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="reviewer-name">{r.name}</span>
                    <span className="review-date">{r.date}</span>
                  </div>
                  <div className="review-stars-row mb-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} className={`star-icon ${idx < r.rating ? "active" : ""}`}>★</span>
                    ))}
                  </div>
                  <p className="review-comment-text">{r.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <div className="review-form-card mt-4">
              <h5 className="mb-3 text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: "700" }}>
                Write a Review
              </h5>
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-3">
                    <label className="review-label">Select Rating</label>
                    <div className="interactive-star-selector">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <span
                          key={val}
                          className={`star-select-icon ${val <= reviewRating ? "active" : ""}`}
                          onClick={() => setReviewRating(val)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="review-label">Your Name</label>
                    <input
                      type="text"
                      className="review-form-input"
                      placeholder="e.g. Jane Doe"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="review-label">Your Comment *</label>
                    <textarea
                      className="review-form-input"
                      rows="3"
                      placeholder="Describe your experience with the product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary px-4 py-2" style={{ fontWeight: "700", borderRadius: "8px" }}>
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="alert alert-info text-center" style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  Please <Link to="/login" className="fw-bold" style={{ color: "var(--primary)" }}>Login</Link> to share your review with other buyers. 🔐
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="related-products-section mt-5 pt-5 border-top">
        <h3 className="mb-4" style={{ fontFamily: "'Syne', sans-serif", fontWeight: "700" }}>You May Also Like</h3>
        <div className="row">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relProd) => (
              <div key={relProd.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <ProductCard
                  id={relProd.id}
                  title={relProd.name}
                  price={relProd.price}
                  image={relProd.imageUrl}
                  brand={relProd.brand}
                  rating={relProd.rating}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-muted">No related products found in this category.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;