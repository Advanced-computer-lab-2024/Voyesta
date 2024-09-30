// controllers/productController.js
const Product = require('../Models/product');

const addProduct = async (req, res) => {
    try {
        // Create a new product document from the request body
        const newProduct = new Product({
            name: req.body.name,
            picture: req.body.picture,
            price: req.body.price,
            description: req.body.description,
            seller: req.body.seller,
            ratings: req.body.ratings,
            reviews: req.body.reviews, // Assuming this is an array of review objects
            available_quantity: req.body.available_quantity
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        // Respond with the newly created product
        res.status(201).json({
            success: true,
            message: 'Product successfully added!',
            data: savedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding product',
            error: error.message
        });
    }
};

// Function to fetch all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().select('name picture price description seller ratings reviews'); // Fetches all products
        if(products.length !== 0){
            res.status(200).json({
                success: true,
                data: products
            });
        } else{
            res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving products',
            error: error.message
        });
    }
};

// Function to update a product by ID
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Get product ID from URL params

        // Find the product by ID and update it with the request body data
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            {   name: req.body.name,
                picture: req.body.picture,
                price: req.body.price,
                description: req.body.description,
                seller: req.body.seller,
                ratings: req.body.ratings,
                reviews: req.body.reviews, // Optional field if reviews are included
                available_quantity: req.body.available_quantity
            },
            { new: true, runValidators: true } // Options: return the updated document, apply validators
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Return the updated product data
        res.status(200).json({
            success: true,
            message: 'Product successfully updated!',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};


module.exports = { getAllProducts, addProduct, updateProduct }