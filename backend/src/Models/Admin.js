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
    },
    promoCodes: [
    {
        code: String,
        discount: Number,
        validFrom: Date,
        validUntil: Date,
        userId: Schema.Types.ObjectId,
    },
    ],
    globalPromoCodes: [
        {
            code: { type: String, required: true, unique: true },
            discount: { type: Number, required: true, min: 0, max: 100 },
            validFrom: { type: Date, required: true },
            validUntil: { type: Date, required: true },
            redeemedBy: [
                {
                    touristId: { type: Schema.Types.ObjectId, ref: 'Tourist' },
                    year: { type: Number },
                },
            ],
            status: {
                type: String,
                enum: ['active', 'inactive', 'expired'], // Ensure only these values are allowed
                default: 'active', // Default to active
            },
        },
    ],
});
const Admin = mongoose.model('Admin', adminSchema);
adminSchema.index({ 'globalPromoCodes.code': 1 }, { unique: true });

module.exports = Admin;