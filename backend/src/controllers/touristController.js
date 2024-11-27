const touristModel = require('../Models/Tourist');
const MuseumModel = require('../Models/MusemsAndHistoricalPlaces');
const Category = require('../Models/ActivityCategory');
const Tag = require('../Models/PreferenceTag')
const Activity = require('../Models/Activity');
const adminModel = require('../Models/Admin');

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

const redeemPromoCode = async (req, res) => {
    const { code, touristId } = req.body;

    if (!code || !touristId) {
        return res.status(400).json({ message: 'Code and Tourist ID are required' });
    }

    try {
        // Find the admin to access promo codes
        const admin = await adminModel.findOne();
        if (!admin) {
            return res.status(404).json({ message: 'Promo codes not found' });
        }

        const promoCode = admin.globalPromoCodes.find(
            (promo) => promo.code === code && promo.status === 'active'
        );

        if (!promoCode) {
            return res.status(400).json({ message: 'Invalid or inactive promo code' });
        }

        // Find the tourist
        const tourist = await touristModel.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if today is the tourist's birthday
        const today = new Date();
        const birthDate = new Date(tourist.DOB);
        const currentYear = today.getFullYear();

        if (today.getMonth() !== birthDate.getMonth() || today.getDate() !== birthDate.getDate()) {
            return res.status(400).json({ message: 'Promo code can only be used on your birthday' });
        }

        // Check if the tourist has already redeemed this code this year
        const alreadyRedeemed = promoCode.redeemedBy.find(
            (entry) => entry.touristId.toString() === touristId && entry.year === currentYear
        );

        if (alreadyRedeemed) {
            return res.status(400).json({ message: 'Code already redeemed, see you next year!' });
        }

        // Mark the promo code as redeemed by this tourist
        promoCode.redeemedBy.push({ touristId, year: currentYear });
        await admin.save();

        res.status(200).json({ message: 'Promo code redeemed successfully', discount: promoCode.discount });
    } catch (error) {
        res.status(500).json({ message: 'Error redeeming promo code', error: error.message });
    }
};










module.exports = {createTourist, getTourists, getTourist,updateTourist, deleteTourist, getTouristView, redeemPoints, searchFlights,searchHotelsByCity,confirmFlightPrice,redeemPromoCode};