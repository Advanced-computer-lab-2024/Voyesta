const express = require("express");
const authenticate = require("../middleware/authenticate");
let _ = express.Router();

const { createTourist, getTourists, updateTourist, deleteTourist} = require("../controllers/touristController");
const { get} = require("../controllers/museumsHistoricalPlacesController");
const activityController = require('../controllers/activityController');
const { getItinerary, sortByPrice } = require('../controllers/itineraryController');


_.post("/add", createTourist);
_.get("/get",authenticate ,getTourists);
_.put("/update", authenticate,updateTourist);
_.delete("/delete", authenticate,deleteTourist);
_.get('/touristAttractions', getTouristView);

_.get("/getMuseumsHistoricalPlaces/:id", get);

_.get('/getActivity/:id', activityController.getActivity);
_.get('/filterActivities', activityController.filterTouristActivities);
_.get('/sortActivityByPrice', activityController.sortactivitestsByPrice);
_.get('/sortActivityByRatings', activityController.sortactivitestsByRatings);



_.get('/getItinerary/:id', getItinerary);
_.get('/sortByPrice', sortByPrice);


module.exports = _;