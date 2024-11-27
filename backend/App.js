// app.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const router = require('./src/routes/index');

// Load environment variables
dotenv.config();

// Create an express application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Database connection
mongoose.connect("mongodb+srv://VoyestaDB:GUC_1234@voyestadb.cvp0i.mongodb.net/?retryWrites=true&w=majority&appName=VoyestaDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


app.use('/api', router);

mongoose.set('strictQuery', false);

// Export the app
module.exports = app;
