// ---- zeiad work ---------
const express = require('express');
const _ = express.Router();

// importing Routes
const adminRouter = require('./adminRoutes');
const productRouter = require('./productRoutes');
const activityCategoryRouter = require('./activityCategoryRouter');
const preferenceTagRouter = require('./preferenceTagRouter');

// POST route for creating a new tourism governor
_.use('/admin', adminRouter);
// adding products routes
_.use('/products', productRouter)


// adding Activity Category Router
_.use('/activityCategory', activityCategoryRouter);

// adding Preference Tag Router
_.use('/preferenceTag', preferenceTagRouter);

// new added 



const advertiserRouter = require("../routes/advertiserRouter");
const sellerRouter = require("../routes/sellerRouter");
const tourGuideRouter = require("../routes/tourGuideRouter");
const touristRouter = require("../routes/touristRouter");
const activityRouter = require("../routes/activityRouter");
const tourismGovernerRouter = require("./tourismGovernerRouter");
const userGuestRouter = require("./userGuestRouter");

_.use("/advertiser",  advertiserRouter);
_.use("/seller",  sellerRouter);
_.use("/tourGuide",  tourGuideRouter);
_.use("/tourist",  touristRouter);
_.use("/activity",  activityRouter);
_.use("/tourismGoverner",  tourismGovernerRouter);
_.use("/guest",  userGuestRouter);


module.exports = _;

