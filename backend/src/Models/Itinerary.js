const mongoose = require('mongoose');
const { Schema } = mongoose;


const itinerarySchema = new Schema({
    itineraryName: {
        type: String,
        required: true,
        trim: true, // Name of the itinerary
    },
    startDate: {
        type: Date,
        required: true, // The start date of the itinerary
    },
    endDate: {
        type: Date,
        required: true, // The end date of the itinerary
    },
    activities: [activitySchema], // Array of activities in the itinerary
    createdBy: {
        type: String, // User/guide who created the itinerary
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true, // Optional description of the itinerary
    },
    tags: {
        type: [String], 
        required: True,
    },
    locations: {
        type: [String], 
        required: True,
    },
    TourLanguage: {
        type: [String], 
        required: True,
    },
    TourPrice: {
        type: [String], 
        required: True,
    },
    avdatesandtimes: {
        type: [String], 
        required: True,
    },
    accesibility: {
        type: [String], 
        required: True,
    },
    pickdropofflocation: {
        type: [String], 
        required: True,
    }
    
}, { timestamps: true });

const ItineraryModel = mongoose.model('Itinerary', itinerarySchema);
module.exports = ItineraryModel;