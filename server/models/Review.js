const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'Verified Buyer'
    },
    avatar: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5
    },
    comment: {
        type: String,
        required: true
    },
    productId: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;
