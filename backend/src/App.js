const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { cleanupExpiredOTPs } = require('./services/cleanOTPs');

// cron.schedule('*/5 * * * *', cleanupExpiredOTPs); // Run every 5 minutes to clean up expired OTPs
//createItinerary,getItinerary,getAllItinerariesByGuide,deleteItinerary
const{createPlaceOfInterest,getAllPlacesOfInterest,getPlaceOfInterest,updatePlaceOfInterest,deletePlaceOfInterest}=require("./controllers/TourismGovernor");
const { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser,getActivitysandadvertiser,createActivity } = require("./controllers/advertiserController");
const { createSeller, getSellers, updateSeller, deleteSeller } = require("./controllers/sellerController");
const { createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide } = require("./controllers/tourGuideController");
const { createTourist, getTourists, updateTourist, deleteTourist,TouristSearch } = require("./controllers/touristController");
const { registerGuestUser, getGuestUsers } = require("./controllers/userGuestController"); 
const { registerGuestTourist, getGuestTourists } = require("./controllers/guestTouristController"); 

//empty comment

// Load environment variables
dotenv.config();

// Create an express application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const MongoURI = process.env.MONGO_URI;

app.patch("/touristSearch",TouristSearch);


// Your existing routes...
app.post("/addAdvertiser", createAdvertiser);
app.get("/advertisers", getAdvertisers);
app.put("/updateAdvertiser", updateAdvertiser);
app.delete("/deleteAdvertiser", deleteAdvertiser);

app.post("/addSeller", createSeller);
app.get("/sellers", getSellers);
app.put("/updateSeller", updateSeller);
app.delete("/deleteSeller", deleteSeller);

app.post("/addTourGuide", createTourGuide);
app.get("/tourGuides", getTourGuides);
app.put("/updateTourGuide", updateTourGuide);
app.delete("/deleteTourGuide", deleteTourGuide);

app.post("/addTourist", createTourist);
app.get("/tourists", getTourists);
app.put("/updateTourist", updateTourist);
app.delete("/deleteTourist", deleteTourist);

// // User routes
// app.post("/addGuestTourist", registerGuestTourist);
// app.get("/guestTourists", getGuestTourists);

// app.post("/addGuestUser", registerGuestUser);
// app.get("/guestUsers", getGuestUsers);

//Itinerary
// app.post("/addItinerary",createItinerary);
// app.get("/getItinerary",getAllItinerariesByGuide);
// app.delete("/deleteItinerary",deleteItinerary);
//activity routes
app.get("/ListOfActivities/:id", getActivitysandadvertiser);
app.post("/addactivity/:id",createActivity);
//Tourism Governor routes
app.post("/addplace/:id", createPlaceOfInterest);
app.get("/getallPlaces", getAllPlacesOfInterest);
app.get("/getonePlace/:id", getPlaceOfInterest);
app.put("/updateplace", updatePlaceOfInterest);
app.delete("/deleteplace", deletePlaceOfInterest);

// Export the app
module.exports = app;
