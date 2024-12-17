const mongoose = require('mongoose');
const { Schema } = mongoose;

const itinerarySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Name of the itinerary
    },
    availableDates: [{
        type: Date,
        required: true, // The start date of the itinerary
    }],
    activities: [{
        type: Schema.Types.ObjectId,
        ref: 'Activity', // Reference to Activity model
        required: true
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'PreferenceTag',
        required: true
    }],
    locations: [{
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    }],
    timeline: [{
        type: String,
        required: true
    }],
    durations: [{
        type: Number,
        required: true
    }],
    tourLanguage: {
        type: String, 
        required: true,
    },
    tourPrice: {
        type: Number, 
        required: true,
    },
    accessibility:[{
        type: String, 
        required: true,
    }],
    pickUpLocation: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    dropOffLocation: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    bookingActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    inappropriate: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref : 'TourGuide', // User/guide who created the itinerary
        required: false,
    },
    ratings: [{
        tourist: {
            type: Schema.Types.ObjectId,
            ref: 'Tourist',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        }
    }],
    comments: [{
        tourist: {
            type: Schema.Types.ObjectId,
            ref: 'Tourist',
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    bookingEnabled: {
        type: Boolean,
        default: false
    },
    requestToBeNotified: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist'
      }],
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;