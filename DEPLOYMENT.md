# 🚀 SmartShop Cloud Deployment Guide

This guide details step-by-step how to deploy the **SmartShop Microservices Application** (React Frontend + Spring Boot Microservices + MySQL Database) to production cloud platforms.

---

## 🏗️ Cloud Architecture Overview

```
                 ┌────────────────────────────────┐
                 │       React Frontend (Vite)     │
                 │      Vercel / Netlify / Render │
                 └───────────────┬────────────────┘
                                 │
                                 ▼
                 ┌────────────────────────────────┐
                 │    Spring Boot API Gateway     │
                 │     Railway / Render / EC2     │
                 └───────────────┬────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│   User Service    │   │  Product Service  │   │   Order Service   │
│    (Port 8081)    │   │    (Port 8082)    │   │    (Port 8083)    │
└────────┬──────────┘   └────────┬──────────┘   └────────┬──────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                 ┌────────────────────────────────┐
                 │   Managed MySQL Database 8.0   │
                 │   Aiven / Railway / AWS RDS    │
                 └────────────────────────────────┘
```

---

## 🛠️ Required Platforms & Tools (Free Tier Friendly)

| Layer | Recommended Platform | Alternative | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) | Render / Netlify | **FREE** |
| **Backend Microservices** | [Railway](https://railway.app) | Render.com / AWS EC2 | **FREE ($5/mo credit)** |
| **Database (MySQL)** | [Aiven](https://aiven.io) / Railway | AWS RDS | **FREE** |
| **Containerization** | Docker & Docker Compose | - | **FREE** |

---

## 📋 Option 1: Managed Cloud Deployment (Recommended - Railway & Vercel)

### Step 1: Push Code to GitHub

1. Initialize git and commit your latest changes:
   ```bash
   git add .
   git commit -m "SmartShop Production Ready"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/SmartShopProject.git
   git push -u origin main
   ```

---

### Step 2: Deploy Managed MySQL Database (Aiven or Railway)

1. Log in to **[Railway.app](https://railway.app)** or **[Aiven.io](https://aiven.io)**.
2. Click **+ New Project** → Select **Provision MySQL**.
3. Copy your Database Connection Details:
   - `Host`: `your-mysql.railway.app`
   - `Port`: `3306`
   - `Database`: `smartshop`
   - `Username`: `root`
   - `Password`: `<generated-password>`

---

### Step 3: Deploy Backend Microservices (Railway or Render)

For each Spring Boot service (`user-service`, `product-service`, `order-service`, `api-gateway`):

1. On **Railway.app**, click **New Service** → **GitHub Repo**.
2. Select your repository and specify the subfolder (e.g., `/user-service`).
3. Add Environment Variables:
   ```env
   SPRING_DATASOURCE_URL=jdbc:mysql://HOST:PORT/smartshop?createDatabaseIfNotExist=true&useSSL=false
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=your_password
   PORT=8081
   ```
4. Click **Deploy**. Railway will build the JAR automatically using Maven and launch your service!

---

### Step 4: Deploy React Frontend (Vercel)

1. Log in to **[Vercel.com](https://vercel.com)**.
2. Click **Add New Project** → Import your `SmartShopProject` GitHub repo.
3. Set Root Directory: `React-Frontend`
4. Add Environment Variable:
   ```env
   VITE_API_BASE_URL=https://your-api-gateway.up.railway.app
   ```
5. Click **Deploy**! Vercel will build and generate your live domain (e.g., `https://smartshop.vercel.app`).

---

## 🐳 Option 2: All-in-One Cloud Server Deployment (AWS EC2 / DigitalOcean)

If you have a Single Linux VPS (AWS EC2 Ubuntu / DigitalOcean Droplet):

### 1. Connect to your VPS via SSH:
```bash
ssh -i your-key.pem ubuntu@YOUR_SERVER_PUBLIC_IP
```

### 2. Install Docker & Docker Compose:
```bash
sudo apt update && sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
```

### 3. Clone repository and run Docker Compose:
```bash
git clone https://github.com/YOUR_USERNAME/SmartShopProject.git
cd SmartShopProject
docker-compose up -d --build
```

### 4. Verify Containers:
```bash
docker ps
```
Your entire SmartShop stack (MySQL, User Service, Product Service, Gateway, React Frontend) will be live on `http://YOUR_SERVER_PUBLIC_IP`!

---

## ⚡ Pre-Deployment Checklist

- [x] CORS allowed for production domain in `SecurityConfig.java`.
- [x] Production database credentials configured via environment variables.
- [x] React API base URL pointing to production gateway endpoint.
- [x] Dockerfile & `docker-compose.yml` validated.
