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
  }

}, { timestamps: true });

const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;