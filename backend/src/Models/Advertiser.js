const mongoose = require('mongoose');
const { Schema } = mongoose;

const advertSchema = new Schema({
    Username: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true, // Optional: Prevent duplicate emails
    },
    Password: {
        type: String, // Changed from Number to String
        required: true,
    },
}, { timestamps: true });

const adModel = mongoose.model('Advertiser', advertSchema);
module.exports = adModel;
