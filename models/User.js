const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    user_name:{type:String,required:true},
    balance:Number,
    items:[
        {
            name:String,
            price:Number
        }
    ]
})

module.exports=mongoose.model("User",userSchema,"users");