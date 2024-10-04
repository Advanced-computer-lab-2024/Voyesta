const express = require("express");
const _ =  express.Router();

const advertiserRouter = require("../routes/advertiserRouter");
const sellerRouter = require("../routes/sellerRouter");
const tourGuideRouter = require("../routes/tourGuideRouter");
const touristRouter = require("../routes/touristRouter");

_.use("/advertiser",  advertiserRouter);
_.use("/seller",  sellerRouter);
_.use("/tourGuide",  tourGuideRouter);
_.use("/tourist",  touristRouter);


module.exports = _;