const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: Number,
    required: true,
  },
  

}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;