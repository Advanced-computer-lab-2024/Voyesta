const express = require('express');
const activityRouter = express.Router();
const advertiserController = require('../controllers/advertiserController');

// Create an activity
activityRouter.post('/createActivity/:id', advertiserController.createActivity);
// Get all activities
activityRouter.get('/getActivities', advertiserController.getActivity);
// Update an activity
activityRouter.put('/updateActivity/:id', advertiserController.updateActivity);
// Delete an activity
activityRouter.delete('/deleteActivity/:id', advertiserController.deleteActivity);
// Get all activities sorted by price
activityRouter.get('/sortactivitiesp', advertiserController.sortactivitestsByPrice);
// Get all activities sorted by Ratings
activityRouter.get('/sortactivitiesr', advertiserController.sortactivitestsByRatings);



module.exports = activityRouter;
