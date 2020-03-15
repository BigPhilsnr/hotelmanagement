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
    price:{
        type: String,
    },
    images: [String],
    content: {
        type: String
    },
    unique: [String],
    createdAt: {
        type: Date,
        default: Date.now

    }
});

var Service = module.exports = mongoose.model('Service', ServiceSchema);