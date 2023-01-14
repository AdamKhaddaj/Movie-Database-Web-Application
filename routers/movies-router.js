const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require("fs");
let router = express.Router();
const Movie = require("../Models/MovieModel");
const User = require('../Models/UserModel');
const { isRegExp } = require('util');

//advancedsearch page (for now)
router.get("/search", authorize, setCurUser, (req,res)=>{
    res.render("./templates/advancedsearch.pug");
});


//searchresults
router.get("/", authorize, setCurUser, getMovies);
router.get("/:mid", authorize, setCurUser, loadMovie);
router.get("/add", authorize, setCurUser, addMovie)


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
            res.status(404).send("error");
            return;
        }
        if(!res2){
            res.status(500).send("cant find user");
            return;
        }
        else{
            req.session.user = res2;
            next();
        }
    });
}

function addMovie(req,res){
    res.render("/templates/addmoviepage.pug");
}


function loadMovie(req,res){
    let movieID = req.url.slice(1);
    Movie.findById(movieID)
    .populate("Directors", "Name _id")
    .populate("Writers", "Name _id")
    .populate("Actors", "Name _id")
    .exec((err,res2)=>{
        res2.getSimilarMovies((err,res3)=>{

            //WILL ONLY BE LINKS FOR NOW
            res.render("templates/movie.pug", {movie : res2, similarmovies : res3})
        });
    });
}


function getMovies(req,res,next){

    let paginationNum = req.query.pagenum

    let searchresults = Movie.find();


    if(req.query.title!=""){
        searchresults = searchresults.where("Title").regex(new RegExp(".*" + req.query.title + ".*", "i"));
        
    }
    if(req.query.genre!=""){
        searchresults = searchresults.find({Genre:{$in:[req.query.genre]}})
        
    }

    searchresults.exec((err,res2)=>{
        if(res2.length == 0){
            res.status(500).send("Whoops! Your search yielded no results...")
            res.end();
        }
        else{
            let query = req.url;
            let nextquery = query.substring(0, query.length - 1) + (parseInt(query.charAt(query.length-1))+1).toString()
            let prevquery = query.substring(0, query.length - 1) + (parseInt(query.charAt(query.length-1))-1).toString()

            if(((+paginationNum + 1) * 10) > res2.length){
                console.log("nonextpage!");
                res.render("./templates/results.pug", {results : res2.slice(+paginationNum * 10, (+paginationNum + 1) * 10), paginationNum: -1, nextquery: nextquery, prevquery : prevquery});
            }
            else{
                console.log("yesnextpage!");
                res.render("./templates/results.pug", {results : res2.slice(+paginationNum * 10, (+paginationNum + 1) * 10), paginationNum: paginationNum, nextquery: nextquery, prevquery : prevquery});
            }
        }
    })


}


module.exports = router;
