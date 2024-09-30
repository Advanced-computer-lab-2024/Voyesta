const express = require('express');
const tourGuideRouter = express.Router();
const tourGuideController = require('../controllers/tourGuideController');

// Create a tour guide
tourGuideRouter.post('/createTourGuide', tourGuideController.createTourGuide);
// Get all tour guides
tourGuideRouter.get('/getTourGuides', tourGuideController.getTourGuides);
// Update a tour guide
tourGuideRouter.put('/updateTourGuide/:email', tourGuideController.updateTourGuide);
// Delete a tour guide
tourGuideRouter.delete('/deleteTourGuide/:email', tourGuideController.deleteTourGuide);

module.exports = tourGuideRouter;