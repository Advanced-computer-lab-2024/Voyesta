const tourGuideModel = require('../Models/Tour Guide'); // Updated import to match the schema file name
const { generateToken } = require('../utils/jwt'); // Import the generateToken function from the auth file

// Create a new Tour Guide profile
const createTourGuide = async (req, res) => {
    const { username, email, password, mobileNumber, yearsOfExperience, previousWork } = req.body;
    try {
        const tourGuide = await tourGuideModel.create({
            username,
            email,
            password, // Ideally, this should be hashed before saving
            mobileNumber,
            yearsOfExperience,
            previousWork,
        });

        

        const token = generateToken(tourGuide._id, 'tourGuide');
        console.log(token);
        res.status(201).json({ message: 'Profile created successfully', token ,tourGuide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Tour Guides profiles
const getTourGuides = async (req, res) => {
    const id = req.user.id; // Assuming req.user contains the authenticated user's info
    try {
        const tourGuides = await tourGuideModel.findById(id);
        res.status(200).json(tourGuides);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a Tour Guide profile
const updateTourGuide = async (req, res) => {
    const id = req.user.id; // Extract email from URL parameters
    const {  mobileNumber,
        yearsOfExperience,
        previousWork,} = req.body;

        const updates = {};
        if (mobileNumber)  updates.mobileNumber = mobileNumber;
        if (yearsOfExperience) updates.yearsOfExperience = yearsOfExperience;
        if (previousWork) updates.previousWork = previousWork;

    try {
        const tourGuide = await tourGuideModel.findOneAndUpdate(
            { _id: id}, // Find by email
            {$set:updates }, // Update these fields
            { new: true, runValidators: true } // Return the updated document and validate
        );

        console.log(tourGuide);
        

        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', tourGuide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Send OTP to email
// const sendOTPtourGuide = async (req, res) => {
//     const { email } = req.body;
//     try {
//         const otp = otpSender(email);
//         res.status(200).json({ message: 'OTP sent successfully', otp });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
const TourGuideComments = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    try {
        const tourGuide = await tourGuideModel.findById(id);
        if (!tourGuide) {
            return res.status(404).json({ error: 'tourGuide not found' });
        }
        tourGuide.comments.push({
            tourist: req.user.id,
            comment
        });
        await tourGuide.save();
        res.status(200).json(tourGuide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const rateTourGuide = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    console.log(id);
    try {
        const tourguide = await tourGuideModel.findById(id);
        if (!tourguide) {
            return res.status(404).json({ error: 'tourguide not found' });
        }
        tourguide.ratings.push({
            tourist: req.user.id,
            rating
        });
        await tourguide.save();
        res.status(200).json(tourguide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



module.exports = { createTourGuide,rateTourGuide,TourGuideComments, getTourGuides, updateTourGuide  }; // Export the controller functions
