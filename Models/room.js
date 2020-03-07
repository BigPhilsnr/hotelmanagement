var mongoose = require('mongoose');

var RoomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    complements: {
        type: String
    },
    priority: {
        type: Number
    },
    adults: {
        type: Number
    },
    children: {
        type: Number,
    },
    nextFree: {
        type: Date,
        default: Date.now
        
    }


});
var Room = module.exports = mongoose.model('Room', RoomSchema);