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

  // Apply both search term AND category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

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

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: "800", marginBottom: 0 }}>
          {sectionTitle}
        </h2>
        {selectedCategory && (
          <button
            className="btn btn-sm"
            style={{
              background: "var(--primary-light)",
              color: "var(--primary)",
              border: "1px solid var(--primary)",
              borderRadius: "99px",
              fontWeight: "700",
              fontSize: "0.8rem",
              padding: "4px 14px",
            }}
            onClick={() => setSelectedCategory(null)}
          >
            ✕ Clear Filter
          </button>
        )}
      </div>

      <div className="row">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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