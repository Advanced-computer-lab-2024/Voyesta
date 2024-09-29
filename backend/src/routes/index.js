const express = require('express');

let _ = express.Router();

// adding Activity Category Router
const activityCategoryRouter = require('./activityCategoryRouter');
_.use('/activityCategory', activityCategoryRouter);

// adding Preference Tag Router
const preferenceTagRouter = require('./preferenceTagRouter');
_.use('/preferenceTag', preferenceTagRouter);

module.exports = _;