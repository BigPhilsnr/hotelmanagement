var mongoose = require('mongoose');

var RoomFileSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
});

var RoomFile = module.exports = mongoose.model('RoomFile', RoomFileSchema);