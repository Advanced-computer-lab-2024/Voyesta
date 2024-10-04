const mongoose = require('mongoose');
//const bycrypt = require('bcrypt'); // this hashs the password 
const { Schema } = mongoose;

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true, // Ensures no extra spaces are stored
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Ensure passwords are stored securely

    },
    otp: {
        type: String,
        required: false,
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;