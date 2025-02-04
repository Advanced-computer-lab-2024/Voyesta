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
    minlength: 8 // Minimum length for security
  },
  mobileNumber: {
    type: String, // Change to String to handle various formats
    required: false,
    match: /^\+?[0-9]{7,15}$/ // Basic validation for mobile numbers
  },
  yearsOfExperience: {
    type: Number,
    required: false,
    min: 0 // Minimum experience cannot be negative
  },
  previousWork: {
    type: String,
    required: false
  },
  otp: {
    type: String,
    required: false,
  },
  comments:[{
    tourist: {
      type: Schema.Types.ObjectId,
      ref: 'Tourist',
      required: true
    },
    itineraryId :{
      type: Schema.Types.ObjectId,
      ref: 'Itinerary',
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  }],
  ratings:[{
    tourist: {
      type: Schema.Types.ObjectId,
      ref: 'Tourist',
      required: true
    },
    itineraryId :{
      type: Schema.Types.ObjectId,
      ref: 'Itinerary',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min:0,
      max:5
    },
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'deleted', 'rejected'], // Add 'rejected' status
    default: 'pending'
  },
  profilePicture: {
    type: String,
    required: false
  },
  personalId: {
    type: String,
    required: false
  },
  additionalDocument: {
    type: String,
    required: false
  },
  additionalInfo:{
    type: Boolean,
    required: false,
    default: false
  },
  termsAccepted:{
    type: Boolean,
    required: false,
    default: false
  },
  notifications: [{
    type: Schema.Types.ObjectId,
    ref: 'Notification'
  }]
}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;
