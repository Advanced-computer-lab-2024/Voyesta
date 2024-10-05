const express = require('express');
const _ = express.Router();

const adminController = require('../controllers/adminController');

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

// ------------- Not testedd ---------------
_.post('/createTourismGoverner', adminController.createTourismGovernor);
_.post('/createAdmin', adminController.createAdmin);
_.patch('/updatePassword', adminController.updatePassword);
_.delete('/deleteAccount', adminController.deleteAccount);

_.post('/addActivityCategory',createActivityCategory);
_.get('/getActivityCategory',getActivityCategory);
_.put('/updateActivityCategory', updateActivityCategory);
_.delete('/deleteActivityCategory',deleteActivityCategoryById);

_.post('/addPrefernceTag',createPreferenceTag);
_.get('/getPrefernceTag',getPreferenceTags);
_.put('/updatePrefernceTag', updatePreferenceTag);
_.delete('/deletePrefernceTag',deletePreferenceTag);

_.get('/getProducts', productController.getAllProducts);
_.post('/addProduct', productController.addProduct);
_.put('/updateProduct/:id', productController.updateProduct);
_.get('/searchProducts', productController.searchProductByName);
_.get('/filterProductsByPrice', productController.filterProductsByPrice);
_.get('/sortProductsByRatings', productController.sortProductsByRatings);
_.get('/getProductsMinAndMax', productController.getMinAndMaxPrices);


module.exports = _;