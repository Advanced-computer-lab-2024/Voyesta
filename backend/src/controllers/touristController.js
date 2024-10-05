// #Task route solution
const Itinerary=require('../Models/Itinerary');
const touristModel = require('../Models/Tourist');
const MuseumModel = require('../Models/MusemsAndHistoricalPlaces');
const Category = require('../Models/ActivityCategory');
const Tag = require('../Models/PreferenceTag')
const Activity = require('../Models/Activity');


const createTourist = async (req, res) => {
   const { Username, Email, Password, Number, Nationality, DOB, Job } = req.body;

   try {
       if (await touristModel.exists({ Email })) {  // Check if a tourist profile with the email already exists
           return res.status(400).json({ message: 'Tourist already exists' });
       }
       const tourist = new touristModel({
           Username,
           Email,
           Password, // Remember to hash the password before saving
           Number,
           Nationality,
           DOB,
           Job,
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
 
   
 }catch(error){
    res.status(400).json({error:error.message})
 }};


// gets a tourist by username displaying all its information
 const getTourist = async (req, res) => {
    const {id} = req.params;

    try{
     const tourist = await touristModel.findById(id);
     if(!tourist){
        return res.status(404).json({error:'Tourist not found'});
     }  
     
     res.status(200).json(tourist);
  
    
  }catch(error){
     res.status(400).json({error:error.message})
  }};


 const updateTourist = async (req, res) => {
   const { Email, Password, Number, Nationality, Job } = req.body;
   const { id } = req.params;
   
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
           { _id: id}, // Find by Email
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


// const TouristSearch = async (req, res) => {
    
//     try {
//         const { query } = req.body;

//         // Check if the query is provided
//         if (!query) {
//            // console.log('No search query provided');
//             return res.status(400).json({ error: 'Search query is required' });
//         }

//        // console.log('Search query:', query);

//         // Step 1: Search for Category IDs by name
//         const categoryMatches = await Category.find({ Name: { $regex: query, $options: 'i' } });
//        // console.log('Category matches:', categoryMatches);
//         const categoryIds = categoryMatches.map(category => category._id); // Get matching category IDs

//         // Step 2: Search for Tag IDs by name
//         const tagMatches = await Tag.find({ Name: { $regex: query, $options: 'i' } });
//         //console.log('Tag matches:', tagMatches);
//         const tagIds = tagMatches.map(tag => tag._id); // Get matching tag IDs
        
//         // Step 3: Create search criteria for Museums and Activities
//         const searchCriteria = {
//             $or: [
//                 { name: { $regex: query, $options: 'i' } },  // Search by name
//                 { category: { $in: categoryIds } },          // Search by matching category IDs
//                 { tags: { $in: tagIds } }                    // Search by matching tag IDs
//             ]
//         };

//         console.log('Search criteria:', searchCriteria);
//         // Step 4: Perform search for Museums and Activities
//         const museums = await MuseumModel.find(searchCriteria).populate('category tags');
//         const activities = await Activity.find(searchCriteria).populate('category tags');
//         const itinerary= await Itinerary.find(searchCriteria).populate('tags')

//         // Step 5: Return the combined results
//         res.status(200).json({
//             museums,
//             activities,
//             itinerary
//         });

//     } catch (error) {
//         console.error('Error during search:', error);
//         res.status(500).json({ error: `An error occurred during the search: ${error.message}`});
//     }
// };


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

// const TouristSearch = async (req, res) => {
//     try {
//         const { query } = req.body;

//         // Check if the query is provided
//         if (!query) {
//             console.log('No search query provided');
//             return res.status(400).json({ error: 'Search query is required' });
//         }

//         console.log('Search query:', query);

//         // Step 1: Search for Category IDs by name
//         const categoryMatches = await Category.find({ Name: { $regex: query, $options: 'i' } });
//         const categoryIds = categoryMatches.map(category => category._id); // Get matching category IDs

//         // Step 2: Search for Tag IDs by name
//         const tagMatches = await Tag.find({ Name: { $regex: query, $options: 'i' } });
//         const tagIds = tagMatches.map(tag => tag._id); // Get matching tag IDs

//         // Step 3: Create search criteria for Museums and Activities
//         const searchCriteria = {
//             $or: [
//                 { name: { $regex: query, $options: 'i' } },  // Search by name
//                 { category: { $in: categoryIds } },          // Search by matching category IDs
//                 { tags: { $in: tagIds } }                    // Search by matching tag IDs
//             ]
//         };

//         // Step 4: Perform search for Museums and Activities
//         const museums = await MuseumModel.find(searchCriteria).populate('category tags');
//         const activities = await Activity.find(searchCriteria).populate('category tags');
//         const itinerary= await Itinerary.find(searchCriteria).populate('tags')
7
//         // Step 5: Return the combined results
//         res.status(200).json({
//             museums,
//             activities,
//             itinerary
//         });

//     } catch (error) {
//         console.error('Error during search:', error);
//         res.status(500).json({ error: `An error occurred during the search: ${error.message}` });
//     }
// };


module.exports = {createTourist, getTourists, updateTourist, deleteTourist, filterTouristActivities, getTouristView}; // Export the controller functions
