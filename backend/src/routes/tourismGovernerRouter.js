const express = require('express');
const _ = express.Router();
const {
    create,
    get,
    update,
    remove,
    addTag,
    search
} = require('../controllers/museumsHistoricalPlacesController');

_.post("/add", create);
_.get("/get/:id", get);
_.patch("/update/:id", update);
_.delete("/delete/:id", remove);
_.post("/addTag/:id", addTag);
_.get("/search", search);

module.exports = _;
