// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { convertPrices } = require('../services/exchangeRateService');

// GET all products route
router.get('/get', productController.getProducts);
router.post('/add', productController.addProduct);
router.put('/update/:id', productController.updateProduct);
router.get('/search', productController.searchProductByName);
router.get('/filterByPrice', productController.filterProductsByPrice);
router.get('/sortByRatings', productController.sortProductsByRatings);
router.get('/priceMinAndMax', productController.getMinAndMaxPrices);
router.post('/convertPrices', convertPrices);

// testing 
// router.post("/addTourist",touristController.createTourist)
module.exports = router;
