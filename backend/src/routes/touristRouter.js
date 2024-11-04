const express = require("express");
const authenticate = require("../middleware/authenticate");
let _ = express.Router();

const { createTourist, getTourists, updateTourist, deleteTourist, redeemPoints } = require("../controllers/touristController");
const { get } = require("../controllers/museumsHistoricalPlacesController");
const activityController = require('../controllers/activityController');
const { getItineraries, sortByPrice, search, filter } = require('../controllers/itineraryController');
const productController = require('../controllers/productController');
const { getActivityCategory } = require('../controllers/activityCategoryController');
const {TourGuideComments,rateTourGuide } = require('../controllers/tourGuideController');
const { getPreferenceTags } = require('../controllers/preferenceTagContoller');
const { createBooking, getBookings, cancelBooking, payForBooking } = require('../controllers/bookingController');
const { createComplaint, getComplaintById, getComplaints } = require('../controllers/complaintController');

_.post("/add", createTourist);
_.get("/get", authenticate, getTourists);
_.put("/update", authenticate, updateTourist);
_.delete("/delete", authenticate, deleteTourist);
// _.get('/touristAttractions', getTouristView);

// -----------------Working apis ------------------- //
_.get('/getProducts', productController.getAllProducts);
_.get('/getActivity', activityController.getActivity);
_.get('/getItinerary', authenticate, getItineraries);
_.get("/getPlaces", authenticate, get);
_.get('/getCategory', authenticate, getActivityCategory)
_.get('/getTags', authenticate, getPreferenceTags)
_.patch('/Comment/:id', authenticate, activityController.activityComments);
_.patch('/tourGuideComment/:id', authenticate, TourGuideComments);
_.patch('/tourGuideRate/:id', authenticate, rateTourGuide);


_.patch('/addRatings/:id',authenticate, activityController.rateActivity);

_.patch('/ProductRatings/:id',authenticate, productController.rateProduct);
_.patch('/ProductReview/:id',authenticate, productController.reviewProduct);
// --------------- end working apis -----------------//

// -----------------New APIs --------------------- //
_.post('/BookEvent/:id', authenticate, createBooking);
_.get('/getBookings', authenticate, getBookings);
_.patch('/cancelBooking/:id', authenticate, cancelBooking);
_.patch('/payForBooking/:id', authenticate, payForBooking);
_.patch('/redeemPoints', authenticate, redeemPoints); // Add this line

// -----------------End New APIs ----------------- //

// ---------------- unused APIs ---------------------//
// _.get('/filterActivities', activityController.filterTouristActivities);
// _.get('/sortActivityByPrice', activityController.sortactivitestsByPrice);
// _.get('/sortActivityByRatings', activityController.sortactivitestsByRatings);

// _.get('/sortByPrice', sortByPrice);
// _.get('/itinerarySearch', search)
// _.get('/filterItinerary', filter);

// Complaint routes
_.post('/createComplaint', authenticate, createComplaint);
_.get('/getComplaintById/:id', authenticate, getComplaintById);
_.get('/getComplaints', authenticate, getComplaints);

module.exports = _;