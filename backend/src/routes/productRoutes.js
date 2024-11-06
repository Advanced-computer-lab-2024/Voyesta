// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products route
router.get('/get', productController.getProducts);
router.post('/add', productController.addProduct);
router.put('/update/:id', productController.updateProduct);
router.get('/search', productController.searchProductByName);
router.get('/filterByPrice', productController.filterProductsByPrice);
router.get('/sortByRatings', productController.sortProductsByRatings);
router.get('/priceMinAndMax', productController.getMinAndMaxPrices);

// testing 
// router.post("/addTourist",touristController.createTourist)
module.exports = router;
