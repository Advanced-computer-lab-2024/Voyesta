const express = require("express");
const authenticate = require("../middleware/authenticate");
let _ = express.Router();

const { createTourist, getTourists, updateTourist, deleteTourist} = require("../controllers/touristController");
const { get} = require("../controllers/museumsHistoricalPlacesController");
const activityController = require('../controllers/activityController');
const { getItinerary, sortByPrice, search, filter } = require('../controllers/itineraryController');
const productController = require('../controllers/productController');
const { getActivityCategory } = require('../controllers/activityCategoryController');
const { getPreferenceTags } = require('../controllers/preferenceTagContoller');

_.post("/add", createTourist);
_.get("/get",authenticate ,getTourists);
_.put("/update", authenticate,updateTourist);
_.delete("/delete", authenticate,deleteTourist);
// _.get('/touristAttractions', getTouristView);




// -----------------Working apis ------------------- //
_.get('/getProducts', productController.getAllProducts);

_.get('/getActivity', activityController.getActivity);
_.get('/getItinerary', getItinerary);
_.get("/getPlaces", get);
_.get('/getCategory', getActivityCategory)
_.get('/getTags', getPreferenceTags)

_.patch('/addRatings/:id',authenticate, activityController.rateActivity);

_.patch('/ProductRatings/:id',authenticate, productController.rateProduct);
_.patch('/ProductReview/:id',authenticate, productController.reviewProduct);
// --------------- end working apis -----------------//


// ---------------- unused APIs ---------------------//
_.get('/filterActivities', activityController.filterTouristActivities);
_.get('/sortActivityByPrice', activityController.sortactivitestsByPrice);
_.get('/sortActivityByRatings', activityController.sortactivitestsByRatings);


_.get('/sortByPrice', sortByPrice);
_.get('/itinerarySearch', search)
_.get('/filterItinerary', filter);


module.exports = _;