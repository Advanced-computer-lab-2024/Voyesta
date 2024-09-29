const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Ensure unique usernames
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure unique email addresses
    match: /.+\@.+\..+/  // Basic email validation
  },
  password: {
    type: String, // Password should be hashed
    required: true,
    minlength: 6 // Minimum length for security
  },
  mobileNumber: {
    type: String, // Change to String to handle various formats
    required: true,
    match: /^\+?[0-9]{7,15}$/ // Basic validation for mobile numbers
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0 // Minimum experience cannot be negative
  },
  previousWork: {
    type: String,
    required: false
  }
}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;
