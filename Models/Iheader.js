var mongoose=require('mongoose');

var IheaderSchema=mongoose.Schema({
line1:{type:String, required:true},
line2:{type:String, required:true},
src:{type:String, required:true}

});

var Iheader=module.exports=mongoose.model('Iheader',IheaderSchema);