const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const touristSchema = new Schema({
  Email: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
    minlength: 6 // Ensure passwords are stored securely

  },
   Number: {
    type: Number,
    required: true,
  },
  Nationality:{
    type:String,
    required:true

  },
  Job:{
    type:String,
    required:true
  },
  otp: {
    type: String,
    required: false,
}

}, { timestamps: true });

const Tourist = mongoose.models.Tourist || mongoose.model('Tourist', touristSchema);
module.exports = Tourist;