const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    tourist: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },
    bookable: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'bookableModel'
    },
    bookableModel: {
        type: String,
        required: true,
        enum: ['Itinerary', 'Activity']
    },
    eventDate: {
        type: Date,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true // Add this field to store the amount paid
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;