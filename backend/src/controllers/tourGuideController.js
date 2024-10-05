const tourGuideModel = require('../Models/Tour Guide'); // Updated import to match the schema file name
const mongoose = require('mongoose');
const {otpSender} = require('../services/generateOTPgenric');


const Itinerary = require('../Models/itinerarySchema');
 const itineraryModel = require('../Models/Itinerary');
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
    const {  mobileNumber,
        yearsOfExperience,
        previousWork,} = req.body;

        const updates = {};
        if (mobileNumber)  updates.mobileNumber = mobileNumber;
        if (yearsOfExperience) updates.yearsOfExperience = yearsOfExperience;
        if (previousWork) updates.previousWork = previousWork;

    try {
        const tourGuide = await tourGuideModel.findOneAndUpdate(
            { email}, // Find by email
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


// Delete a Tour Guide profile
const deleteTourGuide = async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters

    try {
        const tourGuide = await tourGuideModel.findByIdAndDelete(id); // Find and delete by ID

        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
        }

        res.status(200).json({ message: 'Tour guide deleted successfully', tourGuide });
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


const createItinerary = async (req, res) => {
    const { itineraryName,description, tags, tourLanguage, tourPrice, availableDatesAndTimes, activities, accessibility, pickUpLocation, dropOffLocation } = req.body;
    const  { id } = req.params; 
    try {
        const itinerary = new Itinerary({
            itineraryName,
            createdBy : id,
            description,
            tags,
            tourLanguage,
            tourPrice,
            availableDatesAndTimes,
            activities,
            accessibility,
            pickUpLocation,
            dropOffLocation
        });

        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getItinerary = async (req, res) => {
    const { id } = req.params;
    const guideId = req.user._id; // Assuming req.user contains the authenticated user's info

    try {
        const itinerary = await Itinerary.findOne({ _id: id, createdBy: guideId }).populate('activities tags');
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found or you do not have access' });
        }
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

// Get all Itineraries created by a Tour Guide
const getAllItinerariesByGuide = async (req, res) => {
    const guideId = req.user._id; // Assuming req.user contains the authenticated user's info

    try {
        const itineraries = await Itinerary.find({ createdBy: guideId });
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

// update an Itinerary
const updateItinerary = async (req, res) => {
    const { id } = req.params;
    const guideId = req.user._id; // Assuming req.user contains the authenticated user's info
    const updates= req.body;

    try {
        const itinerary = await Itinerary.findOne({ _id: id, createdBy: guideId });
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found or you do not have access' });
        }

        Object.assign(itinerary, updates);
        await itinerary.save();
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


};

// Delete an Itinerary
const deleteItinerary = async (req, res) => {
    const { id } = req.params;
    const guideId = req.createdBy._id; // Assuming req.user contains the authenticated user's info

    try {
        const itinerary = await Itinerary.findOneAndDelete({ _id: id, createdBy: guideId });
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found or you do not have access' });
        }
        res.status(200).json({ message: 'Itinerary deleted successfully', itinerary });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


};


module.exports = { createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide , sendOTPtourGuide,  createItinerary, getItinerary,getAllItinerariesByGuide,updateItinerary,deleteItinerary}; // Export the controller functions
