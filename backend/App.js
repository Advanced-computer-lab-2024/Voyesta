// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Create an express application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define routes (for example, a basic home route)
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js app connected to MongoDB!');
});


// adding Activity Category Router
const activityCategoryRouter = require('./src/routes/activityCategoryRouter');
app.use('/activityCategory', activityCategoryRouter);

// adding Preference Tag Router
const preferenceTagRouter = require('./src/routes/preferenceTagRouter');
app.use('/preferenceTag', preferenceTagRouter);

// Export the app
module.exports = app;
