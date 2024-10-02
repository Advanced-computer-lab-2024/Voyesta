const mongoose = require('mongoose');
const HistoricalSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    openingHours: {
      type: String,
      required: true
    },
    ticketPrice: {
      type: Number,
      required: true
    },
  }, { timestamps: true });
  
 const Historical= mongoose.model('Historical', HistoricalSchema);
  module.exports = Historical;