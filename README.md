# 🛒 SmartShop — Microservices E-Commerce Platform

A full-stack e-commerce application built with **Spring Boot Microservices** architecture and **React.js** frontend. Features include product browsing, cart management, wishlist, order placement, customer reviews, and an admin panel.

---

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  React.js   │────▶│  API Gateway │────▶│  Eureka Server  │
│  Frontend   │     │  (Port 8080) │     │  (Port 8761)    │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
      ┌──────────┐  ┌──────────┐  ┌──────────┐
      │ Product  │  │  Order   │  │   User   │
      │ Service  │  │ Service  │  │ Service  │
      │ (8081)   │  │ (8082)   │  │ (8083)   │
      └────┬─────┘  └────┬─────┘  └────┬─────┘
           │              │             │
           └──────────────┼─────────────┘
                          ▼
                    ┌──────────┐     ┌───────────────────┐
                    │  MySQL   │     │ Notification Svc  │
                    │  (3306)  │     │ (Kafka Consumer)  │
                    └──────────┘     └───────────────────┘
                                           ▲
                                     ┌─────┴─────┐
                                     │   Kafka   │
                                     │ (9092)    │
                                     └───────────┘
```

---

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** — Browse products with search and category filtering
- **Product Details** — Detailed view with images, pricing, stock status, and quantity selector
- **Customer Reviews** — Star ratings, progress bar breakdown, and submit review form
- **Shopping Cart** — Add/remove items, quantity management with Redux state
- **Wishlist** — Heart toggle on product cards, dedicated wishlist page with empty state
- **Checkout & Orders** — Place orders with dynamic success page showing real Order IDs
- **Order History** — Track all placed orders

### 🔐 Authentication
- User Registration & Login
- Role-based access (USER / ADMIN)
- Protected routes

### 🛠️ Admin Features
- Add, edit, and delete products
- Product management dashboard

### 🎨 Design
- Premium UI with glassmorphic cards and gradient accents
- Smooth animations and micro-interactions
- AI-generated high-quality product images
- Responsive layout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Redux Toolkit, React Router, Vite |
| **Backend** | Spring Boot (Java 17) |
| **API Gateway** | Spring Cloud Gateway |
| **Service Discovery** | Netflix Eureka |
| **Database** | MySQL 8 |
| **Messaging** | Apache Kafka + Zookeeper |
| **Containerization** | Docker & Docker Compose |
| **Styling** | CSS3 with CSS Variables, Bootstrap 5 |

---

## 📁 Project Structure

```
SmartShopProject/
├── React-Frontend/          # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, ProductCard, Footer)
│   │   ├── pages/           # Page components (Home, ProductDetails, Cart, etc.)
│   │   ├── features/        # Redux slices (cart, wishlist, auth)
│   │   ├── services/        # API service layers
│   │   └── routes/          # App routing configuration
│   └── public/images/       # Product images
├── product-service/         # Product microservice (CRUD operations)
├── order-service/           # Order microservice (order management)
├── user-service/            # User microservice (authentication)
├── notification-service/    # Kafka consumer for notifications
├── eureka-server/           # Service discovery server
├── api-gateway/             # API Gateway for routing
├── docker-compose.yml       # Docker orchestration
└── seed.sql                 # Database seed script
```

---

## 🚀 Getting Started

### Prerequisites
- **Docker Desktop** installed and running
- **Node.js** (v18+) and npm

### 1. Clone the Repository
```bash
git clone https://github.com/dikshantshende11/SmartShopProject.git
cd SmartShopProject
```

### 2. Start Backend Services
```bash
docker compose up -d
```
This starts MySQL, Eureka, API Gateway, all microservices, Kafka, and Zookeeper.

### 3. Seed the Database
```bash
# Windows PowerShell
Get-Content seed.sql | docker exec -i mysql mysql -uroot -proot

# Linux/Mac
cat seed.sql | docker exec -i mysql mysql -uroot -proot
```

### 4. Start Frontend
```bash
cd React-Frontend
npm install
npm run dev
```

### 5. Open the App
Visit **http://localhost:5173** in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | admin123 |
| User | user@gmail.com | user123 |

---

## 📸 Screenshots

### Home Page
Premium product catalog with search and category filtering.

### Product Details
Detailed product view with reviews, ratings, and wishlist integration.

### Shopping Cart & Checkout
Full cart management with checkout flow and dynamic order success page.

---

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you found this project helpful, give it a star!**
