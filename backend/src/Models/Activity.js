mongoose = require('mongoose');
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
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
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
    type: String,
    required: true
}],
  advertiser: {
    type: Schema.Types.ObjectId,
    ref: 'Advertiser',
    required: true
},
rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, { timestamps: true });



const activityModel = mongoose.model('Activity', activitySchema );
module.exports= activityModel;