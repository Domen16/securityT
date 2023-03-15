//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

//console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://domizupancic:pingvin@cluster0.c93j1xb.mongodb.net/UserLogin?retryWrites=true&w=majority")

const userSchema = new mongoose.Schema({
    username : String,
    password : String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User",userSchema);



app.get("/",function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const newUser = new User({
        username : req.body.username,
        password : req.body.password
    })

    try{
        newUser.save();
        res.render("secrets");
    }catch(err){
        console.log(err);
    }
});

app.post("/login",async function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    try{
        const founduser = await User.findOne({username : username});
        if(founduser){
            if (founduser.password === password){
                res.render("secrets");
            }
        }

    }catch(err){
        console.log(err);
    }
});



app.listen(3000,function(){
    console.log("Server listening on port 3000");
})