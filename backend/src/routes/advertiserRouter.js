const express = require("express");
let _ = express.Router();
const authenticate = require('../middleware/authenticate');


const { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser } = require("../controllers/advertiserController");
const {createActivity, deleteActivity, updateActivity, getAllActivitiesByAdvertiser, updateBookingEnabledStatus, getBookingStatus} =require("../controllers/activityController")
const { getActivityCategory } = require("../controllers/activityCategoryController");
const { getPreferenceTags } = require("../controllers/preferenceTagContoller");
const { changePassword, setStatusToDeleted } = require('../controllers/accountController');
const cloudinaryController = require('../controllers/cloudinaryController');
const { getRevenue, getBookingsReport } = require('../controllers/revenueController');
const { getNotifications } = require('../controllers/NotificationController');

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

_.patch('/changePassword', authenticate, changePassword);
_.patch('/setStatusToDeleted', authenticate, setStatusToDeleted);
_.post('/uploadProfilePicture', authenticate, cloudinaryController.uploadImage);

_.get('/getRevenue', authenticate, getRevenue);
_.get('/getBookingsReport', authenticate, getBookingsReport);
_.get('/getNotifications', authenticate, getNotifications);

_.patch('/updateBookingEnabled/:id', updateBookingEnabledStatus);
_.get('/:id/booking-status', authenticate, getBookingStatus);

module.exports = _;