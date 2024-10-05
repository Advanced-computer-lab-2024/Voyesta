const express = require('express');
const tourismGovernerRouter = express.Router();

const tourismGovernerController = require('../controllers/tourismGovernerController');

// Create a place of interest
tourismGovernerRouter.post('/createPlaceOfInterest/:id', tourismGovernerController.createPlaceOfInterest);
// Get all places of interest
tourismGovernerRouter.get('/getAllPlacesOfInterest/:id', tourismGovernerController.getAllPlacesOfInterest);
// Get a place of interest
tourismGovernerRouter.get('/getPlaceOfInterest/:id', tourismGovernerController.getPlaceOfInterest);
// Update a place of interest
tourismGovernerRouter.put('/updatePlaceOfInterest/:id', tourismGovernerController.updatePlaceOfInterest);
// Delete a place of interest
tourismGovernerRouter.delete('/deletePlaceOfInterest/:id', tourismGovernerController.deletePlaceOfInterest);
//create tags for museums and historical places
tourismGovernerRouter.post('/createTags/:id', tourismGovernerController.createTagsForPlaceOfInterest);

module.exports = tourismGovernerRouter;
