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
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    phone: {
        type: Number
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