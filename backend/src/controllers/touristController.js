const touristModel = require('../Models/Tourist');
const MuseumModel = require('../Models/MusemsAndHistoricalPlaces');
const Category = require('../Models/ActivityCategory');
const Tag = require('../Models/PreferenceTag')
const Activity = require('../Models/Activity');

const {generateToken} = require('../utils/jwt');
//const amadeus = require('../utils/amadeusClient').amadeus;
const {amadeus,handleAmadeusError} = require('../utils/amadeusClient'); // Import the error handler


//console.log(amadeus);



const createTourist = async (req, res) => {
   const { username, email, password, Number, Nationality, DOB, Job } = req.body;

   try {
       if (await touristModel.exists({ email })) {  // Check if a tourist profile with the email already exists
           return res.status(400).json({ message: 'Tourist already exists' });
       }
       const tourist = new touristModel({
           username,
           email,
           password, // Remember to hash the password before saving
           Number,
           Nationality,
           DOB,
           Job,
       });

       await tourist.save();

       const token = generateToken(tourist._id, 'tourist');
       res.status(201).json({ message: 'Tourist registered successfully', token, tourist });
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

const getTourists = async (req, res) => {
    const id = req.user.id;
   try{
    const tourist=await touristModel.findById(id).populate('preferences');
    
    res.status(200).json(tourist);
 
   
 }catch(error){
    res.status(400).json({error:error.message})
 }};


// gets a tourist by username displaying all its information
 const getTourist = async (req, res) => {
    const {id} = req.user.id;

    try{
     const tourist = await touristModel.findById(id).populate('preferences');
    
     if(!tourist){
        return res.status(404).json({error:'Tourist not found'});
     }  
     
     res.status(200).json(tourist);
  
    
  }catch(error){
     res.status(400).json({error:error.message})
}};


 const updateTourist = async (req, res) => {
   const { email, password, Number, DOB, Nationality, Job ,preferences  } = req.body;
   const id = req.user.id; // Extract ID from URL parameters
   
   // Create an object containing the fields to update
   const updateFields = {};
    if (email) updateFields.email = email;
    if (password) updateFields.password = password;
    if (Number) updateFields.Number = Number;
    if (DOB) updateFields.DOB = DOB;
    if (Nationality) updateFields.Nationality = Nationality;
    if (Job) updateFields.Job = Job;
    if (preferences) updateFields.preferences = preferences;
   
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
    const id = req.user.id; // Extract ID from URL parameters

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



const getTouristView = async (req, res) => {
    try {
        const currentDate = new Date();

        // Fetch upcoming activities
        const upcomingActivities = await Activity.find({ date: { $gte: currentDate } });

        // Fetch itineraries (you might want to filter by available dates as well)
        const upcomingItineraries = await Itinerary.find({
            availableDatesAndTimes: { $elemMatch: { $gte: currentDate.toISOString() } }
        });

        // Fetch museums and historical placesformat
        const museums = await MuseumsAndHistoricalPlaces.find();

        // Combine results into a structured 
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

const redeemPoints = async (req, res) => {
    const touristId = req.user.id;
    const { pointsToRedeem } = req.body;

    if (pointsToRedeem % 10000 !== 0) {
        return res.status(400).json({ error: 'Points to redeem must be a multiple of 10,000' });
    }

    try {
        const tourist = await touristModel.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        if (tourist.currentPoints < pointsToRedeem) {
            return res.status(400).json({ error: 'Insufficient points to redeem' });
        }

        const amountToAdd = (pointsToRedeem / 10000) * 100; // 10,000 points = 100 EGP

        tourist.currentPoints -= pointsToRedeem;
        tourist.Wallet += amountToAdd;

        await tourist.save();

        res.status(200).json({ message: 'Points redeemed successfully', tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const searchFlights = async (req, res) => {
    const { origin, destination, departureDate, returnDate, adults } = req.query;

    

    


    try {
        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate,
            returnDate,
            adults,
            max: 10 // Limit the results
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error searching for flights:", error);
        const { status, message } = handleAmadeusError(error);
        res.status(status).json({ error: message });
    }
};

const confirmFlightPrice = async (req, res) => {
    const { flightOffer } = req.body; // flightOffer should be the selected offer details

    const requestData = {
        data: {
            type: "flight-offers-pricing",
            flightOffers: [flightOffer] // Flight offer should be inside the flightOffers array
        }
    };
    
    try {
        const response = await amadeus.shopping.flightOffers.pricing.post(requestData)
        
        const priceDetails = response.data.flightOffers[0]?.price;

        if (!priceDetails) {
            return res.status(404).json({ error: "Price details not found." });
        }

        // Prepare the price info to send only grandTotal and currency
        const priceInfo = {
            grandTotal: priceDetails.grandTotal,
            currency: priceDetails.currency
        };

        // Sending the extracted price details to the frontend
        res.status(200).json({ price: priceInfo });
    } catch (error) {
        console.error("Error confirming flight price:", error);
        res.status(500).json({ error: "An error occurred while confirming flight price." });
    }
};







const searchHotelsByCity = async (req, res) => {
    const { cityCode, checkInDate, checkOutDate, adults } = req.query;
    const MAX_HOTELS = 10; // Maximum number of hotels to retrieve
    try {
        // Step 1: Get list of hotels in the city
        const hotelList = await amadeus.referenceData.locations.hotels.byCity.get({ cityCode});
        if (!hotelList.data || hotelList.data.length === 0) {
            return res.status(404).json({ message: "No hotels found for the specified city." });
        }
        //console.log(hotelList.data);
        const hotelIds = hotelList.data.map(hotel => hotel.hotelId).slice(0, MAX_HOTELS);

        if (hotelIds.length === 0) {
            return res.status(404).json({ message: "No hotels found for the specified city." });
        }


        // Step 2: Retrieve offers for each hotel using the hotel IDs
       
       console.log(hotelIds);
        const response = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: hotelIds.join(','), // Convert array of hotel IDs to a comma-separated string
            checkInDate,
            checkOutDate,
            adults
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error searching hotels by city:", error);
        const { status, message } = handleAmadeusError(error); // Use custom error handling if needed
        res.status(status).json({ error: message || "An error occurred while searching hotels by city." });
    }
};


const bookmarkActivity = async (req, res) => {
    const touristId = req.user.id; // Extract tourist ID from the authenticated user
    const { activityId } = req.body; // Get the activity ID from the request body

    try {
        const tourist = await touristModel.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        // Check if the activity is already bookmarked
        if (!tourist.bookmarkedActivities.includes(activityId)) {
            tourist.bookmarkedActivities.push(activityId);
            await tourist.save();
        }

        res.status(200).json({ message: 'Activity bookmarked successfully', bookmarks: tourist.bookmarkedActivities });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const unbookmarkActivity = async (req, res) => {
    const touristId = req.user.id; // Extract tourist ID from the authenticated user
    const activityId = req.params.id; // Get the activity ID from the request body
    console.log(activityId);
    try {
        const tourist = await touristModel.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        console.log(tourist.bookmarkedActivities);
        // Remove the activity from the bookmarks list
        tourist.bookmarkedActivities = tourist.bookmarkedActivities.filter(
            (id) => id.toString() !== activityId
        );

        await tourist.save();

        res.status(200).json({ message: 'Activity unbookmarked successfully', bookmarks: tourist.bookmarkedActivities });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const bookmarkItinerary = async (req, res) => {
    const touristId = req.user.id;
    const { itineraryId } = req.body;

    try {
        const tourist = await touristModel.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        if (!tourist.bookmarkedItineraries.includes(itineraryId)) {
            tourist.bookmarkedItineraries.push(itineraryId);
            await tourist.save();
        }

        res.status(200).json({ message: 'Itinerary bookmarked successfully', bookmarks: tourist.bookmarkedItineraries });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const unbookmarkItinerary = async (req, res) => {
    const touristId = req.user.id;
    const { itineraryId } = req.body;

    try {
        const tourist = await touristModel.findById(touristId);

        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        tourist.bookmarkedItineraries = tourist.bookmarkedItineraries.filter(
            (id) => id.toString() !== itineraryId
        );

        await tourist.save();

        res.status(200).json({ message: 'Itinerary unbookmarked successfully', bookmarks: tourist.bookmarkedItineraries });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBookmarkedItems = async (req, res) => {
    const touristId = req.user.id;

    try {
        const tourist = await touristModel.findById(touristId)
            .populate('bookmarkedActivities')
            .populate('bookmarkedItineraries');

        res.status(200).json({
            activities: tourist.bookmarkedActivities,
            itineraries: tourist.bookmarkedItineraries
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const isBookmarked = async (req, res) => {
    const touristId = req.user.id;
    const { activityId } = req.params;
  
    try {
      const tourist = await touristModel.findById(touristId);
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      const isBookmarked = tourist.bookmarkedActivities.includes(activityId);
      res.status(200).json({ isBookmarked });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {createTourist, getTourists, getTourist,updateTourist, deleteTourist, getTouristView, redeemPoints, searchFlights,searchHotelsByCity,confirmFlightPrice,bookmarkActivity,unbookmarkActivity,bookmarkItinerary,unbookmarkItinerary,getBookmarkedItems, isBookmarked};