const express = require('express');
const touristRouter = express.Router();
const touristController = require('../controllers/touristController');

// Create a tourist
touristRouter.post('/createTourist', touristController.createTourist);

// Get all tourists
touristRouter.get('/getTourists', touristController.getTourists);

// Get a tourist by username
touristRouter.get('/getTourist/:id', touristController.getTourist);  
                                 // the :Username is a parameter that will be passed to the controller
// Update a tourist by username
touristRouter.put('/updateTourist/:id', touristController.updateTourist);

// Delete a tourist by username
touristRouter.delete('/deleteTourist/:id', touristController.deleteTourist);

module.exports = touristRouter; 