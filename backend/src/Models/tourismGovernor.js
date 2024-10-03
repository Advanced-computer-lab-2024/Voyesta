const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourismGovernorSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Removes extra spaces
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length of 6 characters
    },
}, { timestamps: true });

const TourismGovernor = mongoose.model('TourismGovernor', tourismGovernorSchema);
module.exports = TourismGovernor;
