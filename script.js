/* ================================================================
   ShopEase - E-commerce Website JavaScript
   ================================================================
   This file handles all the interactive features of the website:
   - Displaying products from data
   - Shopping cart management (add, remove, update quantity)
   - Search and category filtering
   - Checkout process (demo)
   - UI interactions (mobile menu, toast notifications)
   ================================================================ */


/* ====================================================
   SECTION 1: PRODUCT DATA
   ====================================================
   This array holds all our product information.
   Each product is an "object" with properties like id, name, price, etc.
   JavaScript will use this data to create the product cards on the page.
   ==================================================== */

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        category: "electronics",
        image: "https://picsum.photos/seed/headphones22/400/400",
        emoji: "🎧",
        description: "Premium noise-cancelling wireless headphones with deep bass"
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        price: 199.99,
        category: "electronics",
        image: "https://picsum.photos/seed/smartwatch44/400/400",
        emoji: "⌚",
        description: "Track your fitness and stay connected on the go"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 49.99,
        category: "electronics",
        image: "https://picsum.photos/seed/speaker55/400/400",
        emoji: "🔊",
        description: "Portable speaker with 360-degree immersive sound"
    },
    {
        id: 4,
        name: "Laptop Stand",
        price: 39.99,
        category: "electronics",
        image: "https://picsum.photos/seed/laptopstand66/400/400",
        emoji: "💻",
        description: "Ergonomic aluminum stand for better posture"
    },
    {
        id: 5,
        name: "Leather Wallet",
        price: 29.99,
        category: "fashion",
        image: "https://picsum.photos/seed/wallet77/400/400",
        emoji: "👛",
        description: "Genuine leather bifold wallet with RFID protection"
    },
    {
        id: 6,
        name: "Classic Sunglasses",
        price: 59.99,
        category: "fashion",
        image: "https://picsum.photos/seed/sunglasses88/400/400",
        emoji: "🕶️",
        description: "UV400 polarized lenses with lightweight frame"
    },
    {
        id: 7,
        name: "Canvas Backpack",
        price: 45.99,
        category: "fashion",
        image: "https://picsum.photos/seed/backpack99/400/400",
        emoji: "🎒",
        description: "Durable canvas backpack with multiple compartments"
    },
    {
        id: 8,
        name: "Running Shoes",
        price: 89.99,
        category: "fashion",
        image: "https://picsum.photos/seed/shoes111/400/400",
        emoji: "👟",
        description: "Lightweight breathable shoes for everyday comfort"
    },
    {
        id: 9,
        name: "Phone Case",
        price: 19.99,
        category: "accessories",
        image: "https://picsum.photos/seed/phonecase222/400/400",
        emoji: "📱",
        description: "Shockproof slim case with premium matte finish"
    },
    {
        id: 10,
        name: "USB-C Hub",
        price: 34.99,
        category: "accessories",
        image: "https://picsum.photos/seed/usbhub333/400/400",
        emoji: "🔌",
        description: "7-in-1 multiport adapter for all your devices"
    }
];


/* ====================================================
   SECTION 2: CART DATA
   ====================================================
   The cart is an array that stores items the user has added.
   Each cart item contains product info plus a "quantity" property.
   We use "let" because the cart changes (items get added/removed).
   ==================================================== */

let cart = [];


/* ====================================================
   SECTION 3: TRACKING CURRENT FILTERS
   ====================================================
   These variables keep track of the current search term
   and selected category so search and filter work together.
   ==================================================== */

let currentSearchTerm = "";
let currentCategory = "all";


/* ====================================================
   SECTION 4: DOM ELEMENT REFERENCES
   ====================================================
   We grab references to HTML elements we need to interact with.
   This way we don't have to search the document every time.
   "document.getElementById" finds an element by its "id" attribute.
   "document.querySelector" finds the first element matching a CSS selector.
   ==================================================== */

// Product display elements
const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");

// Search elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

// Category filter buttons
const categoryFilters = document.getElementById("categoryFilters");
const filterButtons = categoryFilters.querySelectorAll(".filter-btn");

// Cart sidebar elements
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartSidebar = document.getElementById("cartSidebar");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const shippingText = document.getElementById("shippingText");
const cartFooter = document.getElementById("cartFooter");

// Checkout elements
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const modalTotal = document.getElementById("modalTotal");
const modalCloseBtn = document.getElementById("modalCloseBtn");

// Mobile menu elements
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

// Toast notification elements
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");


/* ====================================================
   SECTION 5: DISPLAY PRODUCTS
   ====================================================
   This function takes an array of products and creates
   HTML cards for each one, then inserts them into the page.
   ==================================================== */

/**
 * displayProducts - Creates and shows product cards on the page
 * @param {Array} productsToShow - Array of product objects to display
 */
function displayProducts(productsToShow) {
    // Clear the current product grid
    productGrid.innerHTML = "";

    // Check if there are products to show
    if (productsToShow.length === 0) {
        // No products found - show the "no results" message
        productGrid.classList.add("hidden");
        noResults.classList.add("show");
        return;
    }

    // Products found - hide the "no results" message and show the grid
    productGrid.classList.remove("hidden");
    noResults.classList.remove("show");

    // Loop through each product and create a card
    productsToShow.forEach(function (product) {
        // Create the product card HTML
        const cardHTML = `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-wrapper">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="product-image"
                        loading="lazy"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    >
                    <div class="product-image-fallback" style="display: none;">
                        ${product.emoji}
                        <span>${product.name}</span>
                    </div>
                    <span class="product-category">${product.category}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-bottom">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button
                            class="add-to-cart-btn"
                            data-product-id="${product.id}"
                            aria-label="Add ${product.name} to cart"
                        >
                            🛒 Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insert the card into the product grid
        productGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
}


/* ====================================================
   SECTION 6: SEARCH AND FILTER FUNCTIONS
   ====================================================
   These functions let users find products by typing a
   search term or clicking a category filter button.
   Search and filter work together — you can search
   within a selected category.
   ==================================================== */

/**
 * getFilteredProducts - Filters products by search term AND category
 * Returns an array of products that match both criteria
 */
function getFilteredProducts() {
    // Start with all products
    let filteredProducts = products;

    // Step 1: Filter by category (if not "all")
    if (currentCategory !== "all") {
        filteredProducts = filteredProducts.filter(function (product) {
            return product.category === currentCategory;
        });
    }

    // Step 2: Filter by search term (if not empty)
    if (currentSearchTerm !== "") {
        // Convert search term to lowercase for case-insensitive matching
        const searchLower = currentSearchTerm.toLowerCase();

        filteredProducts = filteredProducts.filter(function (product) {
            // Check if the product name contains the search term
            const nameMatch = product.name.toLowerCase().includes(searchLower);
            // Also check the description
            const descMatch = product.description.toLowerCase().includes(searchLower);
            // Return true if either matches
            return nameMatch || descMatch;
        });
    }

    return filteredProducts;
}

/**
 * handleSearch - Called when the user types in the search box
 * Updates the search term and refreshes the product display
 */
function handleSearch() {
    // Get the current value from the search input
    currentSearchTerm = searchInput.value.trim();
    // Get products that match search + category
    const results = getFilteredProducts();
    // Display the matching products
    displayProducts(results);
}

/**
 * handleCategoryFilter - Called when a category button is clicked
 * @param {string} category - The category to filter by ("all", "electronics", etc.)
 */
function handleCategoryFilter(category) {
    // Update the current category
    currentCategory = category;

    // Update button styles - remove "active" from all, add to clicked one
    filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
        if (btn.getAttribute("data-category") === category) {
            btn.classList.add("active");
        }
    });

    // Get products that match search + category
    const results = getFilteredProducts();
    // Display the matching products
    displayProducts(results);
}

/**
 * clearAllFilters - Resets search and category to show all products
 */
function clearAllFilters() {
    currentSearchTerm = "";
    currentCategory = "all";
    searchInput.value = "";

    // Reset category buttons
    filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
        if (btn.getAttribute("data-category") === "all") {
            btn.classList.add("active");
        }
    });

    // Show all products
    displayProducts(products);
}


/* ====================================================
   SECTION 7: CART FUNCTIONS
   ====================================================
   These functions manage the shopping cart:
   - Adding items
   - Removing items
   - Changing quantities
   - Calculating totals
   - Updating the cart display
   ==================================================== */

/**
 * addToCart - Adds a product to the cart
 * @param {number} productId - The id of the product to add
 */
function addToCart(productId) {
    // Find the product in our products array
    const product = products.find(function (p) {
        return p.id === productId;
    });

    // If product not found, stop here
    if (!product) {
        return;
    }

    // Check if this product is already in the cart
    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {
        // Product already in cart - increase quantity by 1
        existingItem.quantity = existingItem.quantity + 1;
    } else {
        // Product not in cart - add it with quantity 1
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            emoji: product.emoji,
            quantity: 1
        };
        cart.push(cartItem);
    }

    // Update the cart display
    updateCartDisplay();
    // Update the cart count badge
    updateCartCount();
    // Show a success toast notification
    showToast(product.name + " added to cart!", "✅");
}

/**
 * removeFromCart - Removes a product completely from the cart
 * @param {number} productId - The id of the product to remove
 */
function removeFromCart(productId) {
    // Find the item's name before removing (for the toast message)
    const item = cart.find(function (item) {
        return item.id === productId;
    });
    const itemName = item ? item.name : "Item";

    // Create a new array without the removed product
    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    // Update displays
    updateCartDisplay();
    updateCartCount();
    showToast(itemName + " removed from cart", "🗑️");
}

/**
 * updateQuantity - Increases or decreases item quantity in the cart
 * @param {number} productId - The id of the product
 * @param {number} change - How much to change (+1 or -1)
 */
function updateQuantity(productId, change) {
    // Find the item in the cart
    const item = cart.find(function (cartItem) {
        return cartItem.id === productId;
    });

    // If item not found, stop
    if (!item) {
        return;
    }

    // Calculate new quantity
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        // Quantity would be 0 or less - remove the item
        removeFromCart(productId);
    } else {
        // Update the quantity
        item.quantity = newQuantity;
        // Update displays
        updateCartDisplay();
        updateCartCount();
    }
}

/**
 * calculateCartTotals - Calculates subtotal and total price
 * Returns an object with subtotal and total
 */
function calculateCartTotals() {
    // Calculate subtotal by adding up price × quantity for each item
    let subtotal = 0;

    cart.forEach(function (item) {
        subtotal = subtotal + (item.price * item.quantity);
    });

    // For this demo, total equals subtotal (free shipping)
    const total = subtotal;

    return {
        subtotal: subtotal,
        total: total
    };
}

/**
 * updateCartCount - Updates the cart badge number in the header
 */
function updateCartCount() {
    // Count total items (including quantities)
    let totalItems = 0;

    cart.forEach(function (item) {
        totalItems = totalItems + item.quantity;
    });

    // Update the displayed count
    cartCount.textContent = totalItems;

    // Add a bump animation
    cartCount.classList.remove("bump");
    // This trick forces the browser to restart the animation
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");
}

/**
 * updateCartDisplay - Refreshes the entire cart sidebar content
 * Shows cart items if there are any, or an empty cart message
 */
function updateCartDisplay() {
    // Clear the current cart items display
    cartItems.innerHTML = "";

    // Check if cart is empty
    if (cart.length === 0) {
        // Show empty cart message
        cartItems.innerHTML = `
            <div class="cart-empty">
                <span class="cart-empty-icon">🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;

        // Update totals to $0
        cartSubtotal.textContent = "$0.00";
        cartTotal.textContent = "$0.00";
        shippingText.textContent = "—";
        return;
    }

    // Cart has items — create HTML for each item
    cart.forEach(function (item) {
        const itemTotal = item.price * item.quantity;

        const itemHTML = `
            <div class="cart-item" data-cart-item-id="${item.id}">
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="cart-item-image"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >
                <div class="cart-item-image-fallback" style="display: none;">
                    ${item.emoji}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button
                            class="qty-btn qty-decrease"
                            data-product-id="${item.id}"
                            aria-label="Decrease quantity of ${item.name}"
                        >−</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button
                            class="qty-btn qty-increase"
                            data-product-id="${item.id}"
                            aria-label="Increase quantity of ${item.name}"
                        >+</button>
                        <button
                            class="remove-btn"
                            data-product-id="${item.id}"
                            aria-label="Remove ${item.name} from cart"
                        >🗑️</button>
                    </div>
                </div>
            </div>
        `;

        cartItems.insertAdjacentHTML("beforeend", itemHTML);
    });

    // Update totals
    const totals = calculateCartTotals();
    cartSubtotal.textContent = "$" + totals.subtotal.toFixed(2);
    cartTotal.textContent = "$" + totals.total.toFixed(2);
    shippingText.textContent = "Free";
}


/* ====================================================
   SECTION 8: CART SIDEBAR OPEN/CLOSE
   ====================================================
   Functions to open and close the cart sidebar panel
   ==================================================== */

/**
 * openCart - Opens the cart sidebar
 */
function openCart() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
    // Prevent scrolling when cart is open
    document.body.style.overflow = "hidden";
}

/**
 * closeCart - Closes the cart sidebar
 */
function closeCart() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
    // Re-enable scrolling
    document.body.style.overflow = "";
}


/* ====================================================
   SECTION 9: CHECKOUT FUNCTION
   ====================================================
   Handles the demo checkout process
   ==================================================== */

/**
 * handleCheckout - Processes a demo checkout
 */
function handleCheckout() {
    // Check if cart is empty
    if (cart.length === 0) {
        showToast("Your cart is empty! Add some items first.", "⚠️");
        return;
    }

    // Calculate the total
    const totals = calculateCartTotals();

    // Show the checkout confirmation modal
    modalTotal.textContent = "Total: $" + totals.total.toFixed(2);
    checkoutModal.classList.add("show");

    // Close the cart sidebar
    closeCart();

    // Clear the cart after "checkout"
    cart = [];
    updateCartDisplay();
    updateCartCount();
}

/**
 * closeCheckoutModal - Closes the checkout success modal
 */
function closeCheckoutModal() {
    checkoutModal.classList.remove("show");
}


/* ====================================================
   SECTION 10: TOAST NOTIFICATION
   ====================================================
   Shows a brief popup message at the bottom of the screen
   ==================================================== */

// Variable to track if a toast is currently showing
let toastTimeout = null;

/**
 * showToast - Displays a temporary notification message
 * @param {string} message - The message to show
 * @param {string} icon - The emoji icon to display
 */
function showToast(message, icon) {
    // Set the message and icon
    toastMessage.textContent = message;
    toastIcon.textContent = icon;

    // Show the toast
    toast.classList.add("show");

    // Clear any previous timeout (in case a toast is already showing)
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Hide the toast after 2.5 seconds
    toastTimeout = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}


/* ====================================================
   SECTION 11: MOBILE MENU
   ====================================================
   Handles the mobile hamburger menu toggle
   ==================================================== */

/**
 * toggleMobileMenu - Opens or closes the mobile navigation
 */
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle("active");
    mobileNav.classList.toggle("open");
}


/* ====================================================
   SECTION 12: EVENT LISTENERS
   ====================================================
   Event listeners tell the browser:
   "When THIS happens, run THAT function."
   We set up all the event listeners here.
   ==================================================== */

// --- Search Events ---
// When the user types in the search box
searchInput.addEventListener("input", handleSearch);
// When the user clicks the search button
searchButton.addEventListener("click", handleSearch);
// When the user presses Enter in the search box
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// --- Category Filter Events ---
// When a category filter button is clicked
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const category = button.getAttribute("data-category");
        handleCategoryFilter(category);
    });
});

// --- Clear Filters Button ---
clearFiltersBtn.addEventListener("click", clearAllFilters);

// --- Product Grid Click Events (Event Delegation) ---
// Instead of adding a listener to each button, we add ONE listener
// to the grid and check which button was clicked
productGrid.addEventListener("click", function (event) {
    // Find the closest "add-to-cart-btn" button that was clicked
    const addButton = event.target.closest(".add-to-cart-btn");

    if (addButton) {
        // Get the product ID from the button's data attribute
        const productId = parseInt(addButton.getAttribute("data-product-id"));
        addToCart(productId);
    }
});

// --- Cart Button (open cart) ---
cartButton.addEventListener("click", openCart);

// --- Cart Close Button ---
cartCloseBtn.addEventListener("click", closeCart);

// --- Cart Overlay (click outside cart to close) ---
cartOverlay.addEventListener("click", closeCart);

// --- Cart Items Click Events (Event Delegation) ---
// Handle clicks on quantity buttons and remove buttons inside the cart
cartItems.addEventListener("click", function (event) {
    // Check if a quantity decrease button was clicked
    const decreaseBtn = event.target.closest(".qty-decrease");
    if (decreaseBtn) {
        const productId = parseInt(decreaseBtn.getAttribute("data-product-id"));
        updateQuantity(productId, -1);
        return;
    }

    // Check if a quantity increase button was clicked
    const increaseBtn = event.target.closest(".qty-increase");
    if (increaseBtn) {
        const productId = parseInt(increaseBtn.getAttribute("data-product-id"));
        updateQuantity(productId, +1);
        return;
    }

    // Check if a remove button was clicked
    const removeBtn = event.target.closest(".remove-btn");
    if (removeBtn) {
        const productId = parseInt(removeBtn.getAttribute("data-product-id"));
        removeFromCart(productId);
        return;
    }
});

// --- Checkout Button ---
checkoutBtn.addEventListener("click", handleCheckout);

// --- Modal Close Button ---
modalCloseBtn.addEventListener("click", closeCheckoutModal);

// --- Close modal when clicking outside ---
checkoutModal.addEventListener("click", function (event) {
    // Only close if the click was on the overlay, not the modal content
    if (event.target === checkoutModal) {
        closeCheckoutModal();
    }
});

// --- Mobile Menu Button ---
mobileMenuBtn.addEventListener("click", toggleMobileMenu);

// --- Close mobile menu when a link is clicked ---
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
mobileNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        mobileMenuBtn.classList.remove("active");
        mobileNav.classList.remove("open");
    });
});

// --- Keyboard: Close cart with Escape key ---
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeCart();
        closeCheckoutModal();
        if (mobileNav.classList.contains("open")) {
            toggleMobileMenu();
        }
    }
});

// --- Smooth scroll for nav links ---
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        // Update active state
        navLinks.forEach(function (l) {
            l.classList.remove("active");
        });
        link.classList.add("active");
    });
});


/* ====================================================
   SECTION 13: INITIALIZE THE WEBSITE
   ====================================================
   When the page first loads, we display all products
   and set the cart to empty.
   ==================================================== */

// Display all products when the page loads
displayProducts(products);

// Initialize the cart display (empty)
updateCartDisplay();

// Log a welcome message to the browser console (for learning)
console.log("🛍️ ShopEase website loaded successfully!");
console.log("📦 Total products available:", products.length);
console.log("🛒 Cart is empty. Start shopping!");
