const mongoose = require('mongoose');
const { Schema } = mongoose;
// const activitySchema = require('./Activity');
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
        default: false,
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
    
}, { timestamps: true });

const itineraryModel = mongoose.model('Itinerary', itinerarySchema);
module.exports = itineraryModel;