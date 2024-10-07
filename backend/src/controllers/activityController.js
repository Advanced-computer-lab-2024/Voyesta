const Activity = require('../Models/Activity');
const Category = require('../Models/ActivityCategory');

const mongoose = require('mongoose');
// Create a new Activity
const createActivity = async (req, res) => {
    const { name, description, date, time, location, price, specialDiscount, category, tags } = req.body;
    const advertiser = req.user.id;  // Assuming req.user is populated by authentication middleware

    try {
        const activity = new Activity({
            name,
            description,
            date,
            time,
            location: {
                address: location.address,
                city: location.city,
                country: location.country,
                coordinates: {
                    lat: location.lat,
                    lng: location.lng
                }
            },
            price,
            specialDiscount,
            category,
            tags,
            advertiser
        });

        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get an Activity
const getActivity = async (req, res) => {
    let id = req.params; // hard coded for now, will be replaced with req.user._id  after authentication
        
    try {
        const activity = await Activity.findById(id).populate('category tags advertiser');
        
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllActivitiesByAdvertiser = async (req, res) => { 
    console.log(req.user); 
    const advertiserId = req.user.id; // hard coded for now, will be replaced with req.user._id  after authentication

    try {
        const activities = await Activity.find({ advertiser: advertiserId }).populate('category tags advertiser');
        res.status(200).json(activities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


// update an Activity
const updateActivity = async (req, res) => {
    const { id } = req.params;
    const advertiserId =  req.user.id; // hard coded for now, will be replaced with req.user._id  after authentication

    const updates = req.body;

    try {
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        if (activity.advertiser.toString() !== advertiserId.toString()) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        Object.assign(activity, updates);
        await activity.save();
        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// delete an Activity
const deleteActivity = async (req, res) => {
    const { id } = req.params;
    const advertiserId = req.user.id; // hard coded for now, will be replaced with req.user._id  after authentication

    try {
        const activity = await Activity.findByIdAndDelete(id);

        if (activity.advertiser.toString() !== advertiserId.toString()) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const sortactivitestsByPrice = async (req, res) => {
    try {
        
        const activities = await Activity.find().sort({ price: 1 });

        if (activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No activity found'
            });
        }

        
        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: 'Error sorting activity by price',
            error: error.message
        });
}}


const sortactivitestsByRatings = async (req, res) => {
    try {
        
        const activities = await Activity.find().sort({ ratings: 1 });

        if (activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No activity found'
            });
        }

        
        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: 'Error sorting activity by ratings',
            error: error.message
        });
}}
                
const filterActivities = async (req, res) => {
    const { minPrice, maxPrice, date, preferences, language } = req.body; // assuming these are passed in the request body

    const filter = {};

    // Filter by price (budget)
    if (minPrice !== undefined && maxPrice !== undefined) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== undefined) {
        filter.price = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
        filter.price = { $lte: maxPrice };
    }

    // Filter by upcoming date
    if (date) {
        filter.date = { $gte: new Date(date) }; // upcoming from the specified date
    } else {
        filter.date = { $gte: new Date() }; // default to today for upcoming activities
    }

    // Filter by preferences (tags)
    if (preferences && preferences.length > 0) {
        filter.tags = { $in: preferences }; // assuming preferences are an array of tag IDs
    }

    // Filter by language
    if (language) {
        filter.language = language; // assuming a 'language' field exists in the schema
    }

    try {
        const activities = await Activity.find(filter).populate('category tags advertiser');

        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found matching the criteria' });
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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
        query.category = new mongoose.Types.ObjectId(category);
    }
    console.log(query.category);
    
    // Rating filter
    if (rating) {
        const parsedRating = Number(rating);
        if (parsedRating >= 0 && parsedRating <= 5) {
            query.rating = { $gte: parsedRating }; // Filter for rating greater than or equal to the specified value
        } else {
            return res.status(400).json({ message: 'Rating must be between 0 and 5' });
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



const search = async (req, res) => {
    const { query } = req.query;
    console.log(query);

    try {
        // Step 1: Find the category by name
        const category = await Category.findOne({ name: { $regex: query, $options: 'i' } });
        
        // Prepare an array to hold search conditions
        const searchConditions = [
            { name: { $regex: query, $options: 'i' } }, // Search by name using regex
            { tags: { $regex: query, $options: 'i' } }  // Search by tags using regex
        ];

        // Step 2: If category is found, add its ID to the search conditions
        if (category) {
            searchConditions.push({ category: category._id });
        }

        // Execute the activity search with the constructed conditions
        const activities = await Activity.find({ $or: searchConditions });

        res.status(200).json(activities);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(400).json({ error: error.message });
    }
};



module.exports = { getActivity, createActivity, deleteActivity, updateActivity, getAllActivitiesByAdvertiser, sortactivitestsByPrice, sortactivitestsByRatings, filterActivities, filterTouristActivities, search }