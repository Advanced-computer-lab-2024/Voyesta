// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // assuming you have a User model
    required: true
  },

});

const activitiyModel = mongoose.model('Activity', activitySchema );
module.exports= activitiyModel;