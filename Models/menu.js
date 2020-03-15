var mongoose = require("mongoose");

var MenuSchema = mongoose.Schema({
   
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Number
    }

});
var Menu = (module.exports = mongoose.model("Menu", MenuSchema));