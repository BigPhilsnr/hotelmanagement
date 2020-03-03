var mongoose = require('mongoose');

var newSchema=mongoose.Schema({

src:{type:String,required:true},
title:{type:String, required:true},

date: { type: Date, default: Date.now },
content:{type:String,required:true},

});

var News=module.exports=mongoose.model('News',newSchema);
