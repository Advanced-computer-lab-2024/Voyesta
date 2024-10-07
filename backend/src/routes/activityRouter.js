const express = require('express');
const activityRouter = express.Router();
const activityController = require('../controllers/activityController');

// Create an activity
activityRouter.post('/add', activityController.createActivity);
// Get all activities
activityRouter.get('/get', activityController.getActivity);

activityRouter.get('/getByAdvertiser', activityController.getAllActivitiesByAdvertiser);
// Update an activity
activityRouter.patch('/update/:id', activityController.updateActivity);
// Delete an activity
activityRouter.delete('/delete/:id', activityController.deleteActivity);
// Get all activities sorted by price
activityRouter.get('/sortByPrice', activityController.sortactivitestsByPrice);
// Get all activities sorted by Ratings
activityRouter.get('/sortByRatings', activityController.sortactivitestsByRatings);

activityRouter.get('/filterActivities', activityController.filterTouristActivities);

activityRouter.get('/search', activityController.search);



module.exports = activityRouter;
