const express = require("express");
let _ = express.Router();
const { createSeller, getSellers, updateSeller, deleteSeller } = require("../controllers/sellerController");


_.post("/add", createSeller);
_.get("/get", getSellers);
_.put("/update", updateSeller);
_.delete("/delete", deleteSeller);

module.exports = _;