const Itinerary = require('../Models/Itinerary');
const Activity = require('../Models/Activity');
const Category = require('../Models/ActivityCategory');
const PreferenceTag = require('../Models/PreferenceTag');

const createItinerary = async (req, res) => {
    const { name, tourLanguage, tourPrice, availableDates, activityNames, durations,  accessibility, pickUpLocation, dropOffLocation } = req.body;
    const id = req.user.id;
    try {
        // Fetch activities based on activity names
        const activities = await Activity.find({ name: { $in: activityNames } });

        // Extract activity IDs, tags, locations, and timeline
        const activityIds = activities.map(activity => activity._id);
        const tags = [...new Set(activities.flatMap(activity => activity.tags))]; // Unique tags
        const locations = activities.map(activity => activity.location);
        const timeline = activities.map(activity => activity.time);

        const itinerary = new Itinerary({
            name,
            tags,
            tourLanguage,
            tourPrice,
            availableDates,
            activities: activityIds,
            locations,
            timeline,
            durations,
            accessibility,
            pickUpLocation,
            dropOffLocation,
            createdBy: id
        });
        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getItinerary = async (req, res) => {
    // const { id } = req.params;

    try {
        const itinerary = await Itinerary.find().populate('activities tags');
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
    const guideId = req.user.id; // Assuming req.user contains the authenticated user's info
    
    try {
        const itineraries = await Itinerary.find({ createdBy: guideId }).populate('activities tags');
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

// update an Itinerary
const updateItinerary = async (req, res) => {
    const { id } = req.params;
    const guideId = req.user.id;
    const updates = req.body;

    try {
        const itinerary = await Itinerary.findOne({ _id: id, createdBy: guideId });
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found or you do not have access' });
        }

        // Fetch new activity IDs and tags based on activity names
        if (updates.activities) {
            const activities = await Activity.find({ name: { $in: updates.activities } });
            updates.activities = activities.map(activity => activity._id);
            updates.tags = [...new Set(activities.flatMap(activity => activity.tags))]; // Unique tags
        }

        // Directly apply updates
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
    const guideId = req.user.id;
    try {
        const itinerary = await Itinerary.findOneAndDelete({ _id: id , createdBy: guideId });
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found or you do not have access' });
        }
        res.status(200).json({ message: 'Itinerary deleted successfully', itinerary });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


};

const sortByPrice = async (req, res) => {
    try {
        
        const itinerary = await Itinerary.find().sort({ price: 1 });

        if (itinerary.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No activity found'
            });
        }

        
        res.status(200).json({
            success: true,
            data: itinerary
        });
    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: 'Error sorting activity by price',
            error: error.message
        });
}}

const search = async (req, res) => {
    const query = String(req.query.query); // Changed to match the 'query' parameter from frontend
    console.log('Search query:', query);
  
    try {
      const itineraries = await Itinerary.find({
           name: { $regex: query, $options: 'i' } 
      }).populate('tags'); // Ensure you're populating related tags if necessary
  
      res.status(200).json(itineraries);
    } catch (error) {
      console.error('Error in search controller:', error);
      res.status(400).json({ error: error.message });
    }
  };
  


const filter = async (req, res) => {
    const { minPrice, maxPrice, startDate, endDate, preferences, languages } = req.query;

    const query = {};

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        query.tourPrice = {};
        if (minPrice !== undefined) query.tourPrice.$gte = Number(minPrice);
        if (maxPrice !== undefined) query.tourPrice.$lte = Number(maxPrice);
    }

    // Date filter
    if (startDate !== undefined || endDate !== undefined) {
        if (startDate !== undefined) {
            query.startDate = { $gte: new Date(startDate) }; // Initialize with $gte if startDate is provided
        }
        if (endDate !== undefined) {
            query.endDate = { $lte: new Date(endDate) }; // Initialize with $lte if endDate is provided
        }
    }

    if (preferences !== undefined) {
        try {
            const preferenceNames = preferences.split(','); // Split by comma if multiple names are provided
            const preferenceTags = await PreferenceTag.find({
                Name: { $in: preferenceNames.map(name => new RegExp(name, 'i')) } // Partial match with regex
            });
            console.log(preferenceNames)
            console.log(preferenceTags)
            const preferenceIds = preferenceTags.map(tag => tag._id); // Get the IDs of the fetched preference tags
            query.tags = { $in: preferenceIds }; // Filter itineraries by these preference IDs
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching preference tags', error });
        }
    }

    // Language filter
    if (languages !== undefined) {
        const langArray = languages.split(',');
        query.tourLanguage = { $in: langArray };
    }

    try {
        const itineraries = await Itinerary.find(query).populate('tags').populate('activities');
        res.status(200).json(itineraries);
    } catch (error) {
        console.error("Error retrieving itineraries:", error);
        res.status(500).json({ message: 'Error retrieving itineraries', error });
    }
};

module.exports = {
    createItinerary,
    getItinerary,
    getAllItinerariesByGuide,
    updateItinerary,
    deleteItinerary,
    sortByPrice,
    search,
    filter
};