const CATEGORIES_DATA = [
  { name: "Fashion",     icon: "👗" },
  { name: "Beauty",      icon: "💄" },
  { name: "Mobiles",     icon: "📱" },
  { name: "Food",        icon: "🍎" },
  { name: "Electronics", icon: "⚡" },
];

function Categories({ selectedCategory, onSelect }) {
  return (
    <div className="d-flex justify-content-center flex-wrap mb-5" style={{ gap: "60px" }}>
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
  );
}

export default Categories;