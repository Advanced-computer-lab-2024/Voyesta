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
    
    //activities: [ActivitySchema], // Array of activities in the itinerary
    createdBy: {
        type: Schema.Types.ObjectId,
        ref : 'TourismGovernor', // User/guide who created the itinerary
        required: true,
    },
    description: { // timeline of the itinerary
        type: String,
        required: true,
        trim: true, // Optional description of the itinerary
    },
    // tags: {
    //     type: [TagSchema], // Array of tags associated with the itinerary
    //     required: true,
    // },
    TourLanguage: {
        type: [String], 
        required: true,
    },
    TourPrice: {
        type: Number, 
        required: true,
    },
    availableDatesAndTimes: {
        type: [String], 
        required: true,
    },
    accessibility: {
        type: Boolean, 
        required: true,
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