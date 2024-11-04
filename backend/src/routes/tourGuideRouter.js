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
_.get("/get", authenticate, getTourGuides);
_.put("/update", authenticate,updateTourGuide);

//----------------Itineraries------------------
_.post('/createItinerary', authenticate, createItinerary);
_.get('/getItinerary/:id', getItinerary);
_.get('/getItinerary', authenticate,getAllItinerariesByGuide);
_.delete('/deleteItinerary/:id', authenticate,deleteItinerary);
_.put('/updateItinerary/:id', authenticate,updateItinerary);

//----------------Activities------------------
_.get('/getActivity', getActivity);

//----------------Museums and historical places------------------
_.get('/getPlaces', get);

module.exports = _;