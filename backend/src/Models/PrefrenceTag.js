const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// PreferenceTag.js
const preferenceTagSchema = new Schema({
    Name: {
      type: String,
      required: true,
    }
  }, { timestamps: true });
  
  const PreferenceTag = mongoose.model('PreferenceTag', preferenceTagSchema);
  module.exports = PreferenceTag;