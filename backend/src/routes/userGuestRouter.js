const express = require('express');
const userGuestRouter = express.Router();

const userGuestController = require('../controllers/userGuestController');

// Register a guest user
userGuestRouter.post('/registerGuestUser', userGuestController.registerGuestUser);
// Get all guest users
userGuestRouter.get('/getGuestUsers', userGuestController.getGuestUsers);

module.exports = userGuestRouter;