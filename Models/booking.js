var mongoose = require("mongoose");

var BookingSchema = mongoose.Schema({
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },

    paid: {
        type: Number,
        default: 0,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    sid: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    request: {
        type: String
    },
    withpet: {
        type: Number,
        default: 0,
        required: false
    },
    parking: {
        type: Number,
        default: 0,
        required: true
    },
    isAdmin: {
        type: Number,
        required: true,
        default: 0
    },
    adults: {
        type: Number
    },
    children: {
        type: Number
    },
    expenses: [{
        service: String,
        amount: Number
    }]
});
var Booking = (module.exports = mongoose.model("Booking", BookingSchema));