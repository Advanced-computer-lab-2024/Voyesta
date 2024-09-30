const adModel = require('../models/Advertiser'); // Ensure this path is correct
const {otpSender} = require('../services/generateOTPgenric');
// Create a new Advertiser profile
const createAdvertiser = async (req, res) => {
    const { username, email, password, website, hotline, companyProfile, servicesOffered } = req.body;

    try {
        if (await adModel.exists({ email })) {  // Check if an advertiser profile with the email already exists
            return res.status(400).json({ message: 'Advertiser already exists' });
        }
        const advertiser = await adModel.create({
            username,
            email,
            password, // Remember to hash the password before saving in production
            website,
            hotline,
            companyProfile,
            servicesOffered,
        });
        res.status(201).json({ message: 'Advertiser profile created successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Advertiser profiles
const getAdvertisers = async (req, res) => {
    try {
        const advertisers = await adModel.find({});
        res.status(200).json(advertisers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an Advertiser profile
const updateAdvertiser = async (req, res) => {
    const { email } = req.params; // Extract email from URL parameters
    const updates = req.body;

    try {
        const advertiser = await adModel.findOneAndUpdate(
            { email }, // Find by email
            updates, // Update these fields
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!advertiser) {
            return res.status(404).json({ error: 'Advertiser not found' });
        }

        res.status(200).json({ message: 'Advertiser profile updated successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an Advertiser profile
const deleteAdvertiser = async (req, res) => {
    const { email } = req.params; // Extract email from URL parameters

    try {
        const advertiser = await adModel.findOneAndDelete({ email });

        if (!advertiser) {
            return res.status(404).json({ error: 'Advertiser not found' });
        }

        res.status(200).json({ message: 'Advertiser deleted successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Send OTP to email

const sendOTPadvertiser = async (req, res) => {
    const { email } = req.body;

    try {
        const response = await otpSender(adModel, email);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// update password
// const updatePassword = async (req, res) => {
//     const { email } = req.params; // Extract email from URL parameters
//     const { oldPassword, newPassword } = req.body; // Extract new password from request body

//     try {
//         const advertiser = await adModel.findOne({ email });
//         if (!advertiser) {
//             return res.status(404).json({ message: 'Advertiser not found' });
//         }

//         // Check if the old password matches the one in the database
//         if (oldPassword !== advertiser.password) {
//             return res.status(400).json({ message: 'Old password is incorrect' });
//         }

//         advertiser.password = newPassword; // Update the password
//         await advertiser.save(); // Save the updated advertiser profile
//         res.json({ message: 'Password updated successfully', advertiser });

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

module.exports = { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser, sendOTPadvertiser }; // Export the functions
