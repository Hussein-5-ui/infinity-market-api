const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const routes=require("./routes/expressRoutes")
//load the .env file
require("dotenv").config();
const app = express()
//get the port from the .env file
const port = process.env.PORT;
app.listen(port)

console.log("Server Started")

app.use(express.static("public"))
app.set('views',path.join(__dirname,"views"))
app.set('view engine',"ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.json())



//router handler for home page
app.get("/",(req,res)=>{
    console.log("Request received")
   
    res.render("index")
})

//get the url from the .env file
const url = process.env.MongoURL;
//sets the strictQuery to false to allow for the use of $elemMatch
mongoose.set("strictQuery", false);
//connect to the database
mongoose.connect(url,(error)=>{
    if(error)
        console.log(error);
    else
        console.log("Successfully connected to DB..");
})
//use the routes
app.use("/",routes);