/**
 * NexCommerce - Flagship E-Commerce Script
 * Modern Vanilla JavaScript with LocalStorage persistence,
 * live search, reactive cart/wishlist drawers, 2-step checkout,
 * theme management, and interactive modals.
 */

// ==========================================================================
// 1. PRODUCT CATALOG DATA
// ==========================================================================
const PRODUCTS = [
    {
        id: 1,
        name: "Sony WH-1000XM5 Spatial Edition",
        category: "electronics",
        price: 349.99,
        originalPrice: 399.99,
        rating: 4.9,
        reviewsCount: 428,
        stock: 8,
        badge: "sale",
        badgeText: "-25% OFF",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        description: "Industry-leading active noise canceling wireless headphones with dual processors, 8 microphones, and up to 30 hours of lossless battery life.",
        specs: ["Lossless LDAC Codec Support", "30-Hour Ultra Battery", "Multipoint Bluetooth 5.3", "Speak-to-Chat Ambient Sensor"],
        variants: ["Midnight Black", "Platinum Silver", "Midnight Blue"]
    },
    {
        id: 2,
        name: "Ultra Chrono Apex OLED Smartwatch",
        category: "electronics",
        price: 249.99,
        originalPrice: 299.99,
        rating: 4.8,
        reviewsCount: 310,
        stock: 14,
        badge: "bestseller",
        badgeText: "HOT",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        description: "Grade-5 titanium chassis with ultra-bright sapphire OLED display. Complete ECG, sleep tracking, and 100m water resistance.",
        specs: ["Titanium Aerospace Case", "Always-on 2000-nit OLED", "Multi-band GPS Navigation", "7-Day Active Battery"],
        variants: ["Titanium Gray", "Deep Space Black", "Alpine Orange"]
    },
    {
        id: 3,
        name: "AcousticPulse 360 Spatial Speaker",
        category: "electronics",
        price: 89.99,
        originalPrice: 119.99,
        rating: 4.7,
        reviewsCount: 195,
        stock: 22,
        badge: "sale",
        badgeText: "SAVE $30",
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
        description: "Omnidirectional room-filling audio engineered with dual passive radiators and IPX7 waterproof floating rating.",
        specs: ["360° Omnidirectional Bass", "IPX7 Full Waterproofing", "PartyCast Stereo Sync", "18-Hour Continuous Play"],
        variants: ["Matte Black", "Cobalt Blue", "Forest Green"]
    },
    {
        id: 4,
        name: "ProHub 9-in-1 Thunderbolt 4 Dock",
        category: "electronics",
        price: 59.99,
        originalPrice: 79.99,
        rating: 4.6,
        reviewsCount: 88,
        stock: 19,
        badge: "new",
        badgeText: "NEW",
        image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80",
        description: "Solid CNC milled aluminum multi-port docking hub supporting dual 4K@60Hz displays and 100W Power Delivery pass-through.",
        specs: ["100W PD Fast Charging", "Dual 4K HDMI 2.1 Out", "Gigabit Ethernet RJ45", "UHS-II SD/microSD Readers"],
        variants: ["Space Gray", "Silver"]
    },
    {
        id: 5,
        name: "Nordic Wool-Blend Tailored Overcoat",
        category: "fashion",
        price: 189.99,
        originalPrice: 229.99,
        rating: 4.9,
        reviewsCount: 156,
        stock: 6,
        badge: "bestseller",
        badgeText: "TRENDING",
        image: "https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800&auto=format&fit=crop&q=80",
        description: "Crafted with 75% recycled Scandinavian wool. Refined relaxed silhouette with thermal insulation and horn buttons.",
        specs: ["Heavyweight Wool Blend", "Windproof Interior Lining", "Double-Welt Pockets", "Sustainable Sourcing"],
        variants: ["Camel", "Charcoal Gray", "Deep Navy"]
    },
    {
        id: 6,
        name: "CloudWalk Aero Lightweight Runners",
        category: "fashion",
        price: 129.99,
        originalPrice: 159.99,
        rating: 4.8,
        reviewsCount: 512,
        stock: 15,
        badge: "sale",
        badgeText: "POPULAR",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        description: "Ultralight breathable mesh sneakers powered by nitrogen-infused foam soles for cloud-like energy return all day.",
        specs: ["Nitrogen Foam Midsole", "Seamless Breathable Knit", "Ortholite High-Arch Insole", "Weight: 220g"],
        variants: ["Crimson Red", "Triple White", "Phantom Black"]
    },
    {
        id: 7,
        name: "Urban Heritage Roll-Top Canvas Backpack",
        category: "fashion",
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.7,
        reviewsCount: 240,
        stock: 11,
        badge: "new",
        badgeText: "NEW",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
        description: "Weather-resistant 1000D waxed canvas with magnetic FIDLOCK buckles, padded 16\" laptop sleeve, and expandable 28L storage.",
        specs: ["1000D Waxed Heavy Canvas", "Fidlock Magnetic Fasteners", "Padded 16-inch Laptop Bay", "Water-Repellent YKK Zips"],
        variants: ["Olive Drab", "Charcoal", "Tobacco Brown"]
    },
    {
        id: 8,
        name: "Artisan Full-Grain Italian Leather Wallet",
        category: "fashion",
        price: 45.99,
        originalPrice: 59.99,
        rating: 4.9,
        reviewsCount: 340,
        stock: 25,
        badge: "bestseller",
        badgeText: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
        description: "Hand-stitched Tuscan vegetable-tanned leather wallet with built-in RFID frequency blocking and quick-access card slots.",
        specs: ["Vegetable-Tanned Tuscan Leather", "RFID Frequency Shield", "Holds 10 Cards + Cash", "Ages With Natural Patina"],
        variants: ["Cognac Brown", "Espresso", "Classic Black"]
    },
    {
        id: 9,
        name: "AeroShield Polarized Titanium Sunglasses",
        category: "accessories",
        price: 95.00,
        originalPrice: 125.00,
        rating: 4.8,
        reviewsCount: 180,
        stock: 9,
        badge: "sale",
        badgeText: "SAVE $30",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
        description: "Japanese aerospace titanium frames weighing just 14 grams. Category-3 polarized lenses with hydrophobic anti-glare coating.",
        specs: ["Beta-Titanium Ultralight Frame", "HD UV400 Polarized Lenses", "Anti-Reflective Hydrophobic Coat", "Weight: 14 Grams"],
        variants: ["Matte Gold / Green Lens", "Gunmetal / Smoke", "Silver / Blue Mirror"]
    },
    {
        id: 10,
        name: "Monolith Ceramic Modern Table Lamp",
        category: "accessories",
        price: 64.99,
        originalPrice: 79.99,
        rating: 4.9,
        reviewsCount: 95,
        stock: 18,
        badge: "new",
        badgeText: "NEW DROP",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
        description: "Sculptural textured stoneware base paired with a Belgian linen drum shade. Features smooth 3-stage touch step-dimming.",
        specs: ["Matte Textured Ceramic", "3-Stage Touch Capacitive Dimmer", "Belgian Linen Drum Shade", "Warm 2700K LED Included"],
        variants: ["Sand Beige", "Terracotta", "Chalk White"]
    },
    {
        id: 11,
        name: "Starlight 18K Gold Geometric Pendant",
        category: "accessories",
        price: 115.00,
        originalPrice: 145.00,
        rating: 4.9,
        reviewsCount: 142,
        stock: 7,
        badge: "sale",
        badgeText: "LIMITED",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
        description: "Ethically mined solid 925 sterling silver base heavily dipped in 2.5 microns of 18K gold vermeil with a brilliant bezel zircon.",
        specs: ["18K Gold Vermeil 2.5um", "Solid 925 Sterling Core", "Hypoallergenic Nickel-Free", "Adjustable 18-20\" Chain"],
        variants: ["18K Yellow Gold", "Rhodium Silver", "Rose Gold"]
    },
    {
        id: 12,
        name: "Ergonomic MagSafe 3-in-1 Charging Stand",
        category: "accessories",
        price: 49.99,
        originalPrice: 65.00,
        rating: 4.7,
        reviewsCount: 210,
        stock: 30,
        badge: "bestseller",
        badgeText: "HOT",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80",
        description: "Fast charges your phone, smartwatch, and wireless earbuds simultaneously on one weighted anodized aluminum pedestal.",
        specs: ["15W Qi2 Fast Wireless", "Strong Neodymium Alignment", "Anti-Slip Weighted Base", "LED Night Mode Indicator"],
        variants: ["Space Gray", "Frosted Silver"]
    }
];

// Valid Promo Codes
const PROMO_CODES = {
    "WELCOME20": { type: "percent", value: 0.20, label: "20% OFF" },
    "SAVE10": { type: "fixed", value: 10.00, label: "$10 OFF" },
    "FREESHIP": { type: "shipping", value: 0, label: "FREE SHIPPING" }
};

// ==========================================================================
// 2. STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================
let cart = JSON.parse(localStorage.getItem("nex_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("nex_wishlist")) || [];
let appliedPromo = JSON.parse(localStorage.getItem("nex_promo")) || null;
let currentTheme = localStorage.getItem("nex_theme") || "light";

let activeCategory = "all";
let activeMaxPrice = 400;
let activeSort = "featured";
let activeInStockOnly = false;
let activeSearchQuery = "";
let currentViewMode = "grid";

// ==========================================================================
// 3. DOM ELEMENT REFERENCES
// ==========================================================================
const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");
const catalogCount = document.getElementById("catalogCount");

// Search elements
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const searchAutocomplete = document.getElementById("searchAutocomplete");

// Filter controls
const categoryFilters = document.getElementById("categoryFilters");
const priceRange = document.getElementById("priceRange");
const priceRangeValue = document.getElementById("priceRangeValue");
const sortSelect = document.getElementById("sortSelect");
const inStockCheckbox = document.getElementById("inStockCheckbox");
const layoutGridBtn = document.getElementById("layoutGridBtn");
const layoutListBtn = document.getElementById("layoutListBtn");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

// Header actions & badges
const themeToggleBtn = document.getElementById("themeToggleBtn");
const mobileThemeBtn = document.getElementById("mobileThemeBtn");
const wishlistBtn = document.getElementById("wishlistBtn");
const wishlistCount = document.getElementById("wishlistCount");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const headerCartTotal = document.getElementById("headerCartTotal");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

// Cart Drawer elements
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const cartItems = document.getElementById("cartItems");
const cartDrawerCount = document.getElementById("cartDrawerCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTax = document.getElementById("cartTax");
const cartDiscount = document.getElementById("cartDiscount");
const discountRow = document.getElementById("discountRow");
const discountCodeName = document.getElementById("discountCodeName");
const shippingText = document.getElementById("shippingText");
const cartTotal = document.getElementById("cartTotal");
const shippingProgressText = document.getElementById("shippingProgressText");
const shippingProgressFill = document.getElementById("shippingProgressFill");
const promoInput = document.getElementById("promoInput");
const applyPromoBtn = document.getElementById("applyPromoBtn");
const promoFeedback = document.getElementById("promoFeedback");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

// Wishlist Drawer elements
const wishlistSidebar = document.getElementById("wishlistSidebar");
const wishlistOverlay = document.getElementById("wishlistOverlay");
const wishlistCloseBtn = document.getElementById("wishlistCloseBtn");
const wishlistItems = document.getElementById("wishlistItems");
const wishlistDrawerCount = document.getElementById("wishlistDrawerCount");
const moveAllToCartBtn = document.getElementById("moveAllToCartBtn");

// Quick View Modal
const quickViewModal = document.getElementById("quickViewModal");
const quickViewCloseBtn = document.getElementById("quickViewCloseBtn");
const quickViewBody = document.getElementById("quickViewBody");

// 2-Step Checkout Modal
const checkoutModal = document.getElementById("checkoutModal");
const checkoutCloseBtn = document.getElementById("checkoutCloseBtn");
const cancelCheckoutBtn = document.getElementById("cancelCheckoutBtn");
const checkoutStep1 = document.getElementById("checkoutStep1");
const checkoutStep2 = document.getElementById("checkoutStep2");
const stepIndicator1 = document.getElementById("stepIndicator1");
const stepIndicator2 = document.getElementById("stepIndicator2");
const shippingForm = document.getElementById("shippingForm");
const paymentForm = document.getElementById("paymentForm");
const backToShippingBtn = document.getElementById("backToShippingBtn");
const checkoutFinalTotal = document.getElementById("checkoutFinalTotal");

// Card Visual Preview
const cardNumberInput = document.getElementById("cardNumber");
const cardExpInput = document.getElementById("cardExp");
const shipNameInput = document.getElementById("shipName");
const cardNumPreview = document.getElementById("cardNumPreview");
const cardHolderPreview = document.getElementById("cardHolderPreview");
const cardExpPreview = document.getElementById("cardExpPreview");

// Order Success Receipt Modal
const orderSuccessModal = document.getElementById("orderSuccessModal");
const receiptOrderId = document.getElementById("receiptOrderId");
const receiptDate = document.getElementById("receiptDate");
const receiptItemsList = document.getElementById("receiptItemsList");
const receiptSubtotal = document.getElementById("receiptSubtotal");
const receiptDiscount = document.getElementById("receiptDiscount");
const receiptDiscountRow = document.getElementById("receiptDiscountRow");
const receiptTax = document.getElementById("receiptTax");
const receiptShipping = document.getElementById("receiptShipping");
const receiptTotal = document.getElementById("receiptTotal");
const receiptCustomerAddress = document.getElementById("receiptCustomerAddress");
const printReceiptBtn = document.getElementById("printReceiptBtn");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");

// Toast container
const toastContainer = document.getElementById("toastContainer");

// Promo banner clipboard copy
const promoClipboard = document.getElementById("promoClipboard");
const promoCopyBtn = document.getElementById("promoCopyBtn");

// Customer shipping storage
let customerShippingInfo = {
    name: "Alex Morgan",
    email: "alex@example.com",
    address: "742 Evergreen Terrace",
    city: "San Francisco",
    zip: "94107",
    country: "United States"
};

// ==========================================================================
// 4. INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    applyTheme(currentTheme);
    renderProducts();
    updateCartUI();
    updateWishlistUI();
    initCountdownTimer();
    initAnnouncementTicker();
    initPromoClickToCopy();
    initHeroQuickAdd();
    initNewsletter();
});

// ==========================================================================
// 5. THEME SWITCHER
// ==========================================================================
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nex_theme", theme);
    currentTheme = theme;
    if (mobileThemeBtn) {
        mobileThemeBtn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
}

function toggleTheme() {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme} mode`, "🌓");
}

themeToggleBtn?.addEventListener("click", toggleTheme);
mobileThemeBtn?.addEventListener("click", toggleTheme);

// ==========================================================================
// 6. PRODUCT RENDERING & FILTERING
// ==========================================================================
function getFilteredAndSortedProducts() {
    return PRODUCTS.filter(product => {
        // Category filter
        if (activeCategory !== "all" && product.category !== activeCategory) {
            return false;
        }
        // Max Price filter
        if (product.price > activeMaxPrice) {
            return false;
        }
        // In-stock only
        if (activeInStockOnly && product.stock <= 0) {
            return false;
        }
        // Search query
        if (activeSearchQuery.trim() !== "") {
            const query = activeSearchQuery.toLowerCase();
            const matchName = product.name.toLowerCase().includes(query);
            const matchDesc = product.description.toLowerCase().includes(query);
            const matchCategory = product.category.toLowerCase().includes(query);
            if (!matchName && !matchDesc && !matchCategory) return false;
        }
        return true;
    }).sort((a, b) => {
        if (activeSort === "price-low") return a.price - b.price;
        if (activeSort === "price-high") return b.price - a.price;
        if (activeSort === "rating") return b.rating - a.rating;
        if (activeSort === "discount") {
            const discA = a.originalPrice ? (a.originalPrice - a.price) : 0;
            const discB = b.originalPrice ? (b.originalPrice - b.price) : 0;
            return discB - discA;
        }
        return a.id - b.id; // "featured"
    });
}

function renderProducts() {
    const filtered = getFilteredAndSortedProducts();

    if (filtered.length === 0) {
        productGrid.style.display = "none";
        noResults.style.display = "block";
        catalogCount.textContent = "0 items found";
        return;
    }

    productGrid.style.display = "grid";
    noResults.style.display = "none";
    catalogCount.textContent = `Showing ${filtered.length} of ${PRODUCTS.length} items`;

    productGrid.innerHTML = filtered.map(product => {
        const isWishlisted = wishlist.some(item => item.id === product.id);
        const lowStock = product.stock <= 8;
        const stockPercent = Math.min(100, Math.round((product.stock / 30) * 100));

        return `
            <div class="product-card" data-product-id="${product.id}">
                <!-- Image Box -->
                <div class="product-image-container">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="product-card-img"
                        loading="lazy"
                        onerror="this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'"
                    >
                    <!-- Badges -->
                    <div class="card-badges">
                        <span class="badge-tag ${product.badge}">${product.badgeText}</span>
                    </div>

                    <!-- Quick Action Buttons -->
                    <div class="card-quick-actions">
                        <button
                            class="card-action-btn wishlist-toggle-btn ${isWishlisted ? 'wishlist-active' : ''}"
                            data-product-id="${product.id}"
                            title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
                            aria-label="Wishlist"
                        >
                            ${isWishlisted ? '❤️' : '🤍'}
                        </button>
                        <button
                            class="card-action-btn quickview-trigger-btn"
                            data-product-id="${product.id}"
                            title="Quick view"
                            aria-label="Quick View"
                        >
                            👁️
                        </button>
                    </div>
                </div>

                <!-- Product Content -->
                <div class="product-card-info">
                    <div class="product-meta-row">
                        <span class="product-category-name">${product.category}</span>
                        <div class="product-rating">★ ${product.rating.toFixed(1)} <span>(${product.reviewsCount})</span></div>
                    </div>

                    <h3 class="product-title" title="${product.name}">${product.name}</h3>
                    <p class="product-desc-snippet">${product.description}</p>

                    <!-- Stock bar -->
                    <div class="stock-meter-box">
                        <div class="stock-meter-label ${lowStock ? 'low-stock' : ''}">
                            <span>${lowStock ? `⚠️ Only ${product.stock} left in stock!` : `In Stock (${product.stock})`}</span>
                        </div>
                        <div class="stock-bar-track">
                            <div class="stock-bar-fill ${lowStock ? 'low-stock' : ''}" style="width: ${stockPercent}%;"></div>
                        </div>
                    </div>

                    <!-- Price & Add Button -->
                    <div class="product-card-bottom">
                        <div class="product-price-box">
                            <span class="product-current-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="product-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="add-cart-btn" data-product-id="${product.id}">
                            <span>Add</span> <span>+</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// ==========================================================================
// 7. FILTER & CONTROLS EVENT HANDLERS
// ==========================================================================
categoryFilters?.addEventListener("click", e => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.getAttribute("data-category");
    renderProducts();
});

priceRange?.addEventListener("input", e => {
    activeMaxPrice = parseFloat(e.target.value);
    priceRangeValue.textContent = `$${activeMaxPrice}`;
    renderProducts();
});

sortSelect?.addEventListener("change", e => {
    activeSort = e.target.value;
    renderProducts();
});

inStockCheckbox?.addEventListener("change", e => {
    activeInStockOnly = e.target.checked;
    renderProducts();
});

layoutGridBtn?.addEventListener("click", () => {
    layoutGridBtn.classList.add("active");
    layoutListBtn.classList.remove("active");
    productGrid.classList.remove("list-view");
    currentViewMode = "grid";
});

layoutListBtn?.addEventListener("click", () => {
    layoutListBtn.classList.add("active");
    layoutGridBtn.classList.remove("active");
    productGrid.classList.add("list-view");
    currentViewMode = "list";
});

function resetFilters() {
    activeCategory = "all";
    activeMaxPrice = 400;
    activeSort = "featured";
    activeInStockOnly = false;
    activeSearchQuery = "";

    document.querySelectorAll(".filter-pill").forEach(p => {
        p.classList.toggle("active", p.getAttribute("data-category") === "all");
    });
    if (priceRange) priceRange.value = 400;
    if (priceRangeValue) priceRangeValue.textContent = "$400";
    if (sortSelect) sortSelect.value = "featured";
    if (inStockCheckbox) inStockCheckbox.checked = false;
    if (searchInput) searchInput.value = "";
    if (searchClearBtn) searchClearBtn.style.display = "none";
    if (searchAutocomplete) searchAutocomplete.classList.remove("show");

    renderProducts();
    showToast("Filters reset to default", "🔄");
}

resetFiltersBtn?.addEventListener("click", resetFilters);
clearFiltersBtn?.addEventListener("click", resetFilters);

// Footer category link navigation
document.querySelectorAll("[data-filter-category]").forEach(link => {
    link.addEventListener("click", e => {
        const cat = link.getAttribute("data-filter-category");
        const targetPill = document.querySelector(`.filter-pill[data-category="${cat}"]`);
        if (targetPill) {
            targetPill.click();
        }
    });
});

// ==========================================================================
// 8. LIVE SEARCH & AUTOCOMPLETE
// ==========================================================================
searchInput?.addEventListener("input", e => {
    activeSearchQuery = e.target.value;
    searchClearBtn.style.display = activeSearchQuery.length > 0 ? "block" : "none";
    renderProducts();
    updateSearchAutocomplete(activeSearchQuery);
});

searchClearBtn?.addEventListener("click", () => {
    searchInput.value = "";
    activeSearchQuery = "";
    searchClearBtn.style.display = "none";
    searchAutocomplete.classList.remove("show");
    renderProducts();
    searchInput.focus();
});

// Keyboard shortcut: Ctrl+K or / to search
document.addEventListener("keydown", e => {
    if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.key === "/" && document.activeElement !== searchInput)) {
        e.preventDefault();
        searchInput?.focus();
        searchInput?.select();
    }
    if (e.key === "Escape") {
        closeAllDrawersAndModals();
    }
});

function updateSearchAutocomplete(query) {
    if (!query || query.trim().length < 2) {
        searchAutocomplete.classList.remove("show");
        searchAutocomplete.innerHTML = "";
        return;
    }

    const matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (matches.length === 0) {
        searchAutocomplete.innerHTML = `<div style="padding: 12px; font-size: 13px; color: var(--text-muted); text-align: center;">No quick matches found</div>`;
        searchAutocomplete.classList.add("show");
        return;
    }

    searchAutocomplete.innerHTML = matches.map(p => `
        <div class="autocomplete-item" data-autocomplete-id="${p.id}">
            <img src="${p.image}" alt="${p.name}" class="autocomplete-thumb">
            <div class="autocomplete-info">
                <div class="autocomplete-name">${p.name}</div>
                <div class="autocomplete-meta">${p.category.toUpperCase()} • ★ ${p.rating}</div>
            </div>
            <div class="autocomplete-price">$${p.price.toFixed(2)}</div>
        </div>
    `).join("");

    searchAutocomplete.classList.add("show");
}

searchAutocomplete?.addEventListener("click", e => {
    const item = e.target.closest(".autocomplete-item");
    if (!item) return;
    const productId = parseInt(item.getAttribute("data-autocomplete-id"));
    searchAutocomplete.classList.remove("show");
    openQuickView(productId);
});

// Close autocomplete on click outside
document.addEventListener("click", e => {
    if (!e.target.closest("#searchWrapper")) {
        searchAutocomplete?.classList.remove("show");
    }
});

// ==========================================================================
// 9. PRODUCT GRID DELEGATION (ADD TO CART, WISHLIST, QUICK VIEW)
// ==========================================================================
productGrid?.addEventListener("click", e => {
    // Add to cart button
    const addBtn = e.target.closest(".add-cart-btn");
    if (addBtn) {
        const id = parseInt(addBtn.getAttribute("data-product-id"));
        addToCart(id);
        animateButtonSuccess(addBtn);
        return;
    }

    // Wishlist button
    const wishBtn = e.target.closest(".wishlist-toggle-btn");
    if (wishBtn) {
        const id = parseInt(wishBtn.getAttribute("data-product-id"));
        toggleWishlist(id);
        return;
    }

    // Quick view button
    const qvBtn = e.target.closest(".quickview-trigger-btn");
    if (qvBtn) {
        const id = parseInt(qvBtn.getAttribute("data-product-id"));
        openQuickView(id);
        return;
    }
});

function animateButtonSuccess(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = "<span>✓ Added</span>";
    btn.style.background = "var(--success)";
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = "";
    }, 1200);
}

// ==========================================================================
// 10. SHOPPING CART ENGINE
// ==========================================================================
function addToCart(productId, quantity = 1, selectedVariant = null) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const variant = selectedVariant || (product.variants ? product.variants[0] : null);
    const existingIndex = cart.findIndex(item => item.id === productId && item.variant === variant);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            variant: variant,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
    showToast(`Added ${product.name} to bag!`, "🛍️");
    bumpBadge(cartCount);
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const removed = cart.splice(index, 1)[0];
        saveCart();
        updateCartUI();
        showToast(`Removed ${removed.name} from bag`, "🗑️");
    }
}

function updateCartQuantity(index, delta) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    appliedPromo = null;
    localStorage.removeItem("nex_promo");
    saveCart();
    updateCartUI();
    showToast("Your cart has been cleared", "🧹");
}

function saveCart() {
    localStorage.setItem("nex_cart", JSON.stringify(cart));
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Promo calculation
    let discount = 0;
    let freeShippingFromPromo = false;

    if (appliedPromo && PROMO_CODES[appliedPromo]) {
        const promo = PROMO_CODES[appliedPromo];
        if (promo.type === "percent") {
            discount = subtotal * promo.value;
        } else if (promo.type === "fixed") {
            discount = Math.min(subtotal, promo.value);
        } else if (promo.type === "shipping") {
            freeShippingFromPromo = true;
        }
    }

    const freeShippingThreshold = 50.00;
    const isFreeShipping = subtotal >= freeShippingThreshold || freeShippingFromPromo || subtotal === 0;
    const shipping = isFreeShipping ? 0.00 : 9.99;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08; // 8% estimated tax
    const total = taxableAmount + tax + shipping;

    return {
        subtotal,
        discount,
        tax,
        shipping,
        total,
        isFreeShipping,
        thresholdLeft: Math.max(0, freeShippingThreshold - subtotal)
    };
}

function updateCartUI() {
    const totals = calculateTotals();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update Header Badges
    cartCount.textContent = totalItems;
    headerCartTotal.textContent = `$${totals.total.toFixed(2)}`;
    cartDrawerCount.textContent = totalItems;

    // Free Shipping Progress Bar
    if (totals.subtotal >= 50 || cart.length === 0) {
        shippingProgressFill.style.width = cart.length === 0 ? "0%" : "100%";
        shippingProgressText.innerHTML = cart.length === 0
            ? "Add <strong>$50.00</strong> more to unlock <strong>FREE Shipping</strong>!"
            : "🎉 You have unlocked <strong>FREE Express Shipping</strong>!";
    } else {
        const progressPercent = Math.min(100, (totals.subtotal / 50) * 100);
        shippingProgressFill.style.width = `${progressPercent}%`;
        shippingProgressText.innerHTML = `Add <strong>$${totals.thresholdLeft.toFixed(2)}</strong> more to unlock <strong>FREE Shipping</strong>!`;
    }

    // Render Drawer Items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="drawer-empty">
                <div class="drawer-empty-icon">🛍️</div>
                <h4>Your Bag is Empty</h4>
                <p>Explore our flagship collection to add items.</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, idx) => `
            <div class="drawer-item" data-cart-index="${idx}">
                <img src="${item.image}" alt="${item.name}" class="drawer-item-img">
                <div class="drawer-item-details">
                    <div>
                        <div class="drawer-item-name">${item.name}</div>
                        ${item.variant ? `<div style="font-size: 11px; color: var(--text-muted);">${item.variant}</div>` : ''}
                    </div>
                    <div class="drawer-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="drawer-item-controls">
                        <div class="qty-pill">
                            <button class="cart-qty-decrease" data-index="${idx}">−</button>
                            <span>${item.quantity}</span>
                            <button class="cart-qty-increase" data-index="${idx}">+</button>
                        </div>
                        <button class="item-delete-btn" data-index="${idx}" title="Remove item">🗑️</button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    // Update Totals Breakdown
    cartSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
    cartTax.textContent = `$${totals.tax.toFixed(2)}`;
    shippingText.textContent = totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`;
    cartTotal.textContent = `$${totals.total.toFixed(2)}`;

    // Promo code breakdown row
    if (totals.discount > 0) {
        discountRow.style.display = "flex";
        discountCodeName.textContent = appliedPromo;
        cartDiscount.textContent = `-$${totals.discount.toFixed(2)}`;
    } else {
        discountRow.style.display = "none";
    }
}

// Cart Drawer delegation
cartItems?.addEventListener("click", e => {
    const decBtn = e.target.closest(".cart-qty-decrease");
    if (decBtn) {
        updateCartQuantity(parseInt(decBtn.getAttribute("data-index")), -1);
        return;
    }
    const incBtn = e.target.closest(".cart-qty-increase");
    if (incBtn) {
        updateCartQuantity(parseInt(incBtn.getAttribute("data-index")), 1);
        return;
    }
    const delBtn = e.target.closest(".item-delete-btn");
    if (delBtn) {
        removeFromCart(parseInt(delBtn.getAttribute("data-index")));
        return;
    }
});

clearCartBtn?.addEventListener("click", clearCart);

// ==========================================================================
// 11. PROMO CODE ENGINE
// ==========================================================================
applyPromoBtn?.addEventListener("click", handleApplyPromo);
promoInput?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleApplyPromo();
    }
});

function handleApplyPromo() {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
        appliedPromo = code;
        localStorage.setItem("nex_promo", JSON.stringify(code));
        updateCartUI();
        promoFeedback.style.color = "var(--success)";
        promoFeedback.textContent = `✓ Code ${code} applied successfully! (${PROMO_CODES[code].label})`;
        showToast(`Promo ${code} applied!`, "🎉");
    } else {
        promoFeedback.style.color = "var(--danger)";
        promoFeedback.textContent = "✕ Invalid promo code. Try WELCOME20 or SAVE10.";
    }
}

// ==========================================================================
// 12. WISHLIST MANAGEMENT
// ==========================================================================
function toggleWishlist(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast(`Removed from wishlist`, "🤍");
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category
        });
        showToast(`Saved to wishlist!`, "❤️");
        bumpBadge(wishlistCount);
    }

    localStorage.setItem("nex_wishlist", JSON.stringify(wishlist));
    updateWishlistUI();
    renderProducts(); // Refresh heart states on cards
}

function updateWishlistUI() {
    wishlistCount.textContent = wishlist.length;
    wishlistDrawerCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="drawer-empty">
                <div class="drawer-empty-icon">🤍</div>
                <h4>Your Wishlist is Empty</h4>
                <p>Save items you love by clicking the heart icon on any card.</p>
            </div>
        `;
        if (moveAllToCartBtn) moveAllToCartBtn.disabled = true;
    } else {
        if (moveAllToCartBtn) moveAllToCartBtn.disabled = false;
        wishlistItems.innerHTML = wishlist.map((item, idx) => `
            <div class="drawer-item" data-wishlist-index="${idx}">
                <img src="${item.image}" alt="${item.name}" class="drawer-item-img">
                <div class="drawer-item-details">
                    <div class="drawer-item-name">${item.name}</div>
                    <div class="drawer-item-price">$${item.price.toFixed(2)}</div>
                    <div class="drawer-item-controls">
                        <button class="btn btn-primary btn-sm wish-to-cart-btn" data-product-id="${item.id}">
                            + Add to Bag
                        </button>
                        <button class="item-delete-btn wish-remove-btn" data-product-id="${item.id}" title="Remove">🗑️</button>
                    </div>
                </div>
            </div>
        `).join("");
    }
}

wishlistItems?.addEventListener("click", e => {
    const toCartBtn = e.target.closest(".wish-to-cart-btn");
    if (toCartBtn) {
        const id = parseInt(toCartBtn.getAttribute("data-product-id"));
        addToCart(id);
        toggleWishlist(id);
        return;
    }
    const remBtn = e.target.closest(".wish-remove-btn");
    if (remBtn) {
        const id = parseInt(remBtn.getAttribute("data-product-id"));
        toggleWishlist(id);
        return;
    }
});

moveAllToCartBtn?.addEventListener("click", () => {
    if (wishlist.length === 0) return;
    wishlist.forEach(item => addToCart(item.id));
    wishlist = [];
    localStorage.setItem("nex_wishlist", JSON.stringify(wishlist));
    updateWishlistUI();
    renderProducts();
    closeAllDrawersAndModals();
    openDrawer(cartSidebar, cartOverlay);
    showToast("Moved all wishlist items to your bag!", "🛍️");
});

// ==========================================================================
// 13. QUICK VIEW MODAL
// ==========================================================================
function openQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    let selectedVariant = product.variants ? product.variants[0] : "";
    let quantity = 1;

    quickViewBody.innerHTML = `
        <div class="quickview-layout">
            <div class="quickview-gallery">
                <div class="quickview-main-img-box">
                    <img src="${product.image}" alt="${product.name}" class="quickview-main-img">
                </div>
            </div>
            <div class="quickview-details">
                <span class="quickview-category">${product.category}</span>
                <h2 class="quickview-title">${product.name}</h2>
                <div class="quickview-rating-row">
                    <span>★★★★★</span>
                    <strong>${product.rating.toFixed(1)}</strong>
                    <span>(${product.reviewsCount} customer ratings)</span>
                </div>
                <div class="quickview-pricing">
                    <span class="quickview-current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="quickview-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <p class="quickview-desc">${product.description}</p>

                ${product.variants ? `
                    <div class="quickview-variants">
                        <span class="variant-label">Select Option:</span>
                        <div class="variant-options">
                            ${product.variants.map((v, i) => `
                                <button class="variant-btn ${i === 0 ? 'active' : ''}" data-variant="${v}">${v}</button>
                            `).join("")}
                        </div>
                    </div>
                ` : ''}

                <div style="margin-bottom: 20px;">
                    <span class="variant-label">Key Specifications:</span>
                    <ul style="font-size: 13px; color: var(--text-secondary); list-style: disc; padding-left: 20px; line-height: 1.6;">
                        ${product.specs.map(spec => `<li>${spec}</li>`).join("")}
                    </ul>
                </div>

                <div class="quickview-actions-row">
                    <div class="qty-pill">
                        <button id="qvQtyMinus">−</button>
                        <span id="qvQtyVal">1</span>
                        <button id="qvQtyPlus">+</button>
                    </div>
                    <button class="btn btn-primary glow-effect" id="qvAddToCartBtn">Add to Bag</button>
                    <button class="btn btn-glass" id="qvBuyNowBtn">Buy Now</button>
                </div>
            </div>
        </div>
    `;

    // Handle variant button selection
    const variantBtns = quickViewBody.querySelectorAll(".variant-btn");
    variantBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            variantBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedVariant = btn.getAttribute("data-variant");
        });
    });

    // Handle quantity
    const qtyVal = quickViewBody.querySelector("#qvQtyVal");
    quickViewBody.querySelector("#qvQtyMinus").addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            qtyVal.textContent = quantity;
        }
    });
    quickViewBody.querySelector("#qvQtyPlus").addEventListener("click", () => {
        quantity++;
        qtyVal.textContent = quantity;
    });

    // Add to cart from Quick View
    quickViewBody.querySelector("#qvAddToCartBtn").addEventListener("click", () => {
        addToCart(product.id, quantity, selectedVariant);
        closeModal(quickViewModal);
    });

    // Buy now direct to checkout
    quickViewBody.querySelector("#qvBuyNowBtn").addEventListener("click", () => {
        addToCart(product.id, quantity, selectedVariant);
        closeModal(quickViewModal);
        openCheckout();
    });

    openModal(quickViewModal);
}

// ==========================================================================
// 14. 2-STEP INTERACTIVE CHECKOUT MODAL
// ==========================================================================
function openCheckout() {
    if (cart.length === 0) {
        showToast("Your bag is empty! Add items to checkout.", "⚠️");
        return;
    }
    closeAllDrawersAndModals();
    goToCheckoutStep(1);
    const totals = calculateTotals();
    checkoutFinalTotal.textContent = `$${totals.total.toFixed(2)}`;
    openModal(checkoutModal);
}

function goToCheckoutStep(stepNumber) {
    if (stepNumber === 1) {
        checkoutStep1.classList.add("active");
        checkoutStep2.classList.remove("active");
        stepIndicator1.classList.add("active");
        stepIndicator2.classList.remove("active");
    } else {
        checkoutStep1.classList.remove("active");
        checkoutStep2.classList.add("active");
        stepIndicator1.classList.add("active");
        stepIndicator2.classList.add("active");
    }
}

checkoutBtn?.addEventListener("click", openCheckout);

shippingForm?.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("shipName").value.trim();
    const email = document.getElementById("shipEmail").value.trim();
    const address = document.getElementById("shipAddress").value.trim();
    const city = document.getElementById("shipCity").value.trim();
    const zip = document.getElementById("shipZip").value.trim();
    const country = document.getElementById("shipCountry").value;

    if (!name || !email || !address || !city || !zip) {
        showToast("Please fill in all required shipping fields", "⚠️");
        return;
    }

    customerShippingInfo = { name, email, address, city, zip, country };
    cardHolderPreview.textContent = name.toUpperCase();
    goToCheckoutStep(2);
});

backToShippingBtn?.addEventListener("click", () => goToCheckoutStep(1));
cancelCheckoutBtn?.addEventListener("click", () => closeModal(checkoutModal));

// Interactive Credit Card formatting
cardNumberInput?.addEventListener("input", e => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    e.target.value = formatted;
    cardNumPreview.textContent = formatted.padEnd(19, "•").replace(/•/g, (m, offset) => {
        if (offset === 4 || offset === 9 || offset === 14) return " ";
        return "•";
    }) || "•••• •••• •••• ••••";
});

cardExpInput?.addEventListener("input", e => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + "/" + val.substring(2);
    } else {
        e.target.value = val;
    }
    cardExpPreview.textContent = e.target.value || "MM/YY";
});

// Payment method tab switching
document.querySelectorAll(".payment-tab").forEach(tab => {
    tab.addEventListener("click", e => {
        e.preventDefault();
        document.querySelectorAll(".payment-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        showToast(`Selected payment method: ${tab.textContent.trim()}`, "💳");
    });
});

// Final Order Submission
paymentForm?.addEventListener("submit", e => {
    e.preventDefault();
    const totals = calculateTotals();
    const orderId = `#NEX-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // Populate Receipt
    receiptOrderId.textContent = orderId;
    receiptDate.textContent = today;
    receiptSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
    receiptTax.textContent = `$${totals.tax.toFixed(2)}`;
    receiptShipping.textContent = totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`;
    receiptTotal.textContent = `$${totals.total.toFixed(2)}`;

    if (totals.discount > 0) {
        receiptDiscountRow.style.display = "flex";
        receiptDiscount.textContent = `-$${totals.discount.toFixed(2)} (${appliedPromo})`;
    } else {
        receiptDiscountRow.style.display = "none";
    }

    receiptCustomerAddress.textContent = `${customerShippingInfo.name} • ${customerShippingInfo.address}, ${customerShippingInfo.city} ${customerShippingInfo.zip}`;

    receiptItemsList.innerHTML = cart.map(item => `
        <div class="receipt-item-row">
            <span>${item.quantity}x ${item.name}</span>
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
    `).join("");

    // Clear cart and state
    cart = [];
    appliedPromo = null;
    localStorage.removeItem("nex_cart");
    localStorage.removeItem("nex_promo");
    updateCartUI();

    closeModal(checkoutModal);
    openModal(orderSuccessModal);
    triggerConfetti();
});

printReceiptBtn?.addEventListener("click", () => window.print());
continueShoppingBtn?.addEventListener("click", () => closeModal(orderSuccessModal));

// ==========================================================================
// 15. DRAWERS & MODALS CONTROLLER
// ==========================================================================
function openDrawer(drawer, overlay) {
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeDrawer(drawer, overlay) {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
}

function openModal(modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
}

function closeAllDrawersAndModals() {
    closeDrawer(cartSidebar, cartOverlay);
    closeDrawer(wishlistSidebar, wishlistOverlay);
    closeModal(quickViewModal);
    closeModal(checkoutModal);
    closeModal(orderSuccessModal);
    mobileNav?.classList.remove("open");
    mobileMenuBtn?.classList.remove("active");
}

cartButton?.addEventListener("click", () => openDrawer(cartSidebar, cartOverlay));
cartCloseBtn?.addEventListener("click", () => closeDrawer(cartSidebar, cartOverlay));
cartOverlay?.addEventListener("click", () => closeDrawer(cartSidebar, cartOverlay));

wishlistBtn?.addEventListener("click", () => openDrawer(wishlistSidebar, wishlistOverlay));
wishlistCloseBtn?.addEventListener("click", () => closeDrawer(wishlistSidebar, wishlistOverlay));
wishlistOverlay?.addEventListener("click", () => closeDrawer(wishlistSidebar, wishlistOverlay));

quickViewCloseBtn?.addEventListener("click", () => closeModal(quickViewModal));
quickViewModal?.addEventListener("click", e => {
    if (e.target === quickViewModal) closeModal(quickViewModal);
});

checkoutCloseBtn?.addEventListener("click", () => closeModal(checkoutModal));
checkoutModal?.addEventListener("click", e => {
    if (e.target === checkoutModal) closeModal(checkoutModal);
});

orderSuccessModal?.addEventListener("click", e => {
    if (e.target === orderSuccessModal) closeModal(orderSuccessModal);
});

// Mobile menu toggle
mobileMenuBtn?.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("active");
    mobileNav.classList.toggle("open");
});

document.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenuBtn.classList.remove("active");
        mobileNav.classList.remove("open");
    });
});

// ==========================================================================
// 16. TOAST NOTIFICATION SYSTEM
// ==========================================================================
function showToast(message, icon = "✅", title = "NexCommerce") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-text">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${message}</div>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("removing");
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}

function bumpBadge(badgeElement) {
    if (!badgeElement) return;
    badgeElement.classList.remove("bump");
    void badgeElement.offsetWidth;
    badgeElement.classList.add("bump");
}

// ==========================================================================
// 17. ANNOUNCEMENT TICKER & TIMERS
// ==========================================================================
function initAnnouncementTicker() {
    const items = document.querySelectorAll(".ticker-item");
    if (items.length <= 1) return;
    let currentIndex = 0;

    setInterval(() => {
        items[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add("active");
    }, 4500);

    document.getElementById("closeAnnouncement")?.addEventListener("click", () => {
        const bar = document.getElementById("announcementBar");
        if (bar) bar.style.display = "none";
    });
}

function initPromoClickToCopy() {
    const copyPromo = (code) => {
        navigator.clipboard?.writeText(code).then(() => {
            showToast(`Coupon ${code} copied to clipboard!`, "📋");
            if (promoInput) promoInput.value = code;
        }).catch(() => {
            if (promoInput) promoInput.value = code;
            showToast(`Coupon ${code} ready to apply`, "📋");
        });
    };

    document.querySelectorAll(".promo-code-badge").forEach(badge => {
        badge.addEventListener("click", () => {
            const code = badge.getAttribute("data-code");
            copyPromo(code);
        });
    });

    promoClipboard?.addEventListener("click", () => copyPromo("WELCOME20"));
}

function initCountdownTimer() {
    const hoursEl = document.getElementById("timerHours");
    const minsEl = document.getElementById("timerMinutes");
    const secsEl = document.getElementById("timerSeconds");
    if (!hoursEl || !minsEl || !secsEl) return;

    let totalSeconds = (8 * 3600) + (45 * 60) + 30;

    setInterval(() => {
        if (totalSeconds <= 0) totalSeconds = 24 * 3600;
        totalSeconds--;

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        hoursEl.textContent = String(h).padStart(2, "0");
        minsEl.textContent = String(m).padStart(2, "0");
        secsEl.textContent = String(s).padStart(2, "0");
    }, 1000);
}

// ==========================================================================
// 18. HERO QUICK ADD & NEWSLETTER
// ==========================================================================
function initHeroQuickAdd() {
    document.querySelector(".showcase-add-btn")?.addEventListener("click", () => {
        addToCart(1);
    });
}

function initNewsletter() {
    document.getElementById("newsletterForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("newsletterEmail")?.value;
        showToast("Welcome to VIP Club! Your 15% code is: VIP15", "🎉", "VIP Access Unlocked");
        e.target.reset();
    });
}

// ==========================================================================
// 19. CONFETTI CELEBRATION EFFECT
// ==========================================================================
function triggerConfetti() {
    for (let i = 0; i < 40; i++) {
        const conf = document.createElement("div");
        conf.style.position = "fixed";
        conf.style.zIndex = "999";
        conf.style.width = `${Math.random() * 10 + 6}px`;
        conf.style.height = `${Math.random() * 10 + 6}px`;
        conf.style.backgroundColor = ["#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"][Math.floor(Math.random() * 5)];
        conf.style.left = `${Math.random() * 100}vw`;
        conf.style.top = "-20px";
        conf.style.borderRadius = "2px";
        conf.style.opacity = "1";
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        conf.style.transition = `top ${Math.random() * 2 + 1.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 2s ease, transform 2s ease`;
        document.body.appendChild(conf);

        setTimeout(() => {
            conf.style.top = "105vh";
            conf.style.opacity = "0";
            conf.style.transform = `rotate(${Math.random() * 720}deg) scale(0.5)`;
        }, 50);

        setTimeout(() => conf.remove(), 2500);
    }
}
