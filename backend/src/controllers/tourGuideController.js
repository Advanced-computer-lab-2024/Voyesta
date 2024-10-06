const tourGuideModel = require('../Models/Tour Guide'); // Updated import to match the schema file name
const { generateToken } = require('../utils/jwt'); // Import the generateToken function from the auth file

// Create a new Tour Guide profile
const createTourGuide = async (req, res) => {
    const { username, email, password, mobileNumber, yearsOfExperience, previousWork } = req.body;
    try {
        const tourGuide = await tourGuideModel.create({
            username,
            email,
            password, // Ideally, this should be hashed before saving
            mobileNumber,
            yearsOfExperience,
            previousWork,
        });

        const token = generateToken(tourGuide._id, 'tourGuide');
        res.status(201).json({ message: 'Profile created successfully', token ,tourGuide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Tour Guides profiles
const getTourGuides = async (req, res) => {
    try {
        const tourGuides = await tourGuideModel.find({});
        res.status(200).json(tourGuides);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a Tour Guide profile
const updateTourGuide = async (req, res) => {
    const { id } = req.user.id; // Extract email from URL parameters
    const {  mobileNumber,
        yearsOfExperience,
        previousWork,} = req.body;

        const updates = {};
        if (mobileNumber)  updates.mobileNumber = mobileNumber;
        if (yearsOfExperience) updates.yearsOfExperience = yearsOfExperience;
        if (previousWork) updates.previousWork = previousWork;

    try {
        const tourGuide = await tourGuideModel.findOneAndUpdate(
            { _id: id}, // Find by email
            {$set:updates }, // Update these fields
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', tourGuide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Send OTP to email
// const sendOTPtourGuide = async (req, res) => {
//     const { email } = req.body;
//     try {
//         const otp = otpSender(email);
//         res.status(200).json({ message: 'OTP sent successfully', otp });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


module.exports = { createTourGuide, getTourGuides, updateTourGuide  }; // Export the controller functions
