var mongoose = require('mongoose');

var ServiceSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    img: {
        type: String,
        required: true
    },

    content: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now

    }
});

var Service = module.exports = mongoose.model('Service', ServiceSchema);