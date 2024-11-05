const tourGuideModel = require('../Models/Tour Guide'); // Updated import to match the schema file name
const { generateToken } = require('../utils/jwt'); // Import the generateToken function from the auth file
const Itinerary = require('../Models/Itinerary');
const TourGuide = require('../Models/Tour Guide');

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

// Rate a tour guide based on an itinerary
const rateTourGuide = async (req, res) => {
  const { id } = req.params; // Tour guide ID
  const { rating, itineraryId } = req.body;
  const touristId = req.user.id;

  try {
   
    const tourGuide = await TourGuide.findById(id).populate('ratings');
    if(tourGuide){
        const existingRating = tourGuide.ratings.find(r => r.tourist.toString() === touristId && r.itineraryId.toString() === itineraryId);
        if (existingRating) {
        return res.status(400).json({ error: 'You have already rated this tour guide for this itinerary' });
        }
    }

    tourGuide.ratings.push({ tourist: touristId, rating, itineraryId: itineraryId });
    await tourGuide.save();
    res.status(200).json({ message: 'Tour guide rating added successfully', tourGuide });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Comment on a tour guide based on an itinerary
const TourGuideComments = async (req, res) => {
  const { id } = req.params; // Tour guide ID
  const { comment, itineraryId } = req.body;
  const touristId = req.user.id;

  try {
    
    const tourGuide = await TourGuide.findById(id).populate('comments');
    if(tourGuide){
        // console.log(tourGuide.comments[0].tourist.toString() === touristId);
        const existingComment = tourGuide.comments.find(c => c.tourist.toString() === touristId && c.itineraryId.toString() === itineraryId);
        if (existingComment) {
        return res.status(400).json({ error: 'You have already commented on this tour guide for this itinerary' });
        }
    }

    tourGuide.comments.push({ tourist: touristId, comment, itineraryId: itineraryId });
    await tourGuide.save();
    res.status(200).json({ message: 'Tour guide comment added successfully', tourGuide });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Check if a tourist has already rated or commented on a tour guide based on an itinerary
const checkTourGuideRatingAndComment = async (req, res) => {
  const { id } = req.params; // Tour guide ID
  const { itineraryId } = req.query;
  const touristId = req.user.id;

  try {
    const tourGuide = await TourGuide.findById(id).populate('ratings comments');
    if (!tourGuide) {
      return res.status(404).json({ error: 'Tour guide not found' });
    }


    const hasRated = tourGuide.ratings.some(r => r.tourist.toString() === touristId && r.itineraryId.toString() === itineraryId);
    const hasCommented = tourGuide.comments.some(c => c.tourist.toString() === touristId && c.itineraryId.toString() === itineraryId);

    res.status(200).json({ hasRated, hasCommented });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createTourGuide, rateTourGuide, TourGuideComments, getTourGuides, updateTourGuide, checkTourGuideRatingAndComment };
