var mongoose=require('mongoose');
 
var EmployeeSchema=mongoose.Schema({
firstname:{
    type:String, required:true
},
lastname:{
    type:String, required:true
},
email:{
    type:String, required:true
},
number:{
    type:Number, required:true
},

isadmin:{
    type:Number,required:true
},
password:{type:String, required:true},

});



var Emloyee =module.exports=mongoose.model('Employee',EmployeeSchema);