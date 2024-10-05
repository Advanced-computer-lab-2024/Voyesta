const express = require("express");
let _ = express.Router();


const { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser } = require("../controllers/advertiserController");
const {createActivity, deleteActivity, updateActivity, getAllActivitiesByAdvertiser} =require("../controllers/activityController")

_.post("/add", createAdvertiser);
_.get("/get", getAdvertisers);
_.patch("/update", updateAdvertiser);
_.delete("/delete", deleteAdvertiser);


_.post("/addActivity", createActivity);
_.get("/getActivity", getAllActivitiesByAdvertiser);
_.patch("/updateActivity", updateActivity);
_.delete("/deleteActivity", deleteActivity);

module.exports = _;