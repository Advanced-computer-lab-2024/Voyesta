const express = require("express");
let _ = express.Router();
const { createSeller, getSellers, updateSeller, deleteSeller } = require("../controllers/sellerController");

const {
    addProduct,
    getAllProducts,
    updateProduct,
    searchProductByName,
    filterProductsByPrice,
    sortProductsByRatings,
} = require('../controllers/productController');


_.post("/add", createSeller);
_.get("/get", getSellers);
_.put("/update", updateSeller);
_.delete("/delete", deleteSeller);

//------------------Products--------------------
_.post('/createProduct', addProduct);
_.get('/getAllProducts', getAllProducts);
_.put('/updateProduct', updateProduct);
_.get('/searchProductByName', searchProductByName);
_.get('/filterProductsByPrice', filterProductsByPrice);
_.get('/sortProductsByRatings', sortProductsByRatings);

module.exports = _;