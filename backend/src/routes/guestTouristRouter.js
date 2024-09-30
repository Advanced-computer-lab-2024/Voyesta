const express = require('express');
const guestTouristRouter = express.Router();
const guestTouristController = require('../controllers/guestTouristController');

// Register a tourist guest
guestTouristRouter.post('/registerTouristGuest', guestTouristController.registerTouristGuest);
// Get all tourist guests
guestTouristRouter.get('/getTouristGuests', guestTouristController.getTouristGuests);

module.exports = guestTouristRouter;