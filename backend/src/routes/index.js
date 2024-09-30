const express = require('express');
const router = express.Router();
const adminRouter = require('./adminRoutes');
const productRouter = require('./productRoutes');

// POST route for creating a new tourism governor
router.use('/admin', adminRouter);
router.use('/products', productRouter)

module.exports = router;