var mongoose = require("mongoose");

var MenuSchema = mongoose.Schema({

    unit: {
        type: String,
        required: true
    },
    img:{
        type:String,
        required:false
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Number,
        required:true,
        default:1
    },
    content:{
        type:String
    }

});
var Menu = (module.exports = mongoose.model("Menu", MenuSchema));