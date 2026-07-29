# 🎙️ SmartShop Project — Complete Interview Preparation Guide

This document contains a complete guide to explaining the **SmartShop Microservices E-Commerce Platform** during technical interviews.

---

## 1. 30-Second Elevator Pitch

> *"SmartShop is a **full-stack microservices e-commerce platform** built using **Spring Boot** for backend microservices, **MySQL 8** for relational storage, **Apache Kafka** for asynchronous event messaging, and **React.js with Redux Toolkit** for a modern single-page application frontend. The entire application is containerized using **Docker Compose** for multi-service orchestration."*

---

## 2. Technical Architecture & Microservices Breakdown

### Architecture Diagram
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

### Microservices Responsibilities

1. **Eureka Server (`port 8761`)**
   - Service registry for dynamic service discovery.
   - Allows services to locate each other without hardcoding IP addresses.

2. **API Gateway (`port 8080`)**
   - Central entry point for all frontend API calls.
   - Handles route forwarding, CORS headers, and security middleware.

3. **User Microservice (`port 8083`)**
   - Handles user registration, login authentication, and JWT authorization.
   - Manages user roles (`USER` and `ADMIN`).

4. **Product Microservice (`port 8081`)**
   - Manages product catalog CRUD operations, categories, prices, and stock counts.
   - Enables catalog search and category filtering.

5. **Order Microservice (`port 8082`)**
   - Processes checkout requests and order creation.
   - Communicates with Product service to verify availability.
   - Publishes order events to Kafka topics upon order creation.

6. **Notification Microservice**
   - Listens asynchronously to Kafka topics (`order-events`).
   - Triggers order confirmation processing.

7. **Database & Infrastructure**
   - **MySQL 8:** Stores persistent tables (`product`, `orders`, `users`).
   - **Docker Compose:** Orchestrates container startup, health checks, and networking.

---

## 3. Frontend Features & Engineering (React.js + Redux)

- **Global State Management:** Redux Toolkit manages application state across pages:
  - `cartSlice`: Item additions, quantity increments/decrements, price totals.
  - `wishlistSlice`: Wishlist heart toggle states and navbar counts.
  - `authSlice`: JWT tokens, user profiles, login status.
- **Product Details & Customer Reviews:**
  - Dynamic star rating average calculations.
  - Percentage distribution progress bars (5★ to 1★).
  - Interactive review submission form (1–5 gold stars, comment input).
- **Wishlist System:**
  - Glassmorphic heart toggle button with scale pulse keyframe animations.
  - Dedicated wishlist page with empty state handling.
- **Dynamic Order Success Page:**
  - Reads order payload state from React Router navigation.
  - Renders database-generated Order ID badges (e.g. `#101`, `#102`) and order tracking quick-links.

---

## 4. Git & GitHub Version Control Workflow

When asked: *"How did you manage version control and push to GitHub?"*

1. **Configured `.gitignore`:** Filtered out build output (`target/`), `node_modules/`, log files, and Docker volume data.
2. **Authored Comprehensive `README.md`:** Documented the architecture, tech stack, feature sets, credentials, and Docker setup instructions.
3. **Staged & Committed Code:** Staged all microservices and frontend code (`git add .`) and created an initial commit checkpoint (`git commit -m "Initial commit"`).
4. **OAuth Authentication & Push:** Linked local repo to GitHub (`git remote add origin`), authorized via **Git Credential Manager**, and pushed the codebase to `main` branch (`git push -u origin main`).

---

## 5. Frequently Asked Questions (Interview Q&A)

### Q1: Why did you choose Microservices over a Monolith?
> *"Microservices allow independent deployment, scaling, and fault isolation. If the notification service goes down, users can still browse products and place orders without breaking the core platform."*

### Q2: How do your microservices communicate?
> *"Synchronously, API Gateway routes REST requests to individual microservices via HTTP. Asynchronously, Order service publishes purchase events to Apache Kafka, which Notification service consumes without blocking the main checkout thread."*

### Q3: How do you handle authentication across microservices?
> *"User service generates a JWT token upon login. The API Gateway and downstream services validate the token signature to enforce role-based authorization for protected endpoints."*

---

## 🛠️ Summary Reference Table

| Layer | Component | Technology | Port |
|---|---|---|---|
| Frontend | React Single Page App | React.js, Redux, Vite, Bootstrap | 5173 |
| Gateway | API Gateway | Spring Cloud Gateway | 8080 |
| Discovery | Eureka Server | Netflix Eureka | 8761 |
| Microservice | Product Service | Spring Boot, JPA | 8081 |
| Microservice | Order Service | Spring Boot, Feign/WebClient | 8082 |
| Microservice | User Service | Spring Boot, Security, JWT | 8083 |
| Messaging | Event Bus | Apache Kafka + Zookeeper | 9092 / 2181 |
| Database | Relational Storage | MySQL 8 | 3306 |
| DevOps | Containerization | Docker & Docker Compose | N/A |
