const express = require("express");
let _ = express.Router();


const { createAdvertiser, getAdvertisers, updateAdvertiser, deleteAdvertiser } = require("../controllers/advertiserController");

_.post("/add", createAdvertiser);
_.get("/get", getAdvertisers);
_.put("/update", updateAdvertiser);
_.delete("/delete", deleteAdvertiser);

module.exports = _;