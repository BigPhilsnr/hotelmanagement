var mongoose=require('mongoose');

var feedbackSchema=mongoose.Schema({

 
firstname:{type:String,required:true},
lastname:{type:String, required:true},
email:{type:String, required:true},
phone:{type:String, required:true},
message:{type:String, required:true},
date: { type: Date, default: Date.now },

});
var Feedback=module.exports=mongoose.model('Feedback',feedbackSchema);
