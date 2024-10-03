const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivitySchema = require('./Activity');
const TagSchema = require('./PreferenceTag');

const itinerarySchema = new Schema({
    itineraryName: {
        type: String,
        required: true,
        trim: true, // Name of the itinerary
    },
    
    activities: [ActivitySchema], // Array of activities in the itinerary
    createdBy: {
        type: Schema.Types.ObjectId,
        ref : 'TourismGovernor', // User/guide who created the itinerary
        required: true,
    },
    description: { // timeline of the itinerary
        type: String,
        required: True,
        trim: true, // Optional description of the itinerary
    },
    tags: {
        type: [TagSchema], // Array of tags associated with the itinerary
        required: True,
    },
    TourLanguage: {
        type: [String], 
        required: True,
    },
    TourPrice: {
        type: Number, 
        required: True,
    },
    availableDatesAndTimes: {
        type: [String], 
        required: True,
    },
    accessibility: {
        type: Boolean, 
        required: True,
    },
    pickUpLocation: { // we can use nested jsons or the url of the location
        type: String,
        required: true,
        trim: true,
    },
    dropOffLocation: {
        type: String,
        required: true,
        trim: true,
    }
    
}, { timestamps: true });

const ItineraryModel = mongoose.model('Itinerary', itinerarySchema);
module.exports = ItineraryModel;