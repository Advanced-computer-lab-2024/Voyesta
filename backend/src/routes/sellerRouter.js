const express = require("express");
let _ = express.Router();
const { createSeller, getSeller, updateSeller, deleteSeller } = require("../controllers/sellerController");
const authenticate = require("../middleware/authenticate");
const {
    addProduct,
    updateProduct,
    getProducts,
    getProductSales,
    archiveProduct,
    unarchiveProduct,
    searchProductByName,
    getAllProducts,
} = require('../controllers/productController');
const { changePassword, setStatusToDeleted } = require('../controllers/accountController');
const cloudinaryController = require('../controllers/cloudinaryController');
const adminController = require('../controllers/adminController');
const { getRevenue } = require('../controllers/revenueController');
const { getNotifications } = require('../controllers/NotificationController');


_.post("/add", createSeller);
_.get("/get", authenticate, getSeller);
_.put("/update", authenticate, updateSeller);
_.delete("/delete", authenticate, deleteSeller);

//------------------Products--------------------
_.post('/createProduct', authenticate ,addProduct);
_.get('/getAllProducts', authenticate, getAllProducts);
_.get('/getMyProducts', authenticate ,getProducts);
_.get('/getProductsSales', authenticate , getProductSales);
_.put('/updateProduct/:id', authenticate , updateProduct);
_.patch('/archiveProduct/:id', authenticate, archiveProduct);
_.patch('/unarchiveProduct/:id', authenticate, unarchiveProduct);

_.get('/searchProductByName', searchProductByName);
// _.get('/filterProductsByPrice', filterProductsByPrice);
// _.get('/sortProductsByRatings', sortProductsByRatings);

_.patch('/changePassword', authenticate, changePassword);
_.patch('/setStatusToDeleted', authenticate, setStatusToDeleted);
_.post('/uploadProfilePicture', authenticate, cloudinaryController.uploadImage);
_.get('/CheckStock', adminController.checkProductStockLevels);

_.get('/getRevenue', authenticate, getRevenue);
_.get('/getNotifications', authenticate, getNotifications);


module.exports = _;