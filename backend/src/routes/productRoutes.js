// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products route
router.get('/getAllProducts', productController.getAllProducts);
router.post('/addProduct', productController.addProduct);
router.put('/updateProduct/:id', productController.updateProduct);
router.get('/search', productController.searchProductByName);
router.get('/filterByPrice', productController.filterProductsByPrice);
router.get('/sortByRatings', productController.sortProductsByRatings);

module.exports = router;
