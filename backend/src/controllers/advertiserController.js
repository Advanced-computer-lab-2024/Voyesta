const adModel = require('../Models/Advertiser'); // Ensure this path is correct
const {otpSender} = require('../services/generateOTPgenric');
const Activity = require('../Models/Activity');
// Create a new Advertiser profile
const createAdvertiser = async (req, res) => {
    const { username, email, password, website, hotline, companyProfile, servicesOffered } = req.body;

    try {
        if (await adModel.exists({ email })) {  // Check if an advertiser profile with the email already exists
            return res.status(400).json({ message: 'Advertiser already exists' });
        }
        const advertiser = await adModel.create({
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
        const advertisers = await adModel.find({});
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
    const { email } = req.params; // Extract email from URL parameters

    try {
        const advertiser = await adModel.findOneAndDelete({ email });

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
        const response = await otpSender(adModel, email);
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






// update password
// const updatePassword = async (req, res) => {
//     const { email } = req.params; // Extract email from URL parameters
//     const { oldPassword, newPassword } = req.body; // Extract new password from request body

//     try {
//         const advertiser = await adModel.findOne({ email });
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

module.exports = { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser, sendOTPadvertiser , createActivity, getActivity,updateActivity,deleteActivity , getAllActivitiesByAdvertiser}; // Export the functions
