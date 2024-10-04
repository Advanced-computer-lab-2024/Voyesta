// #Task route solution

const touristModel = require('../Models/tourist.js');
const Activity = require('../Models/Activity'); // Update with the correct path to your activity model
const Itinerary = require('../Models/itinerarySchema'); // Adjust path as needed
const MuseumsandHistoricalPlaces = require('../Models/MusemsAndHistoricalPlaces.js');



const createTourist = async(req,res) => {
   const{Email,Username,Password,Number,Nationality,Job}= req.body;
   try{
      const tourguide= await touristModel.create({Email,Username,Password,Number,Nationality,Job});
      res.status(200).json(tourguide);


   }catch{error}{
      res.status(400).json({error:error.message})
   }


}

const getTourists = async (req, res) => {
   try{
    const tourguides=await touristModel.find({});
    res.status(200).json(tourguides);
 
   
 }catch{error}{
    res.status(400).json({error:error.message})
 }}


 const updateTourist = async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters
    const { Username, Email, Password, Number, Nationality, Job } = req.body;

    try {
        // Use findByIdAndUpdate to update the tourist by ID
        const tourist = await touristModel.findByIdAndUpdate(
            id, // Find by ID
            { Username, Email, Password, Number, Nationality, Job }, // Update these fields
            { new: true, runValidators: true } // Return the updated document and validate
        );

        // Check if the tourist was found
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        // Respond with the updated tourist information
        res.status(200).json(tourist);
    } catch (error) {
        // Handle any errors that may occur
        res.status(400).json({ error: error.message });
    }
};


const deleteTourist = async (req, res) => {
    const { id } = req.params; // Extract ID from URL parameters

    try {
        // Attempt to delete the tourist by ID
        const tourist = await touristModel.findByIdAndDelete(id); // Find and delete by ID

        // Check if the tourist was found and deleted
        if (!tourist) {
            return res.status(404).json({ error: 'No such tourist' });
        }

        // Respond with the deleted tourist's information
        res.status(200).json({ message: 'Tourist deleted successfully', tourist });
    } catch (error) {
        // Handle any errors that may occur
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
        if (isNaN(activityDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        query.date = {
            $gte: new Date(activityDate.setHours(0, 0, 0, 0)),
            $lt: new Date(activityDate.setHours(23, 59, 59, 999))
        };
    }

    // Category filter
    if (category) {
        try {
            query.category = mongoose.Types.ObjectId(category);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
    }

    // Rating filter
    if (rating) {
        const parsedRating = Number(rating);
        if (parsedRating >= 1 && parsedRating <= 5) {
            query.rating = { $gte: parsedRating };
        } else {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
    }

    try {
        const activities = await Activity.find(query).populate('category');
        
        // Check if no activities found
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found matching the criteria' });
        }

        res.status(200).json(activities);
    } catch (error) {
        console.error("Error retrieving activities:", error);
        res.status(500).json({ message: 'Error retrieving activities', error: error.message });
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
        const museums = await MuseumsandHistoricalPlaces.find();

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




module.exports = {createTourist, getTourists, updateTourist, deleteTourist,filterTouristActivities,getTouristView};
