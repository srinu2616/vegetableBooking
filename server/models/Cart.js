const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        vegetable: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vegetable',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: { // Store price at time of adding to cart to handle price changes logic if needed, or just for display
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware to calculate total price before saving
cartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
