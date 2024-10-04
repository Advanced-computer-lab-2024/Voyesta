const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

//const adminRouter = require('./adminRouter');
const touristRouter = require('./touristRouter');
const advertiserRouter = require('./advertiserRouter');
const sellerRouter = require('./sellerRouter');
const userRouter = require('./userRouter');
const tourGuideRouter = require('./tourGuideRouter');
//const activityRouter = require('./activityRouter');

//router.use('/admin', adminRouter);
router.use('/tourist', touristRouter);
router.use('/advertiser', advertiserRouter);
router.use('/seller', sellerRouter);
router.use('/userGuest', userRouter);
router.use('/tourGuide', tourGuideRouter);
//router.use('/activity', activityRouter);


// protected route
// router.get('/protected',authenticate, (req, res) => {
//     res.status(200).json({ message: 'Protected route' });
// });

module.exports = router;


