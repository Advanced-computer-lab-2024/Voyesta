// #Task route solution
const Itinerary=require('../Models/Itinerary');
const touristModel = require('../Models/Tourist');
const MuseumModel = require('../Models/MusuemAndPlaces');
const Category= require('../Models/ActivityCategory');
const Tag =require('../Models/PrefrenceTag');
const Activity = require('../Models/Activity');

const { default: mongoose } = require('mongoose');
const{otpSender} = require('../services/generateOTPgenric');

const createTourist = async (req, res) => {
   const { Username, Email, Password, Number, Nationality, DOB, Job } = req.body;

   try {
       if (await Tourist.exists({ email })) {  // Check if a tourist profile with the email already exists
           return res.status(400).json({ message: 'Tourist already exists' });
       }
       const tourist = new Tourist({
           Username,
           Email,
           Password, // Remember to hash the password before saving
           Number,
           Nationality,
           DOB,
           Job,
           Wallet
       });

       await tourist.save();
       res.status(201).json({ message: 'Tourist registered successfully', tourist });
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

const getTourists = async (req, res) => {
   try{
    const tourist=await touristModel.find({});
    res.status(200).json(tourist);
 
   
 }catch{error}{
    res.status(400).json({error:error.message})
 }};


// gets a tourist by username displaying all its information
 const getTourist = async (req, res) => {
    const { Username } = req.prams;
    try{
     const tourist=await touristModel.find({Username:Username});
     if(!tourist){
        return res.status(404).json({error:'Tourist not found'});
     }  
     
     res.status(200).json(tourist);
  
    
  }catch{error}{
     res.status(400).json({error:error.message})
  }};


 const updateTourist = async (req, res) => {
   const { Email, Password, Number, Nationality, Job } = req.body;
   const { Username } = req.params;
   
   // Create an object containing the fields to update
   const updateFields = {};
    if (Email) updateFields.Email = Email;
    if (Password) updateFields.Password = Password;
    if (Number) updateFields.Number = Number;
    if (Nationality) updateFields.Nationality = Nationality;
    if (Job) updateFields.Job = Job;
   
   try {
       // Use findOneAndUpdate to update the tourist by Email
       const tourist = await touristModel.findOneAndUpdate(
           { Username: Username}, // Find by Email
           { $set: updateFields}, // Update these fields
           { new: true } // Return the updated document
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
// Send OTP to email
const sendOTPtourist = async (req, res) => {
   const { Email } = req.body;

   try {
       const response = await otpSender(touristModel, Email);
       res.json(response);
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
module.exports = {createTourist, getTourists, updateTourist, deleteTourist,  sendOTPtourist, filterTouristActivities, getTouristView}; // Export the controller functions

};

// const TouristSearch = async (req, res) => {
//     try {
//         const { query } = req.body; // Extract search query from request body

//         // Ensure the query is provided
//         if (!query) {
//             return res.status(400).json({ error: 'Search query is required' });
//         }

//         // Variables to hold the object IDs for categories and tags
//         let categoryIds = [];
//         let tagIds = [];

//         // Step 1: Search for the Category ObjectId by Name (if query matches category name)
//         const categoryMatches = await Category.find({ name: { $regex: query, $options: 'i' } });
//         if (categoryMatches.length > 0) {
//             categoryIds = categoryMatches.map(category => category._id); // Collect all matching category ObjectIds
//         }

//         // Step 2: Search for the Tag ObjectId by Name (if query matches tag name)
//         const tagMatches = await Tag.find({ name: { $regex: query, $options: 'i' } });
//         if (tagMatches.length > 0) {
//             tagIds = tagMatches.map(tag => tag._id); // Collect all matching tag ObjectIds
//         }

//         // Step 3: Search for Museums or Historical Places by Name, Category, or Tags
//         const searchCriteria = {
//             $or: [
//                 { name: { $regex: query, $options: 'i' } }, // Search by name
//                 { category: { $in: categoryIds } },         // Search by category ObjectId(s)
//                 { tags: { $in: tagIds } }                   // Search by tag ObjectId(s)
//             ]
//         };

//         // Execute the search across multiple collections
//         const [museums, historicalPlaces, itineraries, activities] = await Promise.all([
//             MuseumModel.find(searchCriteria).populate('category tags'),
//             Itinerary.find(searchCriteria).populate('category tags'),
//             Activity.find(searchCriteria).populate('category tags')
//         ]);
//         const combinedResults = {
//             // museums,
//             // historicalPlaces,
//             // itineraries,
//             activities
//         };

//         res.status(200).json(combinedResults);

//     } catch (error) {
//         console.error('Error during search:', error);
//         res.status(500).json({ error: `An error occurred during the search: ${error.message}` });
//     }
// };

const TouristSearch = async (req, res) => {
    try {
        const { query } = req.body;

        // Check if the query is provided
        if (!query) {
            console.log('No search query provided');
            return res.status(400).json({ error: 'Search query is required' });
        }

        console.log('Search query:', query);

        // Step 1: Search for Category IDs by name
        const categoryMatches = await Category.find({ Name: { $regex: query, $options: 'i' } });
        const categoryIds = categoryMatches.map(category => category._id); // Get matching category IDs

        // Step 2: Search for Tag IDs by name
        const tagMatches = await Tag.find({ Name: { $regex: query, $options: 'i' } });
        const tagIds = tagMatches.map(tag => tag._id); // Get matching tag IDs

        // Step 3: Create search criteria for Museums and Activities
        const searchCriteria = {
            $or: [
                { name: { $regex: query, $options: 'i' } },  // Search by name
                { category: { $in: categoryIds } },          // Search by matching category IDs
                { tags: { $in: tagIds } }                    // Search by matching tag IDs
            ]
        };

        // Step 4: Perform search for Museums and Activities
        const museums = await MuseumModel.find(searchCriteria).populate('category tags');
        const activities = await Activity.find(searchCriteria).populate('category tags');
        const itinerary= await Itinerary.find(searchCriteria).populate('tags')

        // Step 5: Return the combined results
        res.status(200).json({
            museums,
            activities,
            itinerary
        });

    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ error: `An error occurred during the search: ${error.message}` });
    }
};


module.exports = {createTourist, getTourists, updateTourist, deleteTourist,  sendOTPtourist,TouristSearch}; // Export the controller functions















// const [museums, historicalPlaces, itineraries, activities] = await Promise.all([
//         //     MuseumsAndPlaces.find(searchCriteria).populate('category tags'),
//         //     // Itinerary.find(searchCriteria).populate('tags'),
//         //     // Activity.find(searchCriteria).populate('category tags')
//         // ]);

// // { category: { $regex: query, $options: 'i' } },
//  // const combinedResults = {
//         //     museums
//         //     // historicalPlaces,
//         //     // itineraries,
//         //     // activities
//         // };

//         // res.status(200).json(combinedResults);

// const TouristSearch = async (req, res) => {
//     try {
//         const { query } = req.body; // Extract query from the request body instead of URL params

//         // Check if query is provided
//         if (!query) {
//             return res.status(400).json({ error: 'Search query is required' });
//         }

//         const searchCriteria = {
//             $or: [
//                 { name: { $regex: query, $options: 'i' } },
//                 { tags: { $regex: query, $options: 'i' } }
//             ]
//         };

//         const museums = await MuseumModel.find(searchCriteria);
//         const historicalPlaces= await MuseumModel.find(searchCriteria).populate('tags');
       
//         const combinedResults = {
//             museums,
//             historicalPlaces
//         };
//         console.log('Museums found:', museums);
       
//     } catch (error) {
//         console.error('Error during search:', error);
//         res.status(500).json({ error: 'An error occurred during the search' });
//     }
// };