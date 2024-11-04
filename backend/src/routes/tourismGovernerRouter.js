const express = require('express');
const authenticate = require('../middleware/authenticate'); 
const _ = express.Router();
const {
    create,
    get,
    update,
    remove,
    addTag,
    search
} = require('../controllers/museumsHistoricalPlacesController');
const { createPreferenceTag } = require('../controllers/preferenceTagContoller')

_.post("/add", authenticate,create);
_.get("/getPlaces",authenticate, get);
_.patch("/updatePlace/:id", authenticate,update);
_.delete("/deletePlace/:id", authenticate,remove);
_.post("/addTag",authenticate, createPreferenceTag);
_.get("/search", search);

module.exports = _;
