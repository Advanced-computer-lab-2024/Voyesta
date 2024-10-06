const express = require("express");
const authenticate = require("../middleware/authenticate");
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
_.put("/update", authenticate,updateTourGuide);

//----------------Itineraries------------------
_.post('/createItinerary', authenticate,createItinerary);
_.get('/getItinerary/:id', getItinerary);
_.get('/getItineraryByTourGuide', authenticate,getAllItinerariesByGuide);
_.delete('/deleteItinerary/:id', authenticate,deleteItinerary);
_.patch('/updateItinerary/:id', authenticate,updateItinerary);

//----------------Activities------------------
_.get('/getActivity', getActivity);

//----------------Museums and historical places------------------
_.get('/getMuseumsAndHistoricalPlaces', get);

module.exports = _;