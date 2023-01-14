const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require("fs");
const UserModel = require('../Models/UserModel');
let router = express.Router();

router.get("/signup", (req,res)=>{
    res.render("./templates/signup.pug");
});
router.get("/signin", (req,res)=>{
    res.render("./templates/signin.pug");
});
//might not even need this one below
router.get("/contributing", (req,res)=>{
    return req.session.loggedin;
});

router.get("/:uid", authorize, setCurUser, setupProfile);
router.get("/profile", authorize, setCurUser, setupProfile);


router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.put("/contributing", authorize, setCurUser, changeUserMode);
router.post("/watchlist", authorize, setCurUser, addToWatchList);
router.post("/peoplefollowing", authorize, setCurUser, addToFollowedPeople);
router.get("/logout", authorize, setCurUser, logout);
router.delete("/unfollow/:pid",  authorize, setCurUser, unfollow);
router.delete("/removemovie/:mid",  authorize, setCurUser, removeMovie);


function unfollow(req,res){
    console.log(req.url);
    let personID = req.url.slice(10);
    console.log(personID);

}

function removeMovie(req,res){
    console.log(req.url);
    let movieID = req.url.slice(1);
}

function setupProfile(req,res){

    let reccomended = [];

    UserModel.findById(req.curUser._id)
    .populate("Watchlist", "Title _id Released Poster")
    .populate("FollowedPeople", "Name _id")
    .exec((err,res2)=>{
        res.render("templates/profile.pug", {user : res2, reccomended : reccomended, contributing : req.curUser.contributing})
    })
}

function addToFollowedPeople(req,res){
    UserModel.findById(req.curUser._id).exec((err,res2)=>{
        if(res2.FollowedPeople.includes(req.body.id)){
            res.status(500).send("You already follow this person");
            return;
        }
        else{
            res.status(200).send("Successfully added to your followed people list");
            res2.FollowedPeople.push(req.body.id);
            res2.save();
        }
    })
}

function addToWatchList(req,res){

    UserModel.findById(req.curUser._id).exec((err,res2)=>{
        if(res2.Watchlist.includes(req.body.id)){
            res.status(500).send("This movie is already in your Watch List.");
            return;
        }
        else{
            res.status(200).send("Movie added to your list!");
            res2.Watchlist.push(req.body.id);
            res2.save();
        }
    })
}


function authorize(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect("/users/signin");
        return;
	}
    next();
}

function setCurUser(req,res,next){
    UserModel.findOne({"Username" : req.session.username}).exec((err,res2)=>{
        if(err){
            res.status(404).send("error");
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

function userSignup(req,res,next){
    let username = req.body.username;
    let password = req.body.password;
    
    //check if username is already taken
    UserModel.findOne({"Username" : username}).exec((err,res2)=>{
        if(res2){
            res.status(404).send("Sorry! That username already exists, please select another one");
        }
        else{
            let user = new UserModel({Username: username, Password: password, Watchlist: [], FollowedUsers: [], FollowedPeople: [], Notifications: [], Reviews: [], BasicReviews: []});
            user.save((err, res3)=>{
                if(err){
                    console.log(err);
                    return;
                }
                req.session.username = res3.Username;
                req.session.loggedin = true;
                req.curUser = res3;
                res.status(200).send();
                return;
            })
        }
    })
}

function userSignin(req,res){
    let username = req.body.username;
    let password = req.body.password;

    //check if username exists in db
    UserModel.findOne({"Username" : username}).exec((err,res2)=>{
        if(!res2){
            res.status(404).send("Username does not exist");
            return;
        }
        else if(password == res2.Password){
            req.session.username = res2.Username;
            req.session.loggedin = true;
            req.curUser = res2;
            res.status(200).send();
            return;
        }
        else{
            res.status(404).send("Incorrect password");
            return;
        }
    });
}

function changeUserMode(err,req,res){
    console.log(req.body.obj);
    req.curUser.mode = req.body.obj.contributing;
    console.log(req.curUser.mode)
}

function logout(req, res) {
    if (req.session.loggedIn) {
        req.session.loggedIn = false;
        res.redirect("/users/signin");
        res.status(200);
        return;
    }
    else {
        res.status(302);
        res.redirect("/users/signin");
    }
}

module.exports = router;