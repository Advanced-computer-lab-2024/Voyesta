const express = require('express');
const router = express.Router();

// importing Routes
const adminRouter = require('./adminRoutes');
const productRouter = require('./productRoutes');
const activityCategoryRouter = require('./activityCategoryRouter');
const preferenceTagRouter = require('./preferenceTagRouter');

// POST route for creating a new tourism governor
router.use('/admin', adminRouter);
// adding products routes
router.use('/products', productRouter)


// adding Activity Category Router
router.use('/activityCategory', activityCategoryRouter);

// adding Preference Tag Router
router.use('/preferenceTag', preferenceTagRouter);



module.exports = router;