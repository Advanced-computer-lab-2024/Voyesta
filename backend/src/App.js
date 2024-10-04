const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { cleanupExpiredOTPs } = require('./services/cleanOTPs');

cron.schedule('*/5 * * * *', cleanupExpiredOTPs); // Run every 5 minutes to clean up expired OTPs


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
  })
  .catch(err => console.log(err));

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js app connected to MongoDB!');
});

// Your existing routes...

// app.get('/filterGuestActivities', filterTouristActivities);
// app.get('/viewUpcomingGuestAttractions', getTouristView);


// Export the app
module.exports = app;
