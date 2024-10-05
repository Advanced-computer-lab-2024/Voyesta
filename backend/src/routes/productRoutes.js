// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const touristController = require('../controllers/touristController');

// GET all products route
router.get('/getAllProducts', productController.getAllProducts);
router.post('/addProduct', productController.addProduct);
router.put('/updateProduct/:id', productController.updateProduct);
router.get('/search', productController.searchProductByName);
router.get('/filterByPrice', productController.filterProductsByPrice);
router.get('/sortByRatings', productController.sortProductsByRatings);
router.get('/priceMinAndMax', productController.getMinAndMaxPrices);

// testing 
// router.post("/addTourist",touristController.createTourist)
module.exports = router;
