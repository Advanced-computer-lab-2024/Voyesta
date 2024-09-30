const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Assuming the picture is a URL
    },
    picture: {
        type: String,
        required: false // Assuming the picture is a URL
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    ratings: [
        {
            user: String,
            rating: { type: Number, min: 0, max: 5 }
        }
    ],
    reviews: [
        {
            user: String,
            comment: String,
            rating: { type: Number, min: 0, max: 5 }
        }
    ],
    available_quantity: {
        type: String,
        required: true // Assuming the picture is a URL
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
