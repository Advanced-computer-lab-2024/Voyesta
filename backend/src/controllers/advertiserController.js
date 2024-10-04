const adModel = require('../Models/Advertiser'); // Ensure this path is correct
const {otpSender} = require('../services/generateOTPgenric');
const Activity = require('../Models/Activity');
// const Museum = require('../Models/Museum');
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
    const { email } = req.params; // Extract email from URL parameters
    const updates = req.body;

    try {
        const advertiser = await adModel.findOneAndUpdate(
            { email }, // Find by email
            updates, // Update these fields
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
// .populate('category tags advertiser');

const getActivitysandadvertiser = async(req,res) =>{
    const advertiserId = req.params.id
    
    try {
        const activities = await Activity.find({ advertiser: advertiserId })
        res.status(200).json({
          activities
        });
      } catch (error) {
        res.status(500).json({ error: 'Server error while fetching items' });
      }
}
const createActivity = async (req, res) => {
    // city and country are nested in location object
    // lat and lng are nested in coordinates object
    // as theres no frontend to send the google marker
    
    const { name, description, address,city, country,lat,lng, date, time, Price, specialDiscount, category, tags} = req.body;
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
            Price,
            specialDiscount,
            category,
            tags,
            advertiser: id
        });

        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser, sendOTPadvertiser,getActivitysandadvertiser,createActivity }; // Export the functions










