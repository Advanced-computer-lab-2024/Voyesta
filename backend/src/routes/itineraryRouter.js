const express = require('express');
const {
    getItineraryById,
    createItinerary,  
    getItinerary, 
    updateItinerary, 
    deleteItinerary,
    getItineraries,
    sortByPrice,
    search,
    filter
} = require('../controllers/itineraryController');

let _ = express.Router();

_.post('/add', createItinerary);
_.get('/get/:id', getItinerary);
_.get('/getById/:id', getItineraryById);
_.get('/getByGuide', getItineraries);
_.delete('/delete/:id', deleteItinerary);
_.patch('/update/:id', updateItinerary);
_.get('/sortByPrice', sortByPrice);
_.get('/search', search);
_.get('/filter', filter);

module.exports = _;