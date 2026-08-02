import axiosInstance from "../api/axiosConfig";

const PROD_PRODUCT_URL = "https://smartshopproject-production-0cfb.up.railway.app";

const FALLBACK_PRODUCTS = [
  { id: 1, name: "iPhone 15 Pro", brand: "Apple", category: "Mobiles", description: "Super Retina XDR display, Titanium design, A17 Pro chip.", price: 129000, rating: 4.8, reviewCount: 245, stock: 50, imageUrl: "/images/iphone15.png", available: true },
  { id: 2, name: "MacBook Pro M3", brand: "Apple", category: "Electronics", description: "Supercharged by M3 chip, Liquid Retina XDR display, up to 22 hours battery.", price: 169000, rating: 4.9, reviewCount: 312, stock: 30, imageUrl: "/images/macbookm3.png", available: true },
  { id: 3, name: "Sony WH-1000XM5", brand: "Sony", category: "Electronics", description: "Industry-leading noise canceling headphones with premium sound quality.", price: 29990, rating: 4.7, reviewCount: 340, stock: 100, imageUrl: "/images/sonyheadphones.png", available: true },
  { id: 4, name: "Nike Air Max", brand: "Nike", category: "Fashion", description: "Comfortable sports and lifestyle sneakers.", price: 8990, rating: 4.5, reviewCount: 512, stock: 200, imageUrl: "/images/nikeairmax.png", available: true },
  { id: 5, name: "Samsung Galaxy S24", brand: "Samsung", category: "Mobiles", description: "Flagship Samsung phone with AI features and high zoom camera.", price: 79999, rating: 4.6, reviewCount: 98, stock: 40, imageUrl: "/images/samsungs24.png", available: true },
  { id: 6, name: "Keychron K2 Keyboard", brand: "Keychron", category: "Electronics", description: "Premium mechanical keyboard with customizable brown switches.", price: 6999, rating: 4.8, reviewCount: 42, stock: 15, imageUrl: "/images/keychronk2.png", available: true },
  { id: 7, name: "Premium Face Serum", brand: "L'Oreal", category: "Beauty", description: "Hydrating face serum with hyaluronic acid.", price: 1499, rating: 4.3, reviewCount: 85, stock: 40, imageUrl: "/images/faceserum.png", available: true },
  { id: 8, name: "Organic Almonds", brand: "Happilo", category: "Food", description: "Premium raw organic almonds.", price: 499, rating: 4.6, reviewCount: 120, stock: 150, imageUrl: "/images/almonds.png", available: true }
];

export const fetchAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/api/products");
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.content) && response.data.content.length > 0) {
      return response.data.content;
    }
  } catch (error) {
    console.warn("Axios fetch failed, trying direct cloud fetch fallback:", error);
  }

  // Cloud direct fetch fallback
  try {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const targetUrl = isLocal ? "http://localhost:8082/api/products" : `${PROD_PRODUCT_URL}/api/products`;
    
    const res = await fetch(targetUrl);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      if (data && Array.isArray(data.content) && data.content.length > 0) return data.content;
    }
  } catch (directErr) {
    console.error("Direct fetch error:", directErr);
  }

  console.warn("Backend products unreachable — using fallback store catalog.");
  return FALLBACK_PRODUCTS;
};

export const addProduct = async (productData) => {
  const response = await axiosInstance.post("/api/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(`/api/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
};