// #Task route solution
const Itinerary=require('../Models/Itinerary');
const touristModel = require('../Models/Tourist');
const MuseumModel = require('../Models/MusuemAndPlaces');
const Category= require('../Models/ActivityCategory');
const Tag =require('../Models/PrefrenceTag');
const Activity = require('../Models/Activity');

const { default: mongoose } = require('mongoose');
const{otpSender} = require('../services/generateOTPgenric');
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
   const { Username, Email, Password, Number, Nationality, Job } = req.body;

   try {
       // Use findOneAndUpdate to update the tourist by Email
       const tourist = await touristModel.findOneAndUpdate(
           { Email: Email }, // Find by Email
           { Username: Username, Password: Password, Number: Number, Nationality: Nationality, Job: Job }, // Update these fields
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
   const { Email } = req.body; // Extract Email from the request body

   try {
       // Attempt to delete the tourist by Email
       const tourist = await touristModel.findOneAndDelete({ Email: Email });

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
        const categoryMatches = await Category.find({ name: { $regex: query, $options: 'i' } });
        const categoryIds = categoryMatches.map(category => category._id); // Get matching category IDs

        // Step 2: Search for Tag IDs by name
        const tagMatches = await Tag.find({ name: { $regex: query, $options: 'i' } });
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
            activities
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