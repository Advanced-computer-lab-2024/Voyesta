const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ActivityCategory.js
const activityCategorySchema = new Schema({
    Name: {
      type: String,
      required: true,
    }
  }, { timestamps: true });
  
  const ActivityCategory = mongoose.model('ActivityCategory', activityCategorySchema);
  module.exports = ActivityCategory;