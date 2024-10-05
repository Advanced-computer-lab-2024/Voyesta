const advertiserModel = require('../Models/Advertiser'); // Ensure this path is correct
// const {otpSender} = require('../services/generateOTPgenric');

const activityModel = require('../Models/Activity');
// Create a new Advertiser profile

const createAdvertiser = async (req, res) => {
    const { username, email, password, website, hotline, companyProfile, servicesOffered } = req.body;

    try {
        if (await advertiserModel.exists({ email })) {  // Check if an advertiser profile with the email already exists
            return res.status(400).json({ message: 'Advertiser already exists' });
        }
        const advertiser = await advertiserModel.create({
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
        const advertisers = await advertiserModel.find({});
        res.status(200).json(advertisers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an Advertiser profile
const updateAdvertiser = async (req, res) => {
    // const { id } = req.params; // Extract id from URL parameters
    const id = req.headers['id'];
    const { email, password, website, hotline, companyProfile, servicesOffered } = req.body;
    
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (website) updates.website = website;
    if (hotline) updates.hotline = hotline;
    if (companyProfile) updates.companyProfile = companyProfile;
    if (servicesOffered) updates.servicesOffered = servicesOffered; // Fixed typo from "servicesOffer"

    try {
        

        const advertiser = await advertiserModel.findOneAndUpdate(
            {_id: id}, // Correctly pass the id directly
            { $set: updates }, // Update these fields
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
    const id  = req.headers['id']; // Extract ID from URL parameters

    try {
        const advertiser = await advertiserModel.findOneAndDelete({_id: id}); // Find and delete by ID

        if (!advertiser) {
            return res.status(404).json({ error: 'Advertiser not found' });
        }

        res.status(200).json({ message: 'Advertiser deleted successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Send OTP to email
// const sendOTPadvertiser = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const response = await otpSender(advertiserModel, email);
//         res.json(response);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }


            

// update password
// const updatePassword = async (req, res) => {
//     const { email } = req.params; // Extract email from URL parameters
//     const { oldPassword, newPassword } = req.body; // Extract new password from request body

//     try {
//         const advertiser = await advertiserModel.findOne({ email });
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

module.exports = { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser }; // Export the functions