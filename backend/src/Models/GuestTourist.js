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
    },
    mobileNumber: {
        type: String, // Use String to accommodate different formats
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
        immutable: true, // DOB cannot be changed
    },
    jobOrStudent: {
        type: String,
        enum: ['job', 'student'], // Limiting to specified values
        required: true,
    }
}, { timestamps: true });

// Age validation
touristSchema.pre('save', function(next) {
    const age = new Date().getFullYear() - this.dob.getFullYear();
    if (age < 18) {
        return next(new Error('You must be at least 18 years old to register.'));
    }
    next();
});

const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;
