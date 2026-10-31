# NexCommerce — Production-Grade Full-Stack E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208.x-brightgreen.svg)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Status](https://img.shields.io/badge/Production-10%2F10%20Grade-indigo.svg)](#)

> **NexCommerce** is an enterprise-grade, high-performance e-commerce platform featuring a modern Node.js/Express REST API backend with dual-engine persistence (MongoDB + High-Availability in-memory fallback), paired with an ultra-responsive, glassmorphic frontend built in modern HTML5, CSS3, and ES6+ JavaScript.

---

## 🌟 Key Features

### 🛍️ Frontend Storefront & UX
- **Live Server Telemetry Pill**: Pulsing real-time badge in the header displaying backend status (`🟢 API Live (MongoDB)` or `🟢 API Live (Memory Engine)`), latency, and store metrics.
- **Dynamic 12-Product Catalog**: Rich products across Electronics, Fashion, and Accessories with high-res imagery, discounts, star ratings, stock counters, and specs.
- **Search & Autocomplete**: Instant search with thumbnail dropdown and keyboard shortcut (`Ctrl + K` or `/`).
- **Interactive Multi-Filter**: Category tabs, real-time price slider, rating/price sorting, and layout toggle (Grid & Compact List).
- **Reactive Slide-Out Cart**:
  - Free shipping progress meter ($50 threshold).
  - Quantity controls (`+` / `−`), item removal, and subtotal/tax/shipping breakdown.
  - Promo coupon engine (`WELCOME20`, `SAVE10`, `FREESHIP`, `VIP15`).
- **Wishlist Drawer**: One-click saving and batch "Move All to Cart".
- **Interactive 2-Step Checkout**: Form validation, live virtual credit card preview, alternative payment methods (Card, PayPal, Apple Pay).
- **Order Tracking & Lookup Engine**: Live search for orders by `#NEX-XXXXX` with interactive shipping progress timeline (`Placed → Packed → Shipped → Delivered`) and local history.
- **Verified Review Submission**: 5-star interactive rating picker, real-time client prepend, and backend persistence.
- **Dual Theme System**: Dark & Light modes with automatic `localStorage` persistence.

---

## 🏗️ Backend REST API Architecture

Powered by **Node.js**, **Express**, **Mongoose**, **Helmet**, **CORS**, **Rate-Limiting**, and **Compression**.

### Dual-Engine High-Availability Architecture
- **Primary Engine**: MongoDB / MongoDB Atlas via Mongoose.
- **Failover Engine**: Automated in-memory fallback with zero downtime—even if MongoDB is offline, the entire catalog, checkout, promo, and reviews work seamlessly!

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Comprehensive system telemetry, DB status, uptime, counts |
| `GET` | `/api/stats` | Live storefront metrics (revenue, orders count, total products) |
| `GET` | `/api/products` | Query products with category, search, price range, stock, sort, pagination |
| `GET` | `/api/products/:id` | Single product details by numeric ID |
| `POST` | `/api/products` | Create new catalog product (Admin) |
| `GET` | `/api/categories` | Active categories with product count aggregation |
| `POST` | `/api/orders` | Place order, deduct inventory stock, generate order receipt |
| `GET` | `/api/orders/:orderId` | Query order details & tracking status |
| `GET` | `/api/orders` | List recent orders |
| `GET` | `/api/promos` | List active promotional offers & coupon codes |
| `POST` | `/api/promos/validate` | Validate coupon code against subtotal, check minOrder & compute discount |
| `GET` | `/api/promo/:code` | Validate promo code, discount type, and minimum order rules |
| `POST` | `/api/promos` | Create new promotional discount code (Admin) |
| `GET` | `/api/reviews` | Retrieve verified customer testimonials |
| `POST` | `/api/reviews` | Submit new customer review |

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/skillzonementor-beep/e--commers.git
cd e--commers
npm install
```

### 2. Environment Configuration
Create a `.env` file (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nexcommerce
CLIENT_URL=http://localhost:5000
```
*(Note: If MongoDB is not running locally, the server will automatically operate in High-Availability Memory Mode without errors!)*

### 3. Run the Server
```bash
# Production Start
npm start

# Development with Auto-Restart
npm run dev
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### 4. Seed MongoDB (Optional)
```bash
npm run seed
```

---

## 🔒 Security & Best Practices
- **Helmet**: Secures HTTP headers and enforces Content Security Policy (CSP).
- **Rate-Limiting**: Protects against brute-force, DDoS, and checkout spam.
- **CORS & Compression**: Gzip/Brotli payload compression with origin whitelisting.
- **Fail-Safe Fallback**: Resilient offline-first design pattern.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
