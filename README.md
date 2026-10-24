# NexCommerce — Flagship E-Commerce Web Experience

> An ultra-modern, production-grade e-commerce web application built with vanilla HTML5, CSS3, and modern ES6+ JavaScript. Designed with state-of-the-art UI/UX, glassmorphism aesthetics, responsive micro-interactions, and zero build tool dependencies.

---

## 🌟 Key Features

### 🎨 Visual & Theme System
- **Dual Appearance Modes**: Seamless Dark & Light themes with persistent preference storage via `localStorage`.
- **Modern Typography**: Paired Google Fonts (`Outfit` for headings, `Plus Jakarta Sans` for body).
- **Glassmorphic Design**: Backdrop filters, luminous ambient mesh gradients, and smooth card hover elevations.
- **Micro-Interactions**: Badge pulse animations, cart bump effects, and responsive 3D card tilt.

### 🔍 Search & Filter Engine
- **Live Autocomplete Search**: Instant search dropdown with thumbnail previews, live pricing, and category highlights.
- **Keyboard Shortcut**: Press `Ctrl + K` or `/` anywhere to immediately focus the search bar.
- **Multi-Factor Catalog Filtering**:
  - Category filter pills with dynamic count badges (*Electronics, Fashion, Accessories*).
  - Real-time interactive max-price range slider ($20 – $400).
  - Multi-criteria sorting: *Featured, Price (Low to High), Price (High to Low), Customer Rating, and Top Discounts*.
  - *In-Stock Only* toggle filter.
  - Layout toggle between **Grid View** (4 columns) and **Compact List View**.

### 🛍️ Cart & Wishlist Drawers
- **Slide-Out Cart Drawer**:
  - Real-time **Free Shipping Progress Meter** ($50 threshold) with celebratory unlock animation.
  - Interactive quantity controls (`+` / `−`), item removals, and instant total calculations.
  - Item variant details and image thumbnails.
- **Promo Code Engine**:
  - `WELCOME20`: 20% discount on entire cart.
  - `SAVE10`: $10 instant discount.
  - `FREESHIP`: 100% free shipping discount.
- **Wishlist Drawer**: Save favorites with one click (heart button) and move them directly to the shopping cart.
- **Data Persistence**: Cart items, wishlist items, and theme preferences automatically persist in `localStorage`.

### 👁️ Quick View Product Modal
- High-definition gallery inspection.
- Color and size variant selection.
- Detailed bulleted specifications and verified rating counters.
- Direct **"Add to Bag"** and **"Buy Now"** actions.

### 💳 2-Step Interactive Checkout & Digital Receipt
- **Step 1: Shipping Details**: Client-validated customer destination fields.
- **Step 2: Interactive Payment**:
  - Live virtual credit card that updates cardholder name, card number formatting, and expiration date in real time.
  - Alternative payment tabs: Credit Card, PayPal, Apple Pay.
- **Celebratory Confirmation Receipt**:
  - Confetti burst animation upon order submission.
  - Unique generated Order ID (e.g. `#NEX-82410`).
  - Itemized receipt, shipping address confirmation, and one-click printable receipt.

---

## 🚀 Running Locally

No installation, build tools, or npm packages required!

### Option 1: Direct File Opening
Double click `index.html` in your file explorer to open it in Chrome, Edge, Safari, or Firefox.

### Option 2: Local HTTP Server (Python)
```bash
# Navigate to the project directory
cd "c:\Users\USER\1st web"

# Start lightweight Python web server
python -m http.server 8000
```
Then visit: `http://localhost:8000` in your web browser.

---

## 💻 Technical Architecture
- **HTML5**: Semantic markup, descriptive meta tags, accessibility (`aria-label`, accessible form controls).
- **CSS3**: Custom properties (tokens), Flexbox & CSS Grid, fluid layout, responsive media queries, CSS keyframe animations.
- **Vanilla JavaScript**: Modular architecture, event delegation, reactive state synchronization, and DOM manipulation.
