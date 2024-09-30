const express = require('express');
const sellerRouter = express.Router();
const sellerController = require('../controllers/sellerController');

// Create a seller
sellerRouter.post('/createSeller', sellerController.createSeller);
// Get all sellers
sellerRouter.get('/getSellers', sellerController.getSellers);
// Update a seller
sellerRouter.put('/updateSeller/:email', sellerController.updateSeller);
// Delete a seller
sellerRouter.delete('/deleteSeller/:email', sellerController.deleteSeller);

module.exports = sellerRouter;