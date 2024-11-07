const express = require("express");
let _ = express.Router();

const { create, get, update, remove, addTag, filterByTag, getMuseumOrHistoricalPlaceById,search} = require("../controllers/museumsHistoricalPlacesController");

_.post("/add/:id", create);
_.get("/get/:id", get);
_.get("/getById/:id", getMuseumOrHistoricalPlaceById);
_.patch("/update/:id", update);
_.delete("/delete/:id", remove);
_.post("/addTag/:id", addTag);
_.get("/search", search);
_.get("/filterByTag", filterByTag);

module.exports = _;