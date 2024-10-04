const mongoose = require('mongoose');
const { Schema } = mongoose;

const advertSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true, // Ensures no extra spaces are stored
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate emails
        lowercase: true, // Store email in lowercase
        trim: true, // Ensures no extra spaces are stored
    },
    password: {
        type: String, // Ensure passwords are stored securely
        required: true,
        minlength: 6 // Ensure passwords are stored securely

    },
    website: {
        type: String,
        required: false,
        trim: true, // Optional website URL
    },
    hotline: {
        type: String, // String type for flexibility in formats
        required: false,
    },
    companyProfile: {
        type: String,
        required: false,
        trim: true, // Short description of the company
    },
    servicesOffered: {
        type: [String], // Array to list services the company offers
        required: false,
    },
    otp: {
        type: String,
        required: false,
    }
}, { timestamps: true });

const AdModel = mongoose.model('Advertiser', advertSchema);
module.exports = AdModel;
