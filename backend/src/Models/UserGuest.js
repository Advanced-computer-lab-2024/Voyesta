const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
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
    role: {
        type: String,
        enum: ['tourGuide', 'advertiser', 'seller'], // Specifying roles
        required: true,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
