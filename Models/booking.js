var mongoose = require('mongoose');

var BookingSchema = mongoose.Schema({
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    code: {
        type: Number
    },
    paid: {
        type: Number,
        default:0,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    sid: {
        type: String
    },
    adults: {
        type: Number
    },
    children: {
        type: Number,
    },
    expenses: [{
        service: String,
        amount: Number
    }]
});
var Booking = module.exports = mongoose.model('Booking', BookingSchema);