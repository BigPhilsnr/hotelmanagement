var mongoose=require('mongoose');

var BookingSchema=mongoose.Schema({
from:{
    type:Date, required:true
},
to:{
    type:Date, required:true
},
roomId:{
    type:String, required:true
},userId:{
    type:String, required:true
},
amount:{
    type:Number,required:true
},
code:{
    type:Number
},
paid:{
    type:Number,required:true
},
date: { type: Date, default: Date.now },
sid:{
    type:String
},expenses:[{service:String,amount:Number}]
});
var Booking=module.exports=mongoose.model('Booking',BookingSchema);