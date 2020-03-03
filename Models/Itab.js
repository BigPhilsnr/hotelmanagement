var mongoose=require('mongoose');
var ItabSchema=mongoose.Schema({

rest:{type:String, required:true},
gym:{type:String, required:true},
vallet:{type:String, required:true},
sc:{type:String, required:true},
date: { type: Date, default: Date.now },
});

var Itab=module.exports=mongoose.model("Itab",ItabSchema);