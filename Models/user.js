var mongoose=require('mongoose');

var UserSchema=mongoose.Schema({
firstname:{type:String, required:true},
lastname:{type:String,required:true},
email:{type:String,required:true},

number:{type:String, required:true},
request:{type:String},
withpet:{type:Number, required:true},
parking:{type:Number, required:true},
});
var User=module.exports=mongoose.model('User',UserSchema);
