/**
 * NexCommerce - Database Seed Script
 * Populates MongoDB with all 12 products and 3 promo codes.
 * Run with: npm run seed
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Promo    = require('../models/Promo');

const PRODUCTS = [
    { id:1, name:"Sony WH-1000XM5 Spatial Edition", category:"electronics", price:349.99, originalPrice:399.99, rating:4.9, reviewsCount:428, stock:8, badge:"sale", badgeText:"-25% OFF", image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", description:"Industry-leading active noise canceling wireless headphones with dual processors, 8 microphones, and up to 30 hours of lossless battery life.", specs:["Lossless LDAC Codec Support","30-Hour Ultra Battery","Multipoint Bluetooth 5.3","Speak-to-Chat Ambient Sensor"], variants:["Midnight Black","Platinum Silver","Midnight Blue"], featured:true },
    { id:2, name:"Ultra Chrono Apex OLED Smartwatch", category:"electronics", price:249.99, originalPrice:299.99, rating:4.8, reviewsCount:310, stock:14, badge:"bestseller", badgeText:"HOT", image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80", description:"Grade-5 titanium chassis with ultra-bright sapphire OLED display. Complete ECG, sleep tracking, and 100m water resistance.", specs:["Titanium Aerospace Case","Always-on 2000-nit OLED","Multi-band GPS Navigation","7-Day Active Battery"], variants:["Titanium Gray","Deep Space Black","Alpine Orange"] },
    { id:3, name:"AcousticPulse 360 Spatial Speaker", category:"electronics", price:89.99, originalPrice:119.99, rating:4.7, reviewsCount:195, stock:22, badge:"sale", badgeText:"SAVE $30", image:"https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80", description:"Omnidirectional room-filling audio engineered with dual passive radiators and IPX7 waterproof floating rating.", specs:["360 Omnidirectional Bass","IPX7 Full Waterproofing","PartyCast Stereo Sync","18-Hour Continuous Play"], variants:["Matte Black","Cobalt Blue","Forest Green"] },
    { id:4, name:"ProHub 9-in-1 Thunderbolt 4 Dock", category:"electronics", price:59.99, originalPrice:79.99, rating:4.6, reviewsCount:88, stock:19, badge:"new", badgeText:"NEW", image:"https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80", description:"Solid CNC milled aluminum multi-port docking hub supporting dual 4K@60Hz displays and 100W Power Delivery pass-through.", specs:["100W PD Fast Charging","Dual 4K HDMI 2.1 Out","Gigabit Ethernet RJ45","UHS-II SD/microSD Readers"], variants:["Space Gray","Silver"] },
    { id:5, name:"Nordic Wool-Blend Tailored Overcoat", category:"fashion", price:189.99, originalPrice:229.99, rating:4.9, reviewsCount:156, stock:6, badge:"bestseller", badgeText:"TRENDING", image:"https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800&auto=format&fit=crop&q=80", description:"Crafted with 75% recycled Scandinavian wool. Refined relaxed silhouette with thermal insulation and horn buttons.", specs:["Heavyweight Wool Blend","Windproof Interior Lining","Double-Welt Pockets","Sustainable Sourcing"], variants:["Camel","Charcoal Gray","Deep Navy"] },
    { id:6, name:"CloudWalk Aero Lightweight Runners", category:"fashion", price:129.99, originalPrice:159.99, rating:4.8, reviewsCount:512, stock:15, badge:"sale", badgeText:"POPULAR", image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", description:"Ultralight breathable mesh sneakers powered by nitrogen-infused foam soles for cloud-like energy return all day.", specs:["Nitrogen Foam Midsole","Seamless Breathable Knit","Ortholite High-Arch Insole","Weight: 220g"], variants:["Crimson Red","Triple White","Phantom Black"] },
    { id:7, name:"Urban Heritage Roll-Top Canvas Backpack", category:"fashion", price:79.99, originalPrice:99.99, rating:4.7, reviewsCount:240, stock:11, badge:"new", badgeText:"NEW", image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80", description:"Weather-resistant 1000D waxed canvas with magnetic FIDLOCK buckles, padded 16\" laptop sleeve, and expandable 28L storage.", specs:["1000D Waxed Heavy Canvas","Fidlock Magnetic Fasteners","Padded 16-inch Laptop Bay","Water-Repellent YKK Zips"], variants:["Olive Drab","Charcoal","Tobacco Brown"] },
    { id:8, name:"Artisan Full-Grain Italian Leather Wallet", category:"fashion", price:45.99, originalPrice:59.99, rating:4.9, reviewsCount:340, stock:25, badge:"bestseller", badgeText:"BESTSELLER", image:"https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80", description:"Hand-stitched Tuscan vegetable-tanned leather wallet with built-in RFID frequency blocking and quick-access card slots.", specs:["Vegetable-Tanned Tuscan Leather","RFID Frequency Shield","Holds 10 Cards + Cash","Ages With Natural Patina"], variants:["Cognac Brown","Espresso","Classic Black"] },
    { id:9, name:"AeroShield Polarized Titanium Sunglasses", category:"accessories", price:95.00, originalPrice:125.00, rating:4.8, reviewsCount:180, stock:9, badge:"sale", badgeText:"SAVE $30", image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80", description:"Japanese aerospace titanium frames weighing just 14 grams. Category-3 polarized lenses with hydrophobic anti-glare coating.", specs:["Beta-Titanium Ultralight Frame","HD UV400 Polarized Lenses","Anti-Reflective Hydrophobic Coat","Weight: 14 Grams"], variants:["Matte Gold / Green Lens","Gunmetal / Smoke","Silver / Blue Mirror"] },
    { id:10, name:"Monolith Ceramic Modern Table Lamp", category:"accessories", price:64.99, originalPrice:79.99, rating:4.9, reviewsCount:95, stock:18, badge:"new", badgeText:"NEW DROP", image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80", description:"Sculptural textured stoneware base paired with a Belgian linen drum shade. Features smooth 3-stage touch step-dimming.", specs:["Matte Textured Ceramic","3-Stage Touch Capacitive Dimmer","Belgian Linen Drum Shade","Warm 2700K LED Included"], variants:["Sand Beige","Terracotta","Chalk White"] },
    { id:11, name:"Starlight 18K Gold Geometric Pendant", category:"accessories", price:115.00, originalPrice:145.00, rating:4.9, reviewsCount:142, stock:7, badge:"sale", badgeText:"LIMITED", image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80", description:"Ethically mined solid 925 sterling silver base heavily dipped in 2.5 microns of 18K gold vermeil with a brilliant bezel zircon.", specs:["18K Gold Vermeil 2.5um","Solid 925 Sterling Core","Hypoallergenic Nickel-Free","Adjustable 18-20\" Chain"], variants:["18K Yellow Gold","Rhodium Silver","Rose Gold"] },
    { id:12, name:"Ergonomic MagSafe 3-in-1 Charging Stand", category:"accessories", price:49.99, originalPrice:65.00, rating:4.7, reviewsCount:210, stock:30, badge:"bestseller", badgeText:"HOT", image:"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80", description:"Fast charges your phone, smartwatch, and wireless earbuds simultaneously on one weighted anodized aluminum pedestal.", specs:["15W Qi2 Fast Wireless","Strong Neodymium Alignment","Anti-Slip Weighted Base","LED Night Mode Indicator"], variants:["Space Gray","Frosted Silver"] }
];

const PROMOS = [
    { code: 'WELCOME20', type: 'percent', value: 0.20, label: '20% OFF', minOrder: 0, isActive: true },
    { code: 'SAVE10',    type: 'fixed',   value: 10,   label: '$10 OFF', minOrder: 0, isActive: true },
    { code: 'FREESHIP',  type: 'shipping',value: 0,    label: 'FREE SHIPPING', minOrder: 0, isActive: true }
];

async function seed() {
    try {
        console.log('\n🌱 Starting NexCommerce database seed...\n');
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexcommerce';
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
        console.log('✅ Connected to MongoDB:', mongoose.connection.host);

        // Products
        await Product.deleteMany({});
        const insertedProducts = await Product.insertMany(PRODUCTS);
        console.log(`✅ Seeded ${insertedProducts.length} products`);

        // Promos
        await Promo.deleteMany({});
        const insertedPromos = await Promo.insertMany(PROMOS);
        console.log(`✅ Seeded ${insertedPromos.length} promo codes`);

        console.log('\n🎉 Database seeded successfully!\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
