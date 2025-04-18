const mongoose = require('mongoose');
//create a schema for the user model
//a cuser has a name, a username, a balance, and an array of items
//the items array contains objects with name and price properties
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
//export the user model
module.exports=mongoose.model("User",userSchema,"users");