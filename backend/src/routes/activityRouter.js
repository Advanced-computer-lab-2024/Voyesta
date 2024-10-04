const express = require('express');
const activityRouter = express.Router();
const advertiserController = require('../controllers/advertiserController');

// Create an activity
activityRouter.post('/createActivity/:id', advertiserController.createActivity);
// Get all activities
activityRouter.get('/getActivity/:id', advertiserController.getActivity);
// Update an activity
activityRouter.put('/updateActivity:ID', advertiserController.updateActivity);
// Delete an activity
activityRouter.delete('/deleteActivity/:ID', advertiserController.deleteActivity);

module.exports = activityRouter;