const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: String, default: null },
    image: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customer: {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true }
    },
    items: [orderItemSchema],
    pricing: {
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        promoCode: { type: String, default: null },
        tax: { type: Number, required: true },
        shipping: { type: Number, default: 0 },
        total: { type: Number, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'paypal', 'apple', 'cod'],
        default: 'card'
    },
    status: {
        type: String,
        enum: ['confirmed', 'processing', 'shipped', 'delivered'],
        default: 'confirmed'
    }
}, {
    timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
