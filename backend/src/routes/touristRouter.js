const express = require("express");
const authenticate = require("../middleware/authenticate");
let _ = express.Router();

const { createTourist, getTourists, updateTourist, deleteTourist, redeemPoints } = require("../controllers/touristController");
const { get } = require("../controllers/museumsHistoricalPlacesController");
const activityController = require('../controllers/activityController');
const itineraryController = require('../controllers/itineraryController');
const productController = require('../controllers/productController');
const { getActivityCategory } = require('../controllers/activityCategoryController');
const { TourGuideComments, rateTourGuide, checkTourGuideRatingAndComment } = require('../controllers/tourGuideController');
const { getPreferenceTags } = require('../controllers/preferenceTagContoller');
const { createBooking, getBookings, cancelBooking, payForBooking } = require('../controllers/bookingController');
const { createComplaint, getComplaintById, getComplaints } = require('../controllers/complaintController');
const { changePassword } = require('../controllers/accountController');

_.post("/add", createTourist);
_.get("/get", authenticate, getTourists);
_.put("/update", authenticate, updateTourist);
_.delete("/delete", authenticate, deleteTourist);

_.get('/getProducts', authenticate, productController.getProducts);
_.get('/getActivity', activityController.getActivity);
_.get('/getItinerary', authenticate, itineraryController.getItineraries);
_.get("/getPlaces", authenticate, get);
_.get('/getCategory', authenticate, getActivityCategory);
_.get('/getTags', authenticate, getPreferenceTags);

_.patch('/tourGuideComment/:id', authenticate, TourGuideComments);
_.patch('/tourGuideRate/:id', authenticate, rateTourGuide);
_.get('/checkTourGuideRatingAndComment/:id', authenticate, checkTourGuideRatingAndComment);

_.patch('/activityComment/:id', authenticate, activityController.addComment);
_.patch('/activityRate/:id', authenticate, activityController.addRating);
_.patch('/itineraryRate/:id', authenticate, itineraryController.addItineraryRating);
_.patch('/itineraryComment/:id', authenticate, itineraryController.addItineraryComment);

_.patch('/productRate/:id', authenticate, productController.rateProduct);
_.patch('/productReview/:id', authenticate, productController.reviewProduct);

_.get('/checkActivityRatingAndComment/:id', authenticate, activityController.checkActivityRatingAndComment);
_.get('/checkItineraryRatingAndComment/:id', authenticate, itineraryController.checkItineraryRatingAndComment);

_.post('/BookEvent/:id', authenticate, createBooking);
_.get('/getBookings', authenticate, getBookings);
_.patch('/cancelBooking/:id', authenticate, cancelBooking);
_.patch('/payForBooking/:id', authenticate, payForBooking);
_.patch('/redeemPoints', authenticate, redeemPoints);

_.post('/createComplaint', authenticate, createComplaint);
_.get('/getComplaintById/:id', authenticate, getComplaintById);
_.get('/getComplaints', authenticate, getComplaints);

_.patch('/changePassword', authenticate, changePassword);

module.exports = _;