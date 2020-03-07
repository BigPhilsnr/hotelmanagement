var mongoose = require('mongoose');

var ServiceSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
});

var Service = module.exports = mongoose.model('Service', ServiceSchema);