const mongoose = require('mongoose');
const { Schema } = mongoose;
// file name  MuseumsAndHistoricalPlaces.js
const MuseumsAndHistoricalPlacesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pictures: [{
        type: String, // URL to the image
        required: true
    }],
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        coordinates: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        }
    },
    openingHours: {
        type: Map,
         of: String,
    required:true
    },
    ticketPrices: {  // tickets prices vary if foreigner, native or student
        foreigner: {
            type: Number,
            required: true
        },
        native: {
            type: Number,
            required: true
        },
        student: {
            type: Number,
            required: false
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'TourismGovernor',
        required: true
    },
    tags: {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        required: false
    }
});

const MuseumsAndHistoricalPlaces = mongoose.model('MuseumsAndPlaces',MuseumsAndHistoricalPlacesSchema);
module.exports = MuseumsAndHistoricalPlaces;