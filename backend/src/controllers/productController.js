// controllers/productController.js
const Product = require('../Models/product');
const Seller = require('../Models/Seller');

const addProduct = async (req, res) => {
    const id = req.user.id;
    const role = req.user.type;

    try {
        // Ensure the user is a seller before adding the product
        let seller = "";

        if (role === 'seller') {
            seller = await Seller.findById(id).select('name'); // Assuming 'User' is the seller's model and 'name' is the seller's name field
        } else if (role === 'admin') {
            seller = 'admin';
        } else {
            return res.status(403).json({
                success: false,
                message: 'Only sellers or Admins can add products'
            });
        }

        // Fetch the seller's name from the database by their ID
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        // Create a new product document from the request body
        const newProduct = new Product({
            name: req.body.name,
            picture: req.body.picture,
            price: req.body.price,
            description: req.body.description,
            seller: seller.name, // Use the seller's name
            ratings: req.body.ratings,
            reviews: req.body.reviews, // Assuming this is an array of review objects
            available_quantity: req.body.available_quantity,
            createdBy: {
                _id: id,
                role: role
            }
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

// Combined function to fetch products based on user role
const getProducts = async (req, res) => {
    try {
        let products;
        if(!req.user) {
            products = await Product.find({ isArchived: false }).select();
        }else{
            const userId = req.user.id;
            const userType = req.user.type;

            if (userType === 'tourist') {
                // Fetch all unarchived products for tourists
                products = await Product.find({ isArchived: false }).select();
            } else if (userType === 'admin') {
                // Fetch all products for admins
                products = await Product.find().select();
            } else if (userType === 'seller') {
                // Fetch products created by the seller
                products = await Product.find({
                    'createdBy._id': userId,
                    'createdBy.role': userType
                }).select();
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized access'
                });
            }
        }

        if (products.length !== 0) {
            res.status(200).json({
                success: true,
                data: products
            });
        } else {
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

        // check if admin or seller
        if (req.user.type == 'admin') {
            // do the logic
        }

        const product = await Product.findOne({
            _id: productId,
            'createdBy._id': req.user.id,    // Check if the product was created by this user
            'createdBy.role': req.user.type  // Check if the role matches (e.g., 'Seller' or 'Admin')
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or you do not have permission to update this product'
            });
        }

        // Find the product by ID and update it with the request body data
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name: req.body.name,
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

const searchProductByName = async (req, res) => {
    try {
        const searchQuery = String(req.query.name); // Get the name from the query parameters

        // Find products where the name contains the search query (case-insensitive)
        const products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' } // 'i' makes it case-insensitive
        });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found matching the search query'
            });
        }

        // Return the list of matching products
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status500.json({
            success: false,
            message: 'Error searching for products',
            error: error.message
        });
    }
};

const filterProductsByPrice = async (req, res) => {
    try {
        // Get minPrice and maxPrice from query params (or use default values)
        const minPrice = parseFloat(req.query.minPrice) || 0; // Default to 0 if not provided
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity; // Default to Infinity if not provided

        // Find products within the price range
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found in the specified price range'
            });
        }

        // Return the filtered list of products
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error(`Error filtering products by price: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error filtering products by price',
            error: error.message
        });
    }
};

const sortProductsByRatings = async (req, res) => {
    try {
        // Retrieve products sorted by ratings in descending order (highest to lowest)
        const products = await Product.find().sort({ ratings: -1 });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        // Return the sorted products
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error(`Error sorting products by ratings: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error sorting products by ratings',
            error: error.message
        });
    }
};

const getMinAndMaxPrices = async (req, res) => {
    try {
        // Find the minimum and maximum prices
        const minAndMaxPrices = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ]);

        if (minAndMaxPrices.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        // Return the minimum and maximum prices
        res.status(200).json({
            success: true,
            data: minAndMaxPrices[0]
        });
    } catch (error) {
        console.error(`Error getting min and max prices: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Error getting min and max prices',
            error: error.message
        });
    }
};

const rateProduct = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
        const product = await Product.findById(id).populate('ratings reviews');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the user has already rated the product
        const existingRating = product.ratings.find(r => r.tourist.toString() === req.user.id);
        if (existingRating) {
            // Update the existing rating
            existingRating.rating = rating;
        } else {
            // Add a new rating
            product.ratings.push({
                tourist: req.user.id,
                rating
            });
        }

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const reviewProduct = async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the user has already reviewed the product
        const existingReview = product.reviews.find(r => r.tourist.toString() === req.user.id);
        if (existingReview) {
            // Update the existing review
            existingReview.review = review;
        } else {
            // Add a new review
            product.reviews.push({
                tourist: req.user.id,
                review
            });
        }

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const archiveProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, { isArchived: true }, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product archived successfully', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error archiving product', error: error.message });
    }
};

const unarchiveProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, { isArchived: false }, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product unarchived successfully', data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error unarchiving product', error: error.message });
    }
};

module.exports = { 
    getProducts, 
    addProduct, 
    updateProduct, 
    searchProductByName, 
    filterProductsByPrice, 
    sortProductsByRatings, 
    getMinAndMaxPrices, 
    rateProduct,
    reviewProduct,
    archiveProduct,
    unarchiveProduct
};