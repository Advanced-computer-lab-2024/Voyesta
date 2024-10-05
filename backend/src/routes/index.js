const express = require("express");
const _ =  express.Router();

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