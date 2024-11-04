const express = require("express");
let _ = express.Router();
const { createSeller, getSeller, updateSeller, deleteSeller } = require("../controllers/sellerController");
const authenticate = require("../middleware/authenticate");
const {
    addProduct,
    getAllProducts,
    updateProduct,
    searchProductByName,
    filterProductsByPrice,
    sortProductsByRatings,
    getMyProducts
} = require('../controllers/productController');
const { changePassword } = require('../controllers/accountController');



_.post("/add", createSeller);
_.get("/get", authenticate, getSeller);
_.put("/update", authenticate, updateSeller);
_.delete("/delete", authenticate, deleteSeller);

//------------------Products--------------------
_.post('/createProduct', authenticate ,addProduct);
_.get('/getAllProducts', getAllProducts);
_.get('/getMyProducts', authenticate ,getMyProducts);
_.put('/updateProduct/:id', authenticate , updateProduct);
_.get('/searchProductByName', searchProductByName);
_.get('/filterProductsByPrice', filterProductsByPrice);
_.get('/sortProductsByRatings', sortProductsByRatings);

_.patch('/changePassword', authenticate, changePassword);

module.exports = _;