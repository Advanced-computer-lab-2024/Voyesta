const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
    Type: {
        type: String,
        required: true,
        enum: ['Monuments', 'Museums', 'Religious Sites', 'Palaces','Castles'] // Specific set of types
         },
    historicalPeriod: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{4} to \d{4}$/.test(v); // Regular expression to match YYYY-YYYY format
            },
            message: props => `${props.value} is not a valid historical period! It should be in the format YYYY-YYYY.`
        }
        }
    },);

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;