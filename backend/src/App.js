const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { cleanupExpiredOTPs } = require('./services/cleanOTPs');

cron.schedule('*/5 * * * *', cleanupExpiredOTPs); // Run every 5 minutes to clean up expired OTPs

const { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser } = require("./controllers/advertiserController");
const { createSeller, getSellers, updateSeller, deleteSeller } = require("./controllers/sellerController");
const { createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide } = require("./controllers/tourGuideController");
const { createTourist, getTourists, updateTourist, deleteTourist } = require("./controllers/touristController");
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

mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");

    // Define the port
    const port = process.env.PORT || 3000; // Use environment variable or default to 3000

    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch(err => console.log(err));

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js app connected to MongoDB!');
});

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

// User routes
app.post("/addGuestTourist", registerGuestTourist);
app.get("/guestTourists", getGuestTourists);

app.post("/addGuestUser", registerGuestUser);
app.get("/guestUsers", getGuestUsers);

// Export the app
module.exports = app;
