import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCart/ProductCart";
import HeroBanner from "../components/HeroBanner/HeroBanner";
import Categories from "../components/Categories/Categories";
import { fetchAllProducts } from "../services/productService";

/* ── Skeleton card shown while loading ── */
function SkeletonCard() {
  return (
    <div className="col-md-4 mb-4">
      <div className="skeleton-card">
        <div className="skeleton-image skeleton-shimmer" />
        <div className="skeleton-body">
          <div className="skeleton-line skeleton-shimmer" style={{ width: "40%", height: "12px" }} />
          <div className="skeleton-line skeleton-shimmer" style={{ width: "75%", height: "16px", marginTop: "8px" }} />
          <div className="skeleton-line skeleton-shimmer" style={{ width: "50%", height: "22px", marginTop: "12px" }} />
          <div className="skeleton-line skeleton-shimmer" style={{ width: "100%", height: "38px", marginTop: "16px", borderRadius: "8px" }} />
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [products, setProducts]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Advanced Sorting & Filter States
  const [sortBy, setSortBy]                   = useState("featured");
  const [minRating, setMinRating]             = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by search term, category, and minimum rating
  let processedProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    const matchesRating = minRating ? (product.rating || 0) >= minRating : true;
    return matchesSearch && matchesCategory && matchesRating;
  });

  // Apply sorting algorithm
  if (sortBy === "price-asc") {
    processedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "price-desc") {
    processedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === "rating-desc") {
    processedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "name-asc") {
    processedProducts.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSortBy("featured");
    setMinRating(0);
  };

  const sectionTitle = selectedCategory
    ? `${selectedCategory} Products`
    : searchTerm
    ? `Results for "${searchTerm}"`
    : "Featured Products";

  return (
    <div className="container mt-4">

      <HeroBanner />

      <Categories
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* CATALOG CONTROLS TOOLBAR */}
      <div className="catalog-toolbar d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-3 rounded" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="d-flex align-items-center gap-2">
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: "800", marginBottom: 0 }}>
            {sectionTitle}
          </h2>
          <span className="badge bg-primary rounded-pill">{processedProducts.length} items</span>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3">
          {/* Min Rating Filter */}
          <div className="d-flex align-items-center gap-2">
            <label className="toolbar-label text-muted mb-0" style={{ fontSize: "0.85rem", fontWeight: "700" }}>Rating:</label>
            <select
              className="form-select form-select-sm toolbar-select"
              style={{ width: "130px", background: "var(--bg-card2)", color: "var(--text)", borderColor: "var(--border)", fontWeight: "600" }}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={0}>All Ratings</option>
              <option value={4.0}>4.0★ & above</option>
              <option value={4.5}>4.5★ & above</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <label className="toolbar-label text-muted mb-0" style={{ fontSize: "0.85rem", fontWeight: "700" }}>Sort By:</label>
            <select
              className="form-select form-select-sm toolbar-select"
              style={{ width: "175px", background: "var(--bg-card2)", color: "var(--text)", borderColor: "var(--border)", fontWeight: "600" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {(selectedCategory || sortBy !== "featured" || minRating !== 0) && (
            <button
              className="btn btn-sm btn-outline-danger"
              style={{ borderRadius: "99px", fontWeight: "700", fontSize: "0.8rem", padding: "4px 14px" }}
              onClick={handleResetFilters}
            >
              ✕ Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="row">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : processedProducts.length > 0 ? (
          processedProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <ProductCard
                id={product.id}
                title={product.name}
                price={product.price}
                image={product.imageUrl}
                brand={product.brand}
                rating={product.rating}
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div style={{ fontSize: "3rem" }}>
              {selectedCategory ? "🗂️" : "🔍"}
            </div>
            <h5 className="mt-3">
              {selectedCategory
                ? `No products in "${selectedCategory}" yet.`
                : `No results for "${searchTerm}"`}
            </h5>
            <p className="text-muted">
              {selectedCategory
                ? "Try another category or browse all products."
                : "Try a different search term."}
            </p>
            {selectedCategory && (
              <button
                className="btn btn-primary mt-2"
                onClick={() => setSelectedCategory(null)}
              >
                Show All Products
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;