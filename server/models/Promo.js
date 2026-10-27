const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['percent', 'fixed', 'shipping']
    },
    value: {
        type: Number,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    minOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Promo = mongoose.models.Promo || mongoose.model('Promo', promoSchema);

module.exports = Promo;
