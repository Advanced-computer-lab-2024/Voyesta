const Activity = require('../Models/Activity');
const Category = require('../Models/ActivityCategory');
const Tag = require('../Models/PreferenceTag');
const mongoose = require('mongoose');
const sendGrid = require('@sendgrid/mail');
const { sendNotification, notifyUsersForBookingEnabled } = require('./NotificationController');

sendGrid.setApiKey('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');

const flagActivityAsInappropriate = async (req, res) => {
    const { id } = req.params;
    const userType = req.user.type;

    if (userType !== 'admin') {
        return res.status(403).json({ error: 'Only admins can flag activities as inappropriate' });
    }

    try {
        const activity = await Activity.findById(id).populate('advertiser');
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        activity.inappropriate = true;
        await activity.save();

        res.status(200).json({ message: 'Activity flagged as inappropriate and notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new Activity
const createActivity = async (req, res) => {
    const { name, description, date, time, location, price, specialDiscount, category, tags, imageUrl } = req.body;
    const advertiser = req.user.id;  // Assuming req.user is populated by authentication middleware
    const categoryID = await Category.findOne({ Name: category }).select('_id');
    const tagIds = await Promise.all(tags.map(async (tag) => {
        const tagId = await Tag.findOne({ Name: tag }).select('_id');
        return tagId;
    }));
    try {
        const activity = new Activity({
            name,
            description,
            date,
            time,
            location: {
                lat: location.lat,
                lng: location.lng
            },
            price,
            specialDiscount,
            category: categoryID,
            tags: tagIds,
            advertiser,
            imageUrl // Add this line
        });
        // console.log(activity);
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get an Activity
const getActivity = async (req, res) => {
        
    try {
        const activity = await Activity.find().populate('category tags advertiser');
        
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
      .populate('category', 'Name')
      .populate('tags', 'Name')
      .populate('advertiser', 'username')
      .populate('ratings.tourist', 'username')
      .populate('comments.tourist', 'username');
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
  const advertiserId = req.user.id; // Assuming req.user is populated by authentication middleware
  const { name, description, date, time, location, price, specialDiscount, category, tags, imageUrl } = req.body;

  const categoryId = await Category.findOne({ Name: category }).select('_id');
  const tagIds = await Promise.all(tags.map(async (tag) => {
    const tagId = await Tag.findOne({ Name: tag }).select('_id');
    return tagId;
  }));

  const updates = { name, description, date, time, location, price, specialDiscount, category: categoryId, tags: tagIds, imageUrl }; // Add imageUrl here

  try {
    const activity = await Activity.findByIdAndUpdate(id, updates, { new: true, upsert: false, overwrite: true });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
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

// Add a comment to an activity
const addComment = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const touristId = req.user.id;

    try {
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const existingComment = activity.comments.find(c => c.tourist.toString() === touristId);
        if (existingComment) {
            return res.status(400).json({ error: 'You have already commented on this activity' });
        }

        activity.comments.push({ tourist: touristId, comment });
        await activity.save();
        res.status(200).json({ message: 'Comment added successfully', activity });
    } catch (error) {
        res.status(400).json({ error: error.message });
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

// Add a rating to an activity
const addRating = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const touristId = req.user.id;

    try {
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const existingRating = activity.ratings.find(r => r.tourist.toString() === touristId);
        if (existingRating) {
            return res.status(400).json({ error: 'You have already rated this activity' });
        }

        activity.ratings.push({ tourist: touristId, rating });
        await activity.save();
        
        res.status(200).json({ message: 'Rating added successfully', activity });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Check if a tourist has already rated or commented on an activity
const checkActivityRatingAndComment = async (req, res) => {
    const { id } = req.params;
    const touristId = req.user.id;

    try {
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const hasRated = activity.ratings.some(r => r.tourist.toString() === touristId);
        const hasCommented = activity.comments.some(c => c.tourist.toString() === touristId);

        res.status(200).json({ hasRated, hasCommented });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get activities in the Transportation category for tourists
const getTransportationActivities = async (req, res) => {
    if (req.user.type !== 'tourist') {
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    try {
        const transportationCategory = await Category.findOne({ Name: 'Transportation' });
        if (!transportationCategory) {
            return res.status(404).json({ error: 'Transportation category not found' });
        }

        const activities = await Activity.find({ category: transportationCategory._id }).populate('category tags advertiser');
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBookingEnabledStatus = async (req, res) => {
    const { id } = req.params;
    const { bookingEnabled } = req.body;
  
    try {
      const activity = await Activity.findById(id);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      if (!activity.bookingEnabled) {
        activity.bookingEnabled = false;
      }
  
      activity.bookingEnabled = bookingEnabled;
      await activity.save();
  
      if (bookingEnabled) {
        await notifyUsersForBookingEnabled(id, 'activity');
      }
  
      res.status(200).json(activity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const getBookingStatus = async (req, res) => {
    const { id } = req.params;
  
    try {
      const activity = await Activity.findById(id);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
  
      res.status(200).json({ bookingEnabled: activity.bookingEnabled });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
module.exports = { createActivity,getActivityById, getActivity, getAllActivitiesByAdvertiser, updateActivity, addRating, addComment, deleteActivity, sortactivitestsByPrice, sortactivitestsByRatings, filterActivities, filterTouristActivities, search, checkActivityRatingAndComment, getTransportationActivities, flagActivityAsInappropriate, updateBookingEnabledStatus, getBookingStatus };