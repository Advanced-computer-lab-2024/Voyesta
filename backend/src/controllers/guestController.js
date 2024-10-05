const mongoose = require('mongoose');
const Activity = require('../Models/Activity');

const Itinerary = require('../Models/itinerarySchema'); // Adjust path as needed
const MuseumsAndHistoricalPlaces = require('../Models/MusemsAndHistoricalPlaces');

const filterTouristActivities = async (req, res) => {
    const { minPrice, maxPrice, date, category, rating } = req.query;

    const query = {};

    // Price filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Date filter
    if (date) {
        const activityDate = new Date(date);
        query.date = {
            $gte: new Date(activityDate.setHours(0, 0, 0, 0)),
            $lt: new Date(activityDate.setHours(23, 59, 59, 999))
        };
    }

    // Category filter
    if (category) {
        query.category = mongoose.Types.ObjectId(category);
    }

    // Rating filter
    if (rating) {
        const parsedRating = Number(rating);
        if (parsedRating >= 1 && parsedRating <= 5) {
            query.rating = { $gte: parsedRating }; // Filter for rating greater than or equal to the specified value
        } else {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
    }

    try {
        const activities = await Activity.find(query).populate('category'); // Adjust population as needed
        res.status(200).json(activities);
    } catch (error) {
        console.error("Error retrieving activities:", error);
        res.status(500).json({ message: 'Error retrieving activities', error });
    }
};

const getTouristView = async (req, res) => {
    try {
        const currentDate = new Date();

        // Fetch upcoming activities
        const upcomingActivities = await Activity.find({ date: { $gte: currentDate } });

        // Fetch itineraries (you might want to filter by available dates as well)
        const upcomingItineraries = await Itinerary.find({
            availableDatesAndTimes: { $elemMatch: { $gte: currentDate.toISOString() } }
        });

        // Fetch museums and historical places
        const museums = await MuseumsAndHistoricalPlaces.find();

        // Combine results into a structured format
        const result = {
            upcomingActivities,
            upcomingItineraries,
            museums
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving tourist information:", error);
        res.status(500).json({ message: 'Error retrieving information', error: error.message });
    }
};

module.exports = {filterTouristActivities,getTouristView };




