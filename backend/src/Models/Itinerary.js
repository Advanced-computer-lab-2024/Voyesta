const mongoose = require('mongoose');
const { Schema } = mongoose;
// const activitySchema = require('./Activity');
const itinerarySchema = new Schema({
    name: {
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
    activities: [{
        type: Schema.Types.ObjectId,
        ref: 'Activity', // Reference to Activity model
        required: true
    }],
    description: {
        type: String,
        required: false,
        trim: true, // Optional description of the itinerary
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'PreferenceTag',
        required: true
    }],
    locations: {
        type: [String], 
        required: true,
    },
    tourLanguage: {
        type: [String], 
        required: true,
    },
    tourPrice: {
        type: Number, 
        required: true,
    },
    avdatesandtimes: {
        type: [Date], 
        required: true,
    },
    accesibility: {
        type: [String], 
        required: true,
    },
    pickdropofflocation: {
        type: [String], 
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref : 'TourGuide', // User/guide who created the itinerary
        required: true,
    },
    
}, { timestamps: true });

const itineraryModel = mongoose.model('Itinerary', itinerarySchema);
module.exports = itineraryModel;