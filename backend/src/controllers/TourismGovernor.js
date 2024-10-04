// const tourismGovernorModel = require('../models/tourismGovernorModel');
// const ItineraryModel = require('../Models/Itinerary');
const museumsAndHistoricalPlacesModel = require('../Models/MusuemAndPlaces');
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
    // const { governor } = req.createdBy;
    try {
        const placeOfInterest = await museumsAndHistoricalPlacesModel.findOne({ createdBy: id });
        if (!placeOfInterest) {
            return res.status(404).json({ error: 'Place of interest not found or you do not have access' });
        }
        res.status(200).json(placeOfInterest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};


// update a place of interest by this governor
const updatePlaceOfInterest = async (req, res) => {
    const { id } = req.params;
    const { governor } = req.createdBy._id;
    const { name, description, pictures, location, openingHours, ticketPrices } = req.body;
    try {
        const placeOfInterest = await museumsAndHistoricalPlacesModel.findOneAndUpdate({ _id: id, createdBy: governor }, {
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices
        }, { new: true });
        if (!placeOfInterest) {
            return res.status(404).json({ error: 'Place of interest not found or you do not have access' });
        }
        res.status(200).json({ message: 'Place of interest updated successfully', placeOfInterest });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// delete a place of interest by this governor
const deletePlaceOfInterest = async (req, res) => {
    const { id } = req.params;
    const { governor } = req.createdBy._id;
    try {
        const placeOfInterest = await museumsAndHistoricalPlacesModel.findOneAndDelete({ _id: id, createdBy: governor });
        if (!placeOfInterest) {
            return res.status(404).json({ error: 'Place of interest not found or you do not have access' });
        }
        res.status(200).json({ message: 'Place of interest deleted successfully', placeOfInterest });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const createTagsForPlaceOfInterest = async (req, res) => {
    const { id } = req.params;
    const { tags } = req.body;
    try {
        const placeOfInterest = await museumsAndHistoricalPlacesModel.findOneAndUpdate({ _id: id }, { $set :{tags} }, { new: true });
        res.status(200).json({ message: 'Tags added successfully', placeOfInterest });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
    
}



module.exports = { createPlaceOfInterest, getAllPlacesOfInterest, getPlaceOfInterest, updatePlaceOfInterest, deletePlaceOfInterest , createTagsForPlaceOfInterest};