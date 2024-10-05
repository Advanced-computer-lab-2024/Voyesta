const express = require('express');

const {
    createActivityCategory, 
    getActivityCategory, 
    updateActivityCategory, 
    deleteActivityCategoryById
} = require('../controllers/activityCategoryController');


let _ = express.Router();

_.post('/add',createActivityCategory);
_.get('/get',getActivityCategory);
_.put('/update', updateActivityCategory);
_.delete('/delete',deleteActivityCategoryById);


module.exports = _;