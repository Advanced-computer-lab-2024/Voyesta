const express = require('express');
const cloudinaryController = require('../controllers/cloudinaryController');
const authenticate = require('../middleware/authenticate');

let _ = express.Router();

// Route to upload an image
_.post('/upload', authenticate, cloudinaryController.uploadImage);
_.post('/uploadId', authenticate, cloudinaryController.uploadId);
_.post('/uploadAdditionalDocument', authenticate, cloudinaryController.uploadAdditionalDocument);
_.post('/uploadِDocument', authenticate, cloudinaryController.uploadImage);
_.get('/image/:publicId', cloudinaryController.getDocument);

// Route to get an image by URL
// _.get('/image/:url', authenticate, cloudinaryController.getImage);

module.exports = _;