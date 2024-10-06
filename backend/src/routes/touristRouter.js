const express = require("express");
const authenticate = require("../middleware/authenticate");
let _ = express.Router();

const { createTourist, getTourists, updateTourist, deleteTourist, filterTouristActivities,getTouristView } = require("../controllers/touristController");

_.post("/add", createTourist);
_.get("/get",authenticate ,getTourists);
_.put("/update", authenticate,updateTourist);
_.delete("/delete", authenticate,deleteTourist);
_.get('/touristAttractions', getTouristView);



module.exports = _;