const express = require('express');
const _ = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require("../middleware/authenticate");

const {
    createActivityCategory, 
    getActivityCategory, 
    updateActivityCategory, 
    deleteActivityCategoryById
} = require('../controllers/activityCategoryController');
const {
    createPreferenceTag,  
    getPreferenceTags, 
    updatePreferenceTag, 
    deletePreferenceTag
} = require('../controllers/preferenceTagContoller');
const productController = require('../controllers/productController');
const { getComplaints, getComplaintById, updateComplaintStatus, addReplyToComplaint } = require('../controllers/complaintController');


const { getItineraries, flagInappropriate} = require('../controllers/itineraryController');


// ------------- Not testedd ---------------
_.post('/createTourismGoverner', adminController.createTourismGovernor);
_.post('/createAdmin', adminController.createAdmin);
_.patch('/updatePassword', adminController.updatePassword);
_.delete('/deleteAccount', adminController.deleteAccount);


// ----- activity category --------//
_.post('/addActivityCategory',createActivityCategory);
_.get('/getActivityCategory',getActivityCategory);
_.put('/updateActivityCategory', updateActivityCategory);
_.delete('/deleteActivityCategory',deleteActivityCategoryById);

// -------- Preference tags ------------//
_.post('/addPrefernceTag',createPreferenceTag);
_.get('/getPrefernceTag',getPreferenceTags);
_.put('/updatePrefernceTag', updatePreferenceTag);
_.delete('/deletePrefernceTag',deletePreferenceTag);

// ------------ Products ---------------- //
_.get('/getProducts', productController.getAllProducts);
_.get('/getMyProducts', productController.getMyProducts);
_.post('/addProduct', productController.addProduct);
_.put('/updateProduct/:id', productController.updateProduct);
_.get('/searchProducts', productController.searchProductByName);
_.get('/filterProductsByPrice', productController.filterProductsByPrice);
_.get('/sortProductsByRatings', productController.sortProductsByRatings);
_.get('/getProductsMinAndMax', productController.getMinAndMaxPrices);


// ------------ Itineraries ---------------- //
_.get('/getItinerary', authenticate, getItineraries);
_.patch('/flagInappropriate/:id', authenticate, flagInappropriate);


_.get('/getComplaints', getComplaints);
_.get('/getComplaintById/:id', getComplaintById);
_.patch('/updateComplaintStatus/:id', updateComplaintStatus);
_.patch('/replyToComplaint/:id', addReplyToComplaint);

module.exports = _;