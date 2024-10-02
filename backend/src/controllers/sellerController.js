const sellerModel = require('../models/Seller'); // Ensure this path is correct

// Create a new Seller profile
const createSeller = async (req, res) => {
    const { username, email, password, name, description } = req.body;

    try {
        const seller = await sellerModel.create({
            username,
            email,
            password, // Remember to hash the password before saving in production
            name,
            description,
        });
        res.status(201).json({ message: 'Seller profile created successfully', seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Seller profiles
const getSellers = async (req, res) => {
    try {
        const sellers = await sellerModel.find({});
        res.status(200).json(sellers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a Seller profile
const updateSeller = async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters
    const updates = req.body;

    try {
        const seller = await sellerModel.findByIdAndUpdate(
            id, // Find by ID
            updates, // Update these fields
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        res.status(200).json({ message: 'Seller profile updated successfully', seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a Seller profile
const deleteSeller = async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters

    try {
        const seller = await sellerModel.findByIdAndDelete(id); // Find and delete by ID

        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        res.status(200).json({ message: 'Seller deleted successfully', seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createSeller, getSellers, updateSeller, deleteSeller };
