const express = require('express');
const activityRouter = express.Router();
const activityController = require('../controllers/activityController');

// Create an activity
activityRouter.post('/createActivity', activityController.createActivity);
// Get all activities
activityRouter.get('/getActivities', activityController.getActivities);
// Update an activity
activityRouter.put('/updateActivity/:id', activityController.updateActivity);
// Delete an activity
activityRouter.delete('/deleteActivity/:id', activityController.deleteActivity);

module.exports = activityRouter;
