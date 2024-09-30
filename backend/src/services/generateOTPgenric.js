const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file
const otpModel = require('../Models/otp');

// Function to generate OTP
const generateOTP = () => {
	return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Function to send email
const sendEmail = async (email, otp) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail', // Use your email service
		auth: {
			user: process.env.EMAIL_USER, // Use environment variable for email
			pass: process.env.EMAIL_PASS, // Use environment variable for password
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER, // Use environment variable for email
		to: email,
		subject: 'Password Reset OTP',
		text: `Your OTP for password reset is: ${otp}`,
	};

	await transporter.sendMail(mailOptions);
};

// Generic Forgot Password Utility Function
const otpSender = async (model, email) => {
	const user = await model.findOne({ email });
	if (!user) {
		throw new Error('User not found');
	}

	const otp = generateOTP();
    // save the OTP to the OTP collection for later deletion.
    await otpModel.findOneAndUpdate(
        { email },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
    );

	// Save the OTP to the user's record
	user.otp = otp;
	await user.save();

	await sendEmail(email, otp);

	return { message: 'OTP sent to email' };
};

module.exports = {
	otpSender,
};