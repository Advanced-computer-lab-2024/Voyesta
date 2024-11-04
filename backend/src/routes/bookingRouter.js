// backend/src/routes/bookingRouter.js
const express = require('express');
const { createBooking, getBookings } = require('../controllers/bookingController');
const authenticate = require('../middleware/authenticate');

let _ = express.Router();

_.post('/create/:id', authenticate, createBooking);
_.get('/get', authenticate, getBookings);

module.exports = _;