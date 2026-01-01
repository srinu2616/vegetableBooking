const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const vegetableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a vegetable name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    shortDescription: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: 0
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Leafy', 'Root', 'Fruit', 'Squash', 'Fungi', 'Vegetable', 'Other']
    },
    images: {
        type: [String],
        required: [true, 'Please upload at least one image'],
        validate: {
            validator: function (v) {
                return v && v.length <= 4;
            },
            message: 'You can upload up to 4 images only'
        }
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0,
        min: 0
    },
    packSize: {
        type: Number,
        required: [true, 'Please add a pack size (quantity)'],
        default: 1,
        min: 0.01
    },
    unit: {
        type: String,
        required: [true, 'Please specify unit'],
        enum: ['kg', 'g', 'pieces'],
        default: 'kg'
    },
    rating: {
        type: Number,
        default: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    isOrganic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for search
vegetableSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Vegetable', vegetableSchema);
