const tourGuideModel = require('../models/Tour Guide'); // Updated import to match the schema file name
const mongoose = require('mongoose');

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
    const { id } = req.params; // Extract ID from URL parameters
    const updates = req.body;

    try {
        const tourGuide = await tourGuideModel.findByIdAndUpdate(
            id, // Find by ID
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

module.exports = { createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide };
