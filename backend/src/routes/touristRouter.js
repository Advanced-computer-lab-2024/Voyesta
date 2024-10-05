const express = require("express");
let _ = express.Router();

const { createTourist, getTourists, updateTourist, deleteTourist, filterTouristActivities,getTouristView } = require("../controllers/touristController");

_.post("/add", createTourist);
_.get("/get", getTourists);
_.put("/update", updateTourist);
_.delete("/delete", deleteTourist);
_.get('/filterActivities', filterTouristActivities);
_.get('/touristAttractions', getTouristView);



module.exports = _;