const tourismGovernorModel = require('../models/tourismGovernorModel');
const museumsAndHistoricalPlacesModel = require('../models/museumsAndHistoricalPlaces');

// create a place of interest
const createPlaceOfInterest = async (req, res) => {
    const { name, description, pictures, location, openingHours, ticketPrices,createdBy } = req.body;
    const  { id } = req.params; 
    try {
        const placeOfInterest = await museumsAndHistoricalPlacesModel.create({
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices,
            createdBy: id
        });
        res.status(201).json({ message: 'Place of interest created successfully', placeOfInterest });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get all places of interest by this governor

const getAllPlacesOfInterest = async (req, res) => {
    const { id } = req.params;
    try {
        const placesOfInterest = await museumsAndHistoricalPlacesModel.find({ createdBy: id });
        res.status(200).json(placesOfInterest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

// get a place of interest by this governor

const getPlaceOfInterest = async (req, res) => {
    const { id } = req.params;
    const { governor } = req.createdBy._id;
    try {
        const placeOfInterest = await museumsAndHistoricalPlacesModel.findOne({ _id: id, createdBy: governor });
        if (!placeOfInterest) {
            return res.status(404).json({ error: 'Place of interest not found or you do not have access' });
        }
        res.status(200).json(placeOfInterest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};


// update a place of interest by this governor



