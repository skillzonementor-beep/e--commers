const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['electronics', 'fashion', 'accessories', 'home'],
        index: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be positive']
    },
    originalPrice: {
        type: Number,
        default: null
    },
    rating: {
        type: Number,
        default: 5.0,
        min: 1,
        max: 5
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 10,
        min: 0
    },
    badge: {
        type: String,
        enum: ['sale', 'bestseller', 'new', 'limited', ''],
        default: 'sale'
    },
    badgeText: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: [true, 'Product image URL is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    specs: [{
        type: String
    }],
    variants: [{
        type: String
    }],
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Text index for search performance
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
