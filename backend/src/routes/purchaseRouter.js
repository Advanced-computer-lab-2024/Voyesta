// routes/purchaseRouter.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authenticate = require("../middleware/authenticate");

router.post('/create', purchaseController.createPurchase);
router.get('/get', authenticate, purchaseController.getPurchases);
router.get('/:id', authenticate, purchaseController.getPurchaseById);
router.put('/:id', authenticate, purchaseController.updatePurchase);
router.delete('/:id', authenticate, purchaseController.deletePurchase);

module.exports = router;