const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
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
  Number:{
    type:Number,
    required:true
  },
  Years_Of_Experience:{
    type:Number,
    required:true
  },
  Previous_Work:{
    type:String,
    required:false
  }

  

}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;