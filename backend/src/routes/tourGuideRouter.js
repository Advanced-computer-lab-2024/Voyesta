const express = require("express");
let _ = express.Router();

const { createTourGuide, getTourGuides, updateTourGuide, deleteTourGuide } = require("../controllers/tourGuideController");

_.post("/add", createTourGuide);
_.get("/get", getTourGuides);
_.put("/update:/email", updateTourGuide);
_.delete("/delete:/email", deleteTourGuide);

module.exports = _;