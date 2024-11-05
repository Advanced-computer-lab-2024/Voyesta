const express = require("express");
let _ = express.Router();
const { createSeller, getSeller, updateSeller, deleteSeller } = require("../controllers/sellerController");
const authenticate = require("../middleware/authenticate");
const productController = require('../controllers/productController');
const { changePassword } = require('../controllers/accountController');



_.post("/add", createSeller);
_.get("/get", authenticate, getSeller);
_.put("/update", authenticate, updateSeller);
_.delete("/delete", authenticate, deleteSeller);

//------------------Products--------------------
_.post('/createProduct', authenticate ,productController.addProduct);
_.get('/getAllProducts', productController.getProducts);
_.get('/getMyProducts', authenticate ,productController.getProducts);
_.put('/updateProduct/:id', authenticate , productController.updateProduct);
_.get('/getProductsSales', authenticate, productController.getProductSales);




// _.get('/searchProductByName', productController.searchProductByName);
// _.get('/filterProductsByPrice', productController.filterProductsByPrice);

module.exports = _;