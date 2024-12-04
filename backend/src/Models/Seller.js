const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true, // Ensures no extra spaces are stored
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate emails
        lowercase: true, // Store email in lowercase
        trim: true, // Ensures no extra spaces are stored
    },
    password: {
        type: String, // Change from Number to String for proper handling
        required: true,
        minlength: 6 // Ensure passwords are stored securely

    },
    name: {
        type: String,
       // required: true, // Seller name is required
        trim: true, // Ensures no extra spaces are stored
    },
    description: {
        type: String,
        required: false, // Description is optional
        trim: true, // Ensures no extra spaces are stored
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'deleted', 'rejected'],
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


module.exports = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);;
