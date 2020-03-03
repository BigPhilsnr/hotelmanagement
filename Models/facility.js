var mongoose=require('mongoose');

var FacilitySchema=mongoose.Schema({
name:{
    type:String, required:true
},
icon:{
    type:String, required:true
},
price:{
    type:Number,required:true
},
img:{
type:String, required:true
},
period:{
    type:String, required:true
    },
description:{type:String, required:true},
complements:{type:String},
priority:{type:Number}

});
var Facility=module.exports=mongoose.model('Facility',FacilitySchema);