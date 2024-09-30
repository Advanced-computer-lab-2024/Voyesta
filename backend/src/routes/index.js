const express = require('express');
const router = express.Router();
const adminRouter = require('./adminRouter');
const touristRouter = require('./touristRouter');
const advertiserRouter = require('./advertiserRouter');
const sellerRouter = require('./sellerRouter');
const userGuestRouter = require('./userGuestRouter');
const tourGuideRouter = require('./tourGuideRouter');
const guestTouristRouter = require('./guestTouristRouter');


router.use('/admin', adminRouter);
router.use('/tourist', touristRouter);
router.use('/advertiser', advertiserRouter);
router.use('/seller', sellerRouter);
router.use('/userGuest', userGuestRouter);
router.use('/tourGuide', tourGuideRouter);
router.use('/guestTourist', guestTouristRouter);

module.exports = router;


