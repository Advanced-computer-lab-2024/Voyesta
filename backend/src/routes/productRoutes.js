// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products route
router.get('/getAllProducts', productController.getAllProducts);
router.post('/addProduct', productController.addProduct);
router.put('/updateProduct/:id', productController.updateProduct);

module.exports = router;
