const express = require("express");
let _ = express.Router();
const {
    createItinerary,
    updateItinerary,
    getAllItinerariesByGuide,
    getItinerary,
    deleteItinerary
} = require('../controllers/itineraryController');

const {
    getActivity
} = require('../controllers/activityController');

const {
    get
} = require('../controllers/museumsHistoricalPlacesController');

const { createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide } = require("../controllers/tourGuideController");

_.post("/add", createTourGuide);
_.get("/get", getTourGuides);
_.put("/update/:email", updateTourGuide);

//----------------Itineraries------------------
_.post('/createItinerary', createItinerary);
_.get('/getItinerary', getItinerary);
_.get('/getItineraryByTourGuide', getAllItinerariesByGuide);
_.delete('/deleteItinerary', deleteItinerary);
_.patch('/updateItinerary', updateItinerary);

//----------------Activities------------------
_.get('/getActivity', getActivity);

//----------------Museums and historical places------------------
_.get('/getMuseumsAndHistoricalPlaces', get);

module.exports = _;