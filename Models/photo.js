var mongoose = require('mongoose');

var PhotoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    img: {
        type: String,
        required: true
    },

    complements: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now

    }


});
var Photo = module.exports = mongoose.model('Photo', PhotoSchema);