const express = require("express");
const authenticate = require("../middleware/authenticate");
let _ = express.Router();
const {
    createItinerary,
    updateItinerary,
    getItineraries,
    getItinerary,
    deleteItinerary,
    updateBookingStatus,
    updateBookingEnabledStatus,
    getBookingStatus
} = require('../controllers/itineraryController');

const {
    getActivity
} = require('../controllers/activityController');

const {
    get
} = require('../controllers/museumsHistoricalPlacesController');

const { createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide } = require("../controllers/tourGuideController");
const { changePassword, setStatusToDeleted } = require('../controllers/accountController');
const cloudinaryController = require('../controllers/cloudinaryController');
const { getRevenue, getBookingsReport } = require('../controllers/revenueController');
const { getNotifications } = require('../controllers/NotificationController');



_.post("/add", createTourGuide);
_.get("/get", authenticate, getTourGuides);
_.put("/update", authenticate,updateTourGuide);

//----------------Itineraries------------------
_.post('/createItinerary', authenticate, createItinerary);
_.get('/getItinerary/:id', getItinerary);
_.get('/getItinerary', authenticate,getItineraries);
_.delete('/deleteItinerary/:id', authenticate,deleteItinerary);
_.put('/updateItinerary/:id', authenticate,updateItinerary);
_.patch('/itineraries/:id/booking-status', updateBookingStatus);


//----------------Activities------------------
_.get('/getActivity', getActivity);

//----------------Museums and historical places------------------
_.get('/getPlaces', get);

_.patch('/changePassword', authenticate, changePassword);
_.patch('/setStatusToDeleted', authenticate, setStatusToDeleted);
_.post('/uploadProfilePicture', authenticate, cloudinaryController.uploadImage);

_.get('/getRevenue', authenticate, getRevenue);
_.get('/getBookingsReport', authenticate, getBookingsReport);
_.get('/getNotifications', authenticate, getNotifications);

_.patch('/updateBookingEnabled/:id', updateBookingEnabledStatus);
_.get('/:id/booking-status', authenticate, getBookingStatus);

module.exports = _;