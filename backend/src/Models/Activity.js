const { text } = require('body-parser');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validatePriceType = (value) => {
  if (typeof value === 'number') {
      return true;
  }
  if (typeof value === 'object' && value !== null) {
      return typeof value.min === 'number' && typeof value.max === 'number';
  }
  return false;
};

const activitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  price: { type: Number, required: true },
  specialDiscount: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: 'ActivityCategory', required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'PreferenceTag' }],
  advertiser: { type: Schema.Types.ObjectId, ref: 'Advertiser', required: true },
  imageUrl: { type: String, required: true }, // Add this line
  ratings: [{
    tourist: { type: Schema.Types.ObjectId, ref: 'Tourist', required: true },
    rating: { type: Number, required: true }
  }],
  comments: [{
    tourist: { type: Schema.Types.ObjectId, ref: 'Tourist', required: true },
    comment: { type: String, required: true }
  }]
}, { timestamps: true });

const activityModel = mongoose.model('Activity', activitySchema);
module.exports = activityModel;