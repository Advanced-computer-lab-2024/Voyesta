const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Assuming the picture is a URL
    },
    picture: {
        type: String,
        required: false // Assuming the picture is a URL
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    ratings:[{
        tourist: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tourist',
          required: true
        },
        rating: {
          type: Number,
          required: true,
          min:0,
          max:5
        }
      }],
    reviews:[{
        tourist: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tourist', 
          required: true
        },
        review: {
          type: String,
          required: true
        }
      }],
    available_quantity: {
        type: Number,
        required: true // Assuming the picture is a URL
    },
    createdBy: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        // Model discriminator to specify either 'Seller' or 'Admin'
        role: {
            type: String,
            required: true,
            enum: ['seller', 'admin']
        }
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
