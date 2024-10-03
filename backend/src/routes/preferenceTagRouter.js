const express = require('express');
const {
    createPreferenceTag,  
    getPreferenceTags, 
    updatePreferenceTag, 
    deletePreferenceTag
} = require('../controllers/preferenceTagContoller');

let _ = express.Router();

_.post('/add', createPreferenceTag);
_.get('/get', getPreferenceTags);
_.delete('/delete', deletePreferenceTag);
_.put('/update', updatePreferenceTag);

module.exports = _;