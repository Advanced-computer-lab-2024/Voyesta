const advertiserModel = require('../Models/Advertiser'); // Ensure this path is correct
const {otpSender} = require('../services/generateOTPgenric');

const Activity = require('../Models/Activity');
const activityModel = require('../Models/Activity');
// Create a new Advertiser profile
const createAdvertiser = async (req, res) => {
    const { username, email, password, website, hotline, companyProfile, servicesOffered } = req.body;

    try {
        if (await advertiserModel.exists({ email })) {  // Check if an advertiser profile with the email already exists
            return res.status(400).json({ message: 'Advertiser already exists' });
        }
        const advertiser = await advertiserModel.create({
            username,
            email,
            password, // Remember to hash the password before saving in production
            website,
            hotline,
            companyProfile,
            servicesOffered,
        });
        res.status(201).json({ message: 'Advertiser profile created successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Advertiser profiles
const getAdvertisers = async (req, res) => {
    try {
        const advertisers = await advertiserModel.find({});
        res.status(200).json(advertisers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an Advertiser profile
const updateAdvertiser = async (req, res) => {
    const { username } = req.params; // Extract email from URL parameters
    const {email,password,website,hotline,companyProfile,servicesOffered}= req.body;
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (website) updates.website = website;
    if (hotline) updates.hotline = hotline;
    if (companyProfile) updates.companyProfile = companyProfile;
    if (servicesOffered) updates.servicesOffered = servicesOffer


    try {
        const advertiser = await adModel.findOneAndUpdate(
            { email }, // Find by email
            { $set: updates }, // Update these fields
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!advertiser) {
            return res.status(404).json({ error: 'Advertiser not found' });
        }

        res.status(200).json({ message: 'Advertiser profile updated successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an Advertiser profile
const deleteAdvertiser = async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters

    try {
        const advertiser = await advertiserModel.findByIdAndDelete(id); // Find and delete by ID

        if (!advertiser) {
            return res.status(404).json({ error: 'Advertiser not found' });
        }

        res.status(200).json({ message: 'Advertiser deleted successfully', advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Send OTP to email
const sendOTPadvertiser = async (req, res) => {
    const { email } = req.body;

    try {
        const response = await otpSender(advertiserModel, email);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Create a new Activity
const createActivity = async (req, res) => {
    // city and country are nested in location object
    // lat and lng are nested in coordinates object
    // as theres no frontend to send the google marker
    
    const { name, description,date,time, city, country,lat,lng,duration, price, specialDiscount, category, tags} = req.body;
    const  { id } = req.params;
    
    try {
        const activity = new Activity({
            name,
            description,
            date,
            time,
            location : {
                address,
                city,
                country,
                coordinates:{
                    lat,
                    lng
                }
            },
            price,
            duration,
            specialDiscount,
            category,
            tags,
            advertiser: id
        });

        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get an Activity
const getActivity = async (req, res) => {
    const { id } = req.params;
    const advertiserId = req.advertiser._id; // Assuming advertiser ID is stored in req.advertiser

    try {
        const activity = await Activity.findById(id).populate('category tags advertiser');
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        if (activity.advertiser.toString() !== advertiserId.toString()) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllActivitiesByAdvertiser = async (req, res) => {  
    const advertiserId = req.advertiser._id; // Assuming advertiser ID is stored in req.advertiser

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
    const advertiserId = req.advertiser._id; // Assuming advertiser ID is stored in req.advertiser

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
    const advertiserId = req.advertiser._id; // Assuming advertiser ID is stored in req.advertiser

    try {
        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        if (activity.advertiser.toString() !== advertiserId.toString()) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        await activity.remove();
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
            

// update password
// const updatePassword = async (req, res) => {
//     const { email } = req.params; // Extract email from URL parameters
//     const { oldPassword, newPassword } = req.body; // Extract new password from request body

//     try {
//         const advertiser = await advertiserModel.findOne({ email });
//         if (!advertiser) {
//             return res.status(404).json({ message: 'Advertiser not found' });
//         }

//         // Check if the old password matches the one in the database
//         if (oldPassword !== advertiser.password) {
//             return res.status(400).json({ message: 'Old password is incorrect' });
//         }

//         advertiser.password = newPassword; // Update the password
//         await advertiser.save(); // Save the updated advertiser profile
//         res.json({ message: 'Password updated successfully', advertiser });

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

module.exports = { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser, sendOTPadvertiser, getActivity, createActivity, deleteActivity, updateActivity, getAllActivitiesByAdvertiser, sortactivitestsByPrice, sortactivitestsByRatings, filterActivities }; // Export the functions