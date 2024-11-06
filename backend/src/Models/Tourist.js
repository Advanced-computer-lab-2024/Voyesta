const mongoose = require('mongoose');
const { Schema } = mongoose;

const touristSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    Number: {
        type: String, // Use String to accommodate different formats
        required: false,
    },
    Nationality: {
        type: String,
        required: false,
    },
    DOB: {
        type: Date,
        required: false,
        immutable: true, // DOB cannot be changed
    },
    Job: {
        type: String,
        required: false,
    },
    Wallet: {
        type: Number,
        required: false,
        default: 0 // Default value of wallet is 0
    },
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    level: {
        type: Number,
        default: 1 // Default level is 1
    },
    accumulatedPoints: {
        type: Number,
        default: 0 // Default accumulated points is 0
    },
    currentPoints: {
        type: Number,
        default: 0 // Default current points is 0
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'deleted'],
        default: 'active'
    },
    preferences: [{ // Array of preference tags for req 10.
        type: Schema.Types.ObjectId,
        ref: 'PreferenceTag'
    }],
}, { timestamps: true });

// Age validation
touristSchema.pre('save', function(next) {
    if (this.DOB !== undefined) { // Check if DOB is defined
        const age = new Date().getFullYear() - this.DOB.getFullYear();
        if (age < 18) {
            return next(new Error('You must be at least 18 years old to register.'));
        }
    }
    next();
});

const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;
