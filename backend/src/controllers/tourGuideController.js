const tourGuideModel = require('../Models/Tour Guide'); // Updated import to match the schema file name
const mongoose = require('mongoose');
const {otpSender} = require('../services/generateOTPgenric');
 const itineraryModel = require('../Models/Itinerary');
// Create a new Tour Guide profile
const createTourGuide = async (req, res) => {
    const { username, email, password, mobileNumber, yearsOfExperience, previousWork, bio, languagesSpoken } = req.body;
    try {
        const tourGuide = await tourGuideModel.create({
            username,
            email,
            password, // Ideally, this should be hashed before saving
            mobileNumber,
            yearsOfExperience,
            previousWork,
            bio,
            languagesSpoken,
        });
        res.status(201).json({ message: 'Profile created successfully', tourGuide });
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
    const { email } = req.params; // Extract email from URL parameters
    const updates = req.body;

    try {
        const tourGuide = await tourGuideModel.findOneAndUpdate(
            { email }, // Find by email
            updates, // Update these fields
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

// Delete a Tour Guide profile
const deleteTourGuide = async (req, res) => {
    const { email } = req.params; // Extract email from URL parameters

    try {
        const tourGuide = await tourGuideModel.findOneAndDelete({ email });

        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
        }

        res.status(200).json({ message: 'Tour guide deleted successfully', tourGuide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Send OTP to email
const sendOTPtourGuide = async (req, res) => {
    const { email } = req.body;
    try {
        const otp = otpSender(email);
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// const getItneraryandadtourguide = async(req,res) =>{
//     const ItineraryId = req.params._id
//     try {
//         const Itinerary = await Itinerary.find({ItineraryId: ItineraryId});
//         res.status(200).json({
//           itineraries
//         });
//       } catch (error) {
//         res.status(500).json({ error: 'Server error while fetching items' });
//       }

      
// }
module.exports = { createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide , sendOTPtourGuide}; // Export the controller functions
