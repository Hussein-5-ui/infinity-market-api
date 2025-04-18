const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const routes=require("./routes/expressRoutes")
require("dotenv").config();
const app = express()
const port = process.env.PORT;
app.listen(port)

console.log("Server Started")

app.use(express.static("public"))
app.set('views',path.join(__dirname,"views"))
app.set('view engine',"ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.json())




app.get("/",(req,res)=>{
    console.log("Request received")
   
    res.render("index")
})


const url = process.env.MongoURL;
mongoose.set("strictQuery", false);
mongoose.connect(url,(error)=>{
    if(error)
        console.log(error);
    else
        console.log("Successfully connected to DB..");
})

app.use("/",routes);