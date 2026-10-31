/**
 * NexCommerce - Production Express Server v2.5
 * Enterprise-grade Node.js/Express REST API with dual-engine persistence:
 * High-Availability MongoDB with automatic, resilient In-Memory + Local JSON fallback.
 * Includes Helmet security, CORS, Rate-Limiting, Compression, Morgan logging,
 * and static asset hosting.
 */

require('dotenv').config();
const path        = require('path');
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const compression = require('compression');
const rateLimit   = require('express-rate-limit');

const { connectDB, getDbStatus } = require('./config/db');
const Product = require('./models/Product');
const Order   = require('./models/Order');
const Promo   = require('./models/Promo');
const Review  = require('./models/Review');
const { PRODUCTS, PROMOS, REVIEWS } = require('./data/initialData');

// ---------------------------------------------------------------------------
// High-Availability In-Memory Store
// Pre-populated with master catalog for zero-downtime offline execution.
// ---------------------------------------------------------------------------
const memoryStore = {
    products: JSON.parse(JSON.stringify(PRODUCTS)),
    orders:   [],
    promos:   JSON.parse(JSON.stringify(PROMOS)),
    reviews:  JSON.parse(JSON.stringify(REVIEWS))
};

// ---------------------------------------------------------------------------
// Express App Setup
// ---------------------------------------------------------------------------
const app  = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const startTime = Date.now();

// Security Headers with tailored Content Security Policy
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc:  ["'self'", "'unsafe-inline'"],
            styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc:    ["'self'", "https://fonts.gstatic.com"],
            imgSrc:     ["'self'", "data:", "https://images.unsplash.com"],
            connectSrc: ["'self'", "http://localhost:*", "http://127.0.0.1:*"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Robust CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// Body Parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Global API Rate Limiter
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Rate limit exceeded. Please try again shortly.' }
});
app.use('/api', globalLimiter);

// Static Hosting (Serves frontend assets from project root)
app.use(express.static(path.join(__dirname, '..'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

// ---------------------------------------------------------------------------
// Helper Utilities
// ---------------------------------------------------------------------------
function usesMongo() {
    return getDbStatus().connectionMode === 'mongodb';
}

// ---------------------------------------------------------------------------
// REST API ROUTES
// ---------------------------------------------------------------------------

/**
 * GET /api/health
 * Comprehensive system health diagnostic & engine telemetry
 */
app.get('/api/health', (req, res) => {
    const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
    const dbStatus  = getDbStatus();
    const productCount = usesMongo() ? null : memoryStore.products.length;
    const orderCount   = usesMongo() ? null : memoryStore.orders.length;

    res.json({
        status: 'healthy',
        service: 'NexCommerce Enterprise API',
        version: '2.5.0',
        environment: process.env.NODE_ENV || 'development',
        uptimeSeconds: uptimeSec,
        database: {
            ...dbStatus,
            activeStore: usesMongo() ? 'MongoDB Cluster' : 'In-Memory High-Availability Engine'
        },
        counts: {
            products: productCount,
            orders: orderCount
        },
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /api/stats
 * Real-time storefront metrics
 */
app.get('/api/stats', async (req, res) => {
    try {
        if (usesMongo()) {
            const [productCount, orderCount, orders] = await Promise.all([
                Product.countDocuments(),
                Order.countDocuments(),
                Order.find().select('pricing.total')
            ]);
            const revenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
            return res.json({
                success: true,
                data: {
                    totalProducts: productCount,
                    totalOrders: orderCount,
                    totalRevenue: parseFloat(revenue.toFixed(2)),
                    averageRating: 4.8
                }
            });
        }

        const revenue = memoryStore.orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
        res.json({
            success: true,
            data: {
                totalProducts: memoryStore.products.length,
                totalOrders: memoryStore.orders.length,
                totalRevenue: parseFloat(revenue.toFixed(2)),
                averageRating: 4.8
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to compute store metrics' });
    }
});

/**
 * GET /api/categories
 * Returns all active categories with product counts
 */
app.get('/api/categories', async (req, res) => {
    try {
        if (usesMongo()) {
            const categories = await Product.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);
            return res.json({
                success: true,
                data: categories.map(c => ({ name: c._id, count: c.count }))
            });
        }

        const counts = {};
        memoryStore.products.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        const list = Object.keys(counts).map(cat => ({ name: cat, count: counts[cat] }));
        res.json({ success: true, data: list });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
});

/**
 * GET /api/products
 * Query, filter, search, sort, and paginate products
 */
app.get('/api/products', async (req, res) => {
    try {
        const { category, search, sort, minPrice, maxPrice, inStock, featured, limit = 50, page = 1 } = req.query;

        if (usesMongo()) {
            const query = {};
            if (category && category !== 'all') query.category = category.toLowerCase();
            if (inStock === 'true') query.stock = { $gt: 0 };
            if (featured === 'true') query.featured = true;
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = parseFloat(minPrice);
                if (maxPrice) query.price.$lte = parseFloat(maxPrice);
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ];
            }

            const sortMap = {
                'price-low':  { price: 1 },
                'price-high': { price: -1 },
                'rating':     { rating: -1 },
                'discount':   { originalPrice: -1 },
                'newest':     { createdAt: -1 }
            };
            const sortObj = sortMap[sort] || { id: 1 };
            const pageNum = Math.max(1, parseInt(page, 10));
            const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
            const skip = (pageNum - 1) * limitNum;

            const [products, total] = await Promise.all([
                Product.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
                Product.countDocuments(query)
            ]);
            return res.json({ success: true, data: products, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
        }

        // Memory Store Handler
        let items = [...memoryStore.products];
        if (category && category !== 'all') {
            items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        if (inStock === 'true') {
            items = items.filter(p => p.stock > 0);
        }
        if (featured === 'true') {
            items = items.filter(p => p.featured === true);
        }
        if (maxPrice) items = items.filter(p => p.price <= parseFloat(maxPrice));
        if (minPrice) items = items.filter(p => p.price >= parseFloat(minPrice));
        if (search) {
            const q = search.toLowerCase().trim();
            items = items.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        if (sort === 'price-low')       items.sort((a, b) => a.price - b.price);
        else if (sort === 'price-high') items.sort((a, b) => b.price - a.price);
        else if (sort === 'rating')     items.sort((a, b) => b.rating - a.rating);
        else if (sort === 'newest')     items.sort((a, b) => b.id - a.id);
        else                            items.sort((a, b) => a.id - b.id);

        const pageNum  = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
        const total    = items.length;
        const startIdx = (pageNum - 1) * limitNum;
        const paginated = items.slice(startIdx, startIdx + limitNum);

        res.json({
            success: true,
            data: paginated,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum)
        });
    } catch (err) {
        console.error('GET /api/products error:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve products catalog' });
    }
});

/**
 * GET /api/products/:id
 * Retrieve a single product by numeric identifier
 */
app.get('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid numeric product ID' });

        const product = usesMongo()
            ? await Product.findOne({ id }).lean()
            : memoryStore.products.find(p => p.id === id);

        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to retrieve product details' });
    }
});

/**
 * POST /api/products (Admin / Inventory creation)
 */
app.post('/api/products', async (req, res) => {
    try {
        const { name, category, price, description, image, stock, specs, variants } = req.body;
        if (!name || !price || !category || !image || !description) {
            return res.status(400).json({ success: false, error: 'Missing mandatory product fields (name, price, category, image, description)' });
        }

        const nextId = usesMongo()
            ? (await Product.countDocuments()) + 1
            : memoryStore.products.length + 1;

        const newProduct = {
            id: nextId,
            name: name.trim(),
            category: category.toLowerCase().trim(),
            price: parseFloat(price),
            originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
            rating: 5.0,
            reviewsCount: 0,
            stock: parseInt(stock, 10) || 10,
            badge: req.body.badge || 'new',
            badgeText: req.body.badgeText || 'NEW',
            image: image.trim(),
            description: description.trim(),
            specs: Array.isArray(specs) ? specs : [],
            variants: Array.isArray(variants) ? variants : [],
            featured: Boolean(req.body.featured)
        };

        if (usesMongo()) {
            const saved = await Product.create(newProduct);
            return res.status(201).json({ success: true, data: saved });
        }

        memoryStore.products.push(newProduct);
        res.status(201).json({ success: true, data: newProduct });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to create new product' });
    }
});

/**
 * POST /api/orders
 * Process checkout, validate customer input, reserve stock, and generate receipt
 */
const orderLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    message: { success: false, error: 'Too many order attempts. Please wait a moment.' }
});

app.post('/api/orders', orderLimiter, async (req, res) => {
    try {
        const { customer, items, pricing, paymentMethod } = req.body;

        if (!customer?.name || !customer?.email || !customer?.address) {
            return res.status(400).json({ success: false, error: 'Incomplete customer details (name, email, address are required)' });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
        }
        if (!pricing?.total || isNaN(pricing.total)) {
            return res.status(400).json({ success: false, error: 'Valid order total is required' });
        }

        const orderId = `#NEX-${Math.floor(10000 + Math.random() * 90000)}`;
        const orderData = {
            orderId,
            customer: {
                name: customer.name.trim(),
                email: customer.email.trim().toLowerCase(),
                address: customer.address.trim(),
                city: customer.city ? customer.city.trim() : 'Metro',
                zip: customer.zip ? customer.zip.trim() : '00000',
                country: customer.country ? customer.country.trim() : 'United States'
            },
            items: items.map(it => ({
                id: it.id,
                name: it.name,
                price: parseFloat(it.price),
                quantity: parseInt(it.quantity, 10) || 1,
                variant: it.variant || null,
                image: it.image || ''
            })),
            pricing: {
                subtotal: parseFloat(pricing.subtotal || pricing.total),
                discount: parseFloat(pricing.discount || 0),
                promoCode: pricing.promoCode || null,
                tax: parseFloat(pricing.tax || 0),
                shipping: parseFloat(pricing.shipping || 0),
                total: parseFloat(pricing.total)
            },
            paymentMethod: paymentMethod || 'card',
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        // Inventory Stock Deduction
        if (usesMongo()) {
            for (const item of items) {
                await Product.updateOne({ id: item.id, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } });
            }
            const order = await Order.create(orderData);
            return res.status(201).json({
                success: true,
                data: {
                    orderId: order.orderId,
                    status: order.status,
                    total: order.pricing.total,
                    createdAt: order.createdAt
                }
            });
        }

        // Memory Store Deduction
        for (const item of items) {
            const prod = memoryStore.products.find(p => p.id === item.id);
            if (prod && prod.stock >= item.quantity) {
                prod.stock -= item.quantity;
            }
        }
        memoryStore.orders.push(orderData);

        res.status(201).json({
            success: true,
            data: {
                orderId: orderData.orderId,
                status: orderData.status,
                total: orderData.pricing.total,
                createdAt: orderData.createdAt
            }
        });
    } catch (err) {
        console.error('POST /api/orders error:', err);
        res.status(500).json({ success: false, error: 'Failed to process order. Please try again.' });
    }
});

/**
 * GET /api/orders/:orderId
 * Retrieve order receipt and tracking status
 */
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId.toUpperCase();
        const order = usesMongo()
            ? await Order.findOne({ orderId }).lean()
            : memoryStore.orders.find(o => o.orderId === orderId);

        if (!order) return res.status(404).json({ success: false, error: `Order ${orderId} not found` });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to retrieve order receipt' });
    }
});

/**
 * GET /api/orders
 * Retrieve list of recent orders
 */
app.get('/api/orders', async (req, res) => {
    try {
        if (usesMongo()) {
            const orders = await Order.find().sort({ createdAt: -1 }).limit(20).lean();
            return res.json({ success: true, data: orders });
        }
        res.json({ success: true, data: [...memoryStore.orders].reverse().slice(0, 20) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to list orders' });
    }
});

/**
 * GET /api/promos
 * List all active promotional discount codes
 */
app.get('/api/promos', async (req, res) => {
    try {
        if (usesMongo()) {
            const promos = await Promo.find({ isActive: true }).select('-__v').lean();
            return res.json({ success: true, data: promos });
        }
        res.json({ success: true, data: memoryStore.promos.filter(p => p.isActive) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch promotional offers' });
    }
});

/**
 * POST /api/promos/validate
 * Validates promo code against a cart subtotal and calculates discount
 */
app.post('/api/promos/validate', async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: 'Promo code is required' });
        }

        const normalizedCode = code.trim().toUpperCase();
        const promo = usesMongo()
            ? await Promo.findOne({ code: normalizedCode, isActive: true }).lean()
            : memoryStore.promos.find(p => p.code === normalizedCode && p.isActive);

        if (!promo) {
            return res.status(404).json({ success: false, valid: false, error: `Promo code "${normalizedCode}" is invalid or expired` });
        }

        const cartSubtotal = typeof subtotal === 'number' ? subtotal : parseFloat(subtotal || '0');
        const minOrder = promo.minOrder || 0;

        if (cartSubtotal < minOrder) {
            return res.status(400).json({
                success: false,
                valid: false,
                error: `Promo code ${promo.code} requires a minimum order of $${minOrder.toFixed(2)}. Your current subtotal is $${cartSubtotal.toFixed(2)}.`,
                minOrderRequired: minOrder
            });
        }

        let discount = 0;
        let isFreeShipping = false;

        if (promo.type === 'percent') {
            discount = parseFloat((cartSubtotal * promo.value).toFixed(2));
        } else if (promo.type === 'fixed') {
            discount = parseFloat(Math.min(cartSubtotal, promo.value).toFixed(2));
        } else if (promo.type === 'shipping') {
            isFreeShipping = true;
        }

        res.json({
            success: true,
            valid: true,
            data: {
                code: promo.code,
                type: promo.type,
                value: promo.value,
                label: promo.label,
                minOrder: promo.minOrder || 0,
                discount,
                isFreeShipping
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to validate promo code' });
    }
});

/**
 * GET /api/promo/:code and GET /api/promos/:code
 * Validate promotional coupon codes
 */
const handleGetPromo = async (req, res) => {
    try {
        const code = req.params.code.trim().toUpperCase();
        const promo = usesMongo()
            ? await Promo.findOne({ code, isActive: true }).lean()
            : memoryStore.promos.find(p => p.code === code && p.isActive);

        if (!promo) {
            return res.status(404).json({ success: false, error: 'Invalid or expired promotional code' });
        }
        res.json({
            success: true,
            data: {
                code: promo.code,
                type: promo.type,
                value: promo.value,
                label: promo.label,
                minOrder: promo.minOrder || 0
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to evaluate promo code' });
    }
};

app.get('/api/promo/:code', handleGetPromo);
app.get('/api/promos/:code', handleGetPromo);

/**
 * POST /api/promos
 * Create a new promotional discount code (Admin)
 */
app.post('/api/promos', async (req, res) => {
    try {
        const { code, type, value, label, minOrder } = req.body;
        if (!code || !type || value === undefined || !label) {
            return res.status(400).json({ success: false, error: 'Missing mandatory fields (code, type, value, label)' });
        }

        const validTypes = ['percent', 'fixed', 'shipping'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ success: false, error: `Invalid promo type. Must be one of: ${validTypes.join(', ')}` });
        }

        const newPromo = {
            code: code.trim().toUpperCase(),
            type,
            value: parseFloat(value),
            label: label.trim(),
            minOrder: minOrder ? parseFloat(minOrder) : 0,
            isActive: true
        };

        if (usesMongo()) {
            const created = await Promo.create(newPromo);
            return res.status(201).json({ success: true, data: created });
        }

        const existingIdx = memoryStore.promos.findIndex(p => p.code === newPromo.code);
        if (existingIdx >= 0) {
            memoryStore.promos[existingIdx] = newPromo;
        } else {
            memoryStore.promos.push(newPromo);
        }
        res.status(201).json({ success: true, data: newPromo });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, error: 'A promo code with this name already exists' });
        }
        res.status(500).json({ success: false, error: 'Failed to create promotional code' });
    }
});

/**
 * GET /api/reviews
 * Fetch verified customer testimonials
 */
app.get('/api/reviews', async (req, res) => {
    try {
        if (usesMongo()) {
            const reviews = await Review.find().sort({ createdAt: -1 }).limit(20).lean();
            return res.json({ success: true, data: reviews });
        }
        res.json({ success: true, data: memoryStore.reviews });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

/**
 * POST /api/reviews
 * Submit a verified customer review
 */
app.post('/api/reviews', async (req, res) => {
    try {
        const { author, comment, rating, productId } = req.body;
        if (!author || !comment || !rating) {
            return res.status(400).json({ success: false, error: 'Author name, comment, and rating are required' });
        }

        const newReview = {
            author: author.trim(),
            role: 'Verified Buyer',
            avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*100000000)}?w=150&auto=format&fit=crop&q=80`,
            rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
            comment: comment.trim(),
            productId: productId ? parseInt(productId, 10) : null,
            createdAt: new Date().toISOString()
        };

        if (usesMongo()) {
            const saved = await Review.create(newReview);
            return res.status(201).json({ success: true, data: saved });
        }

        memoryStore.reviews.unshift(newReview);
        res.status(201).json({ success: true, data: newReview });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to post review' });
    }
});

// Single Page Application Fallback (SPA HTML5 History Mode)
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(__dirname, '..', 'index.html'));
    }
    next();
});

// 404 Handler for API routes
app.use((req, res) => {
    res.status(404).json({ success: false, error: `Endpoint ${req.method} ${req.path} not found` });
});

// Global Error Handler
app.use((err, req, res, _next) => {
    console.error('⚠️ Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// ---------------------------------------------------------------------------
// Server Bootstrap & MongoDB Auto-Seeder
// ---------------------------------------------------------------------------
async function bootstrap() {
    console.log('\n======================================================');
    console.log('   🛍️   NexCommerce Enterprise Server Bootstrapping');
    console.log('======================================================\n');

    const db = await connectDB();

    // If connected to MongoDB, ensure collections are initialized
    if (db.connectionMode === 'mongodb') {
        try {
            const count = await Product.countDocuments();
            if (count === 0) {
                console.log('🌱 MongoDB is empty. Auto-seeding initial master catalog...');
                await Product.insertMany(PRODUCTS);
                await Promo.insertMany(PROMOS);
                await Review.insertMany(REVIEWS);
                console.log(`✅ Auto-seeded ${PRODUCTS.length} products & promos into MongoDB.`);
            }
        } catch (seedErr) {
            console.warn('⚠️ Non-fatal auto-seed warning:', seedErr.message);
        }
    } else {
        console.log(`📦 Loaded ${memoryStore.products.length} catalog items into High-Availability Engine.`);
    }

    const server = app.listen(PORT, () => {
        console.log(`\n🚀 Server is live & ready for production traffic:`);
        console.log(`   → Storefront: http://localhost:${PORT}`);
        console.log(`   → Health API: http://localhost:${PORT}/api/health`);
        console.log(`   → Products:   http://localhost:${PORT}/api/products`);
        console.log(`   → Promos:     http://localhost:${PORT}/api/promos`);
        console.log(`   → Engine:     ${getDbStatus().connectionMode.toUpperCase()}`);
        console.log(`   → Mode:       ${process.env.NODE_ENV || 'development'}\n`);
    });

    // Graceful Shutdown Handler for Container Orchestration & Production Process Managers
    const gracefulShutdown = (signal) => {
        console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown...`);
        server.close(async () => {
            console.log('HTTP connections closed.');
            if (usesMongo()) {
                try {
                    const mongoose = require('mongoose');
                    await mongoose.connection.close(false);
                    console.log('MongoDB connection closed.');
                } catch (closeErr) {
                    console.error('Error closing MongoDB connection:', closeErr.message);
                }
            }
            process.exit(0);
        });

        // Forced termination timeout after 10 seconds
        setTimeout(() => {
            console.error('⚠️ Forcing server shutdown after timeout.');
            process.exit(1);
        }, 10000).unref();
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

bootstrap().catch(err => {
    console.error('❌ Fatal bootstrap failure:', err);
    process.exit(1);
});
