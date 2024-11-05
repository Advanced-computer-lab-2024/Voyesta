// models/purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;