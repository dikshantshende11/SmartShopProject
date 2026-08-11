const CATEGORIES_DATA = [
  { name: "Fashion",     icon: "👗" },
  { name: "Beauty",      icon: "💄" },
  { name: "Mobiles",     icon: "📱" },
  { name: "Food",        icon: "🍎" },
  { name: "Electronics", icon: "⚡" },
];

function Categories({ selectedCategory, onSelect }) {
  return (
    <div className="categories-container mb-4 mb-md-5">
      <div className="categories-scroll-track">
      {CATEGORIES_DATA.map((cat, index) => {
        const isActive = selectedCategory === cat.name;
        return (
          <div
            key={index}
            className={`category-pill-card ${isActive ? "category-pill-active" : ""}`}
            onClick={() => onSelect(isActive ? null : cat.name)}
            title={`Filter by ${cat.name}`}
          >
            <div className={`category-icon-wrapper ${isActive ? "category-icon-active" : ""}`}>
              {cat.icon}
            </div>
            <span className={`category-label-text ${isActive ? "category-label-active" : ""}`}>
              {cat.name}
            </span>
            {isActive && <span className="category-active-dot" />}
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default Categories;