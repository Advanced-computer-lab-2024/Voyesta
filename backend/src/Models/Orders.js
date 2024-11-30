const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    details: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'completed', 'cancelled'],
        default: 'confirmed'
    },
    date: {
        type: Date,
        default: Date.now
    },
    tourist: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist'
    },
    paymentMethod : {
        type: String,
        enum: ['card', 'wallet', 'cod'],
        required: true
    }
});



const Order = mongoose.model('Orders', OrderSchema);
module.exports = Order;