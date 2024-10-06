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

_.post("/add", authenticate,create);
_.get("/get/:id", get);
_.patch("/update/:id", authenticate,update);
_.delete("/delete/:id", authenticate,remove);
_.post("/addTag/:id",authenticate, addTag);
_.get("/search", search);

module.exports = _;
