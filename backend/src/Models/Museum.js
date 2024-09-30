const mongoose = require('mongoose');
const museumSchema = new Schema({
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Reference to User (Tourism Governor)
      required: true
    }
  }, { timestamps: true });
  
 const museums= mongoose.model('Museum', museumSchema);
  module.exports = museums;