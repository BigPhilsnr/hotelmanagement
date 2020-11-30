var mongoose = require("mongoose");

var MenuSchema = mongoose.Schema({

    unit: {
        type: String,
        required: false,
        default:1
    },
    img:{
        type:String,
        required:false
    },
    price: {
        type: Number,
        required: false,
        default:1
    },
    name: {
        type: String,
        required: false
    },
    category: {
        type: Number,
        required: false,
        default:100,
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Number,
        required:false,
        default:1
    },
    content:{
        type:String
    }

});
var Menu = (module.exports = mongoose.model("Menu", MenuSchema));