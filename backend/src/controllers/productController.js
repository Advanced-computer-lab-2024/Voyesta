const Product = require('../Models/product');
const Seller = require('../Models/Seller');
const touristModel = require('../Models/Tourist'); // Adjust the path as necessary
const upload = require('../middleware/upload');
const Purchase = require('../models/purchase');
const addProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err });
        }

        const id = req.user.id;
        const role = req.user.type;
        // console.log(id, role);
        try {
            let name = "";

            if (role === 'seller') {
                const seller = await Seller.findById(id);
                name = seller.name;
            } else if (role === 'admin') {
                name = 'admin';
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Only sellers or Admins can add products'
                });
            }

            // console.log(name);

            if (!name) {
                return res.status(404).json({
                    success: false,
                    message: 'Seller not found'
                });
            }

            const newProduct = new Product({
                name: req.body.name,
                picture: req.file ? `/uploads/${req.file.filename}` : '', // Save the image URL
                price: req.body.price,
                description: req.body.description,
                seller: name,
                ratings: req.body.ratings,
                reviews: req.body.reviews,
                available_quantity: req.body.available_quantity,
                createdBy: {
                    _id: id,
                    role: role
                }
            });

            // console.log(newProduct);
            const savedProduct = await newProduct.save();
            
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
    });
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
// Add item to cart
const addCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
  
    try {
      const tourist = await touristModel.findById(userId);
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      const cartItem = tourist.cart.find(item => item.productId.toString() === productId);
      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        tourist.cart.push({ productId, quantity });
      }
  
      await tourist.save();
      res.status(200).json(tourist.cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Remove item from cart
  const removeCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
  
    try {
      const tourist = await touristModel.findById(userId);
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      tourist.cart = tourist.cart.filter(item => item.productId.toString() !== productId);
  
      await tourist.save();
      res.status(200).json(tourist.cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        // Fetch the authenticated tourist
        const touristId = req.user?.id; // Ensure req.user is set by authenticate middleware
        if (!touristId) {
            return res.status(400).json({ error: 'Invalid tourist ID' });
        }

        console.log('Authenticated Tourist ID:', touristId);

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(touristId)) {
            return res.status(400).json({ error: 'Invalid tourist ID format' });
        }

        const tourist = await touristModel.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        // Add product to wishlist if not already added
        if (!tourist.wishlist.includes(productId)) {
            tourist.wishlist.push(productId);
            await tourist.save();
            return res.status(200).json({ success: true, message: 'Product added to wishlist.' });
        }

        res.status(400).json({ error: 'Product already in wishlist.' });
    } catch (error) {
        console.error('Error in addToWishlist:', error);
        res.status(500).json({ error: error.message });
    }
};
const getWishlist = async (req, res) => {
    try {
        const tourist = await touristModel.findById(req.user.id).populate('wishlist');
        if (!tourist) {
            return res.status(404).json({ success: false, message: 'Tourist not found.' });
        }
        res.status(200).json({ success: true, wishlist: tourist.wishlist });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
const removeFromWishlist = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
  
    try {
      const tourist = await touristModel.findById(userId);
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      tourist.wishlist = tourist.wishlist.filter(item => item.toString() !== productId);
  
      await tourist.save();
      res.status(200).json(tourist.wishlist);
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

const getProductSales = async (req, res) => {
    const userType = req.user.type;
    
    try {
        let products;
        if (userType === 'seller') {
            products = await Product.find({ 'createdBy._id': req.user.id });
        } else if (userType === 'admin') {
            products = await Product.find();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const salesData = await Promise.all(products.map(async (product) => {
            const sales = await Purchase.aggregate([
                { $match: { productId: product._id } },
                { $group: { _id: '$productId', totalSales: { $sum: '$quantity' } } }
            ]);

            return {
                product,
                totalSales: sales.length > 0 ? sales[0].totalSales : 0
            };
        }));

        res.status(200).json({
            success: true,
            data: salesData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product sales data',
            error: error.message
        });
    }
};

const moveWishlistToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
  
    try {
      const tourist = await touristModel.findById(userId);
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      // Check if the product is in the wishlist
      const wishlistItemIndex = tourist.wishlist.findIndex(item => item.toString() === productId);
      if (wishlistItemIndex === -1) {
        return res.status(404).json({ error: 'Product not found in wishlist' });
      }
  
      // Remove the product from the wishlist
      tourist.wishlist.splice(wishlistItemIndex, 1);
  
      // Add the product to the cart
      const cartItem = tourist.cart.find(item => item.productId.toString() === productId);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        tourist.cart.push({ productId, quantity: 1 });
      }
  
      await tourist.save();
      res.status(200).json({ success: true, cart: tourist.cart, wishlist: tourist.wishlist });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const getCart = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const tourist = await touristModel.findById(userId).populate('cart.productId');
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      res.status(200).json(tourist.cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const updateCartQuantity = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
  
    try {
      const tourist = await touristModel.findById(userId);
      if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
      }
  
      const cartItem = tourist.cart.find(item => item.productId.toString() === productId);
      if (!cartItem) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      if (quantity > product.available_quantity) {
        return res.status(400).json({ error: 'Quantity exceeds available stock' });
      }
  
      cartItem.quantity = quantity;
      await tourist.save();
      res.status(200).json(tourist.cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    searchProductByName,
    filterProductsByPrice,
    sortProductsByRatings,
    getMinAndMaxPrices,
    rateProduct,
    reviewProduct,
    archiveProduct,
    unarchiveProduct,
    getProductSales,
    removeCart,
    addCart,
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    moveWishlistToCart,
    getCart,
    updateCartQuantity
};