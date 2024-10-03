const express = require('express');
const advertiserRouter = express.Router();
const advertiserController = require('../controllers/advertiserController');

// Create an advertiser
advertiserRouter.post('/createAdvertiser', advertiserController.createAdvertiser);
// Get all advertisers
advertiserRouter.get('/getAdvertisers', advertiserController.getAdvertisers);
// Update an advertiser
advertiserRouter.put('/updateAdvertiser/:email', advertiserController.updateAdvertiser);
// Delete an advertiser
advertiserRouter.delete('/deleteAdvertiser/:email', advertiserController.deleteAdvertiser);

module.exports = advertiserRouter;
