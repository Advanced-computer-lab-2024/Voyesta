const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 300, // OTP will expire after 5 minutes
	},
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;