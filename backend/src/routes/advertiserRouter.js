const express = require("express");
let _ = express.Router();
const authenticate = require('../middleware/authenticate');


const { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser } = require("../controllers/advertiserController");
const {createActivity, deleteActivity, updateActivity, getAllActivitiesByAdvertiser} =require("../controllers/activityController")
const { getActivityCategory } = require("../controllers/activityCategoryController");
const { getPreferenceTags } = require("../controllers/preferenceTagContoller");


_.post("/add", createAdvertiser);
_.get("/get", authenticate, getAdvertisers);
_.put("/update", authenticate, updateAdvertiser);
_.delete("/delete", authenticate, deleteAdvertiser);


_.post("/createActivity", authenticate, createActivity);
_.get("/getActivity", authenticate, getAllActivitiesByAdvertiser);
_.put("/updateActivity/:id", authenticate, updateActivity);
_.delete("/deleteActivity/:id", authenticate, deleteActivity);

_.get("/getActivityCategories", authenticate, getActivityCategory);
_.get("/getPreferenceTags", authenticate, getPreferenceTags);

module.exports = _;