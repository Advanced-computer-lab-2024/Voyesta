const express = require("express");
let _ = express.Router();
const authenticate = require('../middleware/authenticate');


const { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser } = require("../controllers/advertiserController");
const {createActivity, deleteActivity, updateActivity, getAllActivitiesByAdvertiser} =require("../controllers/activityController")

_.post("/add", createAdvertiser);
_.get("/get", authenticate, getAdvertisers);
_.put("/update", authenticate, updateAdvertiser);
_.delete("/delete", authenticate, deleteAdvertiser);


_.post("/addActivity", authenticate, createActivity);
_.get("/getActivity", authenticate, getAllActivitiesByAdvertiser);
_.patch("/updateActivity/:id", authenticate, updateActivity);
_.delete("/deleteActivity/:id", authenticate, deleteActivity);

module.exports = _;