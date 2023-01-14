const express = require('express');
const app = express();
const path = require("path");
const session = require('express-session');

app.set("view engine", "pug");
app.use(express.static('./images'));
app.use(express.static('public'));
app.use(express.json());

const mongoose = require('mongoose');

const Movie = require("./Models/MovieModel")
const User = require("./Models/UserModel")
const People = require("./Models/PeopleModel")
const Review = require("./Models/ReviewModel")
const BasicReview = require("./Models/BasicReviewModel")

mongoose.connect('mongodb://localhost/movieDB');
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("connected to database");
    app.listen(3000);
    console.log("Serve listening at http://localhost:3000");
});

//setup session
app.use(session({secret: "secret", cookie: {maxAge: 999999999999999999999999999999}}))

let movieRouter = require("./routers/movies-router");
app.use("/movies", movieRouter);

let peopleRouter = require("./routers/people-router");
app.use("/people", peopleRouter);

let userRouter = require("./routers/users-router");
app.use("/users", userRouter);

//homepage
app.get("/", authorize, setCurUser,homepageSetup);


function authorize(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect("/users/signin");
        return;
	}
    next();
}

function setCurUser(req,res,next){
    User.findOne({"Username" : req.session.username}).exec((err,res2)=>{
        if(err){
            console.log(err);
            res.status(500).send("error reading user data");
            return;
        }
        if(!res2){
            res.status(404).send("cant find user");
            return;
        }
        else{
            req.curUser = res2;
            next();
        }
    });
}

function homepageSetup(req,res){
    //just get ten random movies
    Movie.count().exec((err,count)=>{
        let randint = Math.floor(Math.random() * count);
        Movie.find().limit(10).skip(randint).exec((err,mres)=>{
            if(err){
                console.log(err);
                res.status(500).send("error loading movie data");
                res.featuredmovies = [];
            }
            else{
                res.featuredmovies = mres;
            }
            res.status(200).render("./templates/home", {featured: res.featuredmovies});
        });
    });
}

console.log("Server listening at http://localhost:3000");