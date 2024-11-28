const { text } = require('body-parser');

const mongoose = require('mongoose');
const { Schema } = mongoose;


const validatePriceType = (value) => {
  if (typeof value === 'number') {
      return true;
  }
  if (typeof value === 'object' && value !== null) {
      return typeof value.min === 'number' && typeof value.max === 'number';
  }
  return false;
};


const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Schema.Types.Mixed,
    required: true,
    validate : {
      validator : validatePriceType,
      message   : 'Price must be a number or an object with min and max properties'
    }  
    
  },
  specialDiscount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'ActivityCategory',
    required: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'PreferenceTag',
    required: true
  }],
  advertiser: {
    type: Schema.Types.ObjectId,
    ref: 'Advertiser',
    required: true
  },
  ratings:[{
    tourist: {
      type: Schema.Types.ObjectId,
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
  comments:[{
    tourist: {
      type: Schema.Types.ObjectId,
      ref: 'Tourist',
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  }],
}, { timestamps: true });



const activityModel = mongoose.model('Activity', activitySchema );
module.exports= activityModel;