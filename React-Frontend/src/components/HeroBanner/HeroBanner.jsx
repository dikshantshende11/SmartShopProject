import { useState, useEffect } from "react";
import "./HeroBanner.css";
import heroElectronics from "../../assets/images/hero_showcase.png";
import heroClothes from "../../assets/images/hero_clothes.png";
import heroFoods from "../../assets/images/hero_foods.png";

const HERO_SLIDES = [
  {
    tag: "⚡ PREMIUM ELECTRONICS",
    title: "Discover Premium Tech Devices",
    desc: "Experience high-end sound, cutting-edge displays, and elegant wearables curated for your lifestyle.",
    btnText: "Explore Tech",
    badgeColor: "rgba(79, 70, 229, 0.08)",
    badgeText: "#4F46E5",
    image: heroElectronics,
    glowColor: "rgba(79, 70, 229, 0.14)",
    themeGrad: "linear-gradient(135deg, #4F46E5 0%, #10B981 100%)"
  },
  {
    tag: "👗 FASHION & APPAREL",
    title: "Trending Styles & Clothes Collection",
    desc: "Elevate your look with our modern outfits, designer apparel, footwear, and casual essentials.",
    btnText: "Shop Clothes",
    badgeColor: "rgba(236, 72, 153, 0.08)",
    badgeText: "#EC4899",
    image: heroClothes,
    glowColor: "rgba(236, 72, 153, 0.14)",
    themeGrad: "linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)"
  },
  {
    tag: "🍎 ORGANIC FOODS & GROCERY",
    title: "Fresh & Healthy Foods Delivered",
    desc: "Savor fresh organic fruits, green vegetables, juices, and premium daily groceries delivered straight to you.",
    btnText: "Order Foods",
    badgeColor: "rgba(16, 185, 129, 0.08)",
    badgeText: "#10B981",
    image: heroFoods,
    glowColor: "rgba(16, 185, 129, 0.14)",
    themeGrad: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)"
  }
];

function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="ss-hero-banner">
      <div className="row align-items-center">
        {/* Left Column: Content */}
        <div className="col-lg-6 ss-hero-content animate-fade-in" key={currentSlide}>
          <span 
            className="ss-hero-badge"
            style={{ backgroundColor: slide.badgeColor, color: slide.badgeText }}
          >
            {slide.tag}
          </span>
          <h1 className="ss-hero-title">
            {slide.title.split(" ").map((word, i) => {
              const words = slide.title.split(" ");
              if (i >= words.length - 2) {
                return (
                  <span 
                    key={i} 
                    className="ss-hero-gradient-text"
                    style={{
                      background: slide.themeGrad,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    {word}{" "}
                  </span>
                );
              }
              return word + " ";
            })}
          </h1>
          <p className="ss-hero-desc">{slide.desc}</p>
          <button 
            className="ss-hero-btn"
            style={{ background: slide.themeGrad }}
          >
            {slide.btnText}
          </button>
        </div>

        {/* Right Column: Premium Image Illustration */}
        <div className="col-lg-6 d-none d-lg-flex ss-hero-image-wrap">
          <div className="ss-hero-image-container">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="ss-hero-image animate-fade-in"
              key={currentSlide}
            />
            {/* Soft decorative visual elements */}
            <div 
              className="ss-hero-circle-glow"
              style={{ background: `radial-gradient(circle, ${slide.glowColor} 0%, transparent 65%)` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Slider Indicator Dots */}
      <div className="ss-hero-dots">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            className={`ss-hero-dot ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundColor: index === currentSlide ? slide.badgeText : "var(--text-dim)" }}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;