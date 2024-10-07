const mongoose = require('mongoose');
const { Schema } = mongoose;

const touristSchema = new Schema({
    Username: {
        type: String,
        required: true,
        trim: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    Password: {
        type: String,
        required: true,
        minlength: 8,
    },
    Number: {
        type: String, // Use String to accommodate different formats
        required: true,
    },
    Nationality: {
        type: String,
        required: true,
    },
    DOB: {
        type: Date,
        required: true,
        immutable: true, // DOB cannot be changed
    },
    Job: {
        type: String,
        //enum: ['job', 'student'], // Limiting to specified values
        required: true,
    },
    Wallet:{
        type:Number,
        required:true,
        default:0 // Default value of wallet is 0
      },
      itinerary: [{ type: Schema.Types.ObjectId,
        ref:'Itinerary',
        required:false
    }], // Array of itineraries
      // otp will be added next sprint forget its here for now
}, { timestamps: true });



// Age validation
touristSchema.pre('save', function(next) {
    if (this.DOB) { // Check if DOB is defined
        const age = new Date().getFullYear() - this.DOB.getFullYear();
        if (age < 18) {
            return next(new Error('You must be at least 18 years old to register.'));
        }
    } else {
        return next(new Error('Date of birth is required.'));
    }
    next();
});


const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;

