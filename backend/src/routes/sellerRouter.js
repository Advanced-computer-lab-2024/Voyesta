const express = require("express");
let _ = express.Router();
const { createSeller, getSeller, updateSeller, deleteSeller } = require("../controllers/sellerController");

const {
    addProduct,
    getAllProducts,
    updateProduct,
    searchProductByName,
    filterProductsByPrice,
    sortProductsByRatings,
    getMyProducts
} = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');


_.post("/add", createSeller);
_.get("/get", authenticate, getSeller);
_.put("/update", authenticate, updateSeller);
_.delete("/delete", authenticate, deleteSeller);

//------------------Products--------------------
_.post('/createProduct', addProduct);
_.get('/getAllProducts', getAllProducts);
_.get('/getMyProducts', getMyProducts);
_.put('/updateProduct/:id', updateProduct);
_.get('/searchProductByName', searchProductByName);
_.get('/filterProductsByPrice', filterProductsByPrice);
_.get('/sortProductsByRatings', sortProductsByRatings);

module.exports = _;