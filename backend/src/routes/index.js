// ---- zeiad work ---------
const express = require('express');
const _ = express.Router();

// importing Routes
const adminRouter = require('./adminRoutes');
const productRouter = require('./productRoutes');
const activityCategoryRouter = require('./activityCategoryRouter');
const preferenceTagRouter = require('./preferenceTagRouter');
const iteneraryRouter = require('./itineraryRouter');



// POST route for creating a new tourism governor
_.use('/admin', adminRouter);

// adding products routes
_.use('/product', productRouter)

// adding Activity Category Router
_.use('/activityCategory', activityCategoryRouter);

// adding Preference Tag Router
_.use('/preferenceTag', preferenceTagRouter);

// new added 



const advertiserRouter = require("./advertiserRouter");
const sellerRouter = require("./sellerRouter");
const tourGuideRouter = require("./tourGuideRouter");
const touristRouter = require("./touristRouter");
const activityRouter = require("./activityRouter");
const tourismGovernerRouter = require("./tourismGovernerRouter");
const userGuestRouter = require("./userGuestRouter");
const museumsHistoricalPlacesRouter = require("./museumsHistoricalPlacesRouter");
const categoryRouter = require("./activityCategoryRouter");
const authenticate = require('../middleware/authenticate');
const bookingRouter = require('./bookingRouter');

_.use("/advertiser",  advertiserRouter);
_.use("/seller",  sellerRouter);
_.use("/tourGuide",  tourGuideRouter);
_.use("/tourist",  touristRouter);
_.use("/activity",  activityRouter);
_.use("/tourismGoverner",  tourismGovernerRouter);
_.use("/guest",  userGuestRouter);
_.use('/itinerary', iteneraryRouter);
_.use('/category', categoryRouter);
_.use("/museumsHistoricalPlaces",  museumsHistoricalPlacesRouter);
_.use('/bookings', bookingRouter);

_.get("/user",authenticate,  (req, res) => {
    res.status(200).json({
        user: req.user
    })
});

const login = require('../controllers/LoginController');

_.post("/login",  login.Login);


module.exports = _;
