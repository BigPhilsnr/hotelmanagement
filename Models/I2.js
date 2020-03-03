var mongoose=require('mongoose');
 
var I2Schema=mongoose.Schema({

    title:{type:String, required:true},
    details:{type:String, required:true}
});

var I2 =module.exports=mongoose.model('I2',I2Schema);