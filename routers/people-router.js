const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require("fs");
let router = express.Router();
const People = require("../Models/PeopleModel");
const User = require("../Models/UserModel");

router.get("/:pid", authorize, setCurUser, getPerson);
router.get("/addpeople", authorize, setCurUser, addPerson);

function authorize(req, res, next) {
    if(!req.session.loggedin) {
        res.redirect("/users/signin");
        return;
	}
    next();
}

function setCurUser(req,res,next){
    console.log(req.session);
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
            req.curUser = res2;
            next();
        }
    });
}


function addPerson(req,res){
    res.render("/templates/addpersonpage.pug");
}


function getPerson(req,res,next){

    let personID = req.url.slice(1);
    People.findById(personID).exec((err,res2)=>{
        res2.getAllWorkHistory((err,res3)=>{
            let collablist = {};
            res3.forEach(movie=>{
                movie.Directors.forEach(PID=>{
                    //if person isnt in list and isnt itself
                    if(!collablist.hasOwnProperty(PID) && !PID.equals(personID)){
                        collablist[PID] = 1
                    }
                    else if(!PID.equals(personID)){
                        collablist[PID] += 1;
                    }
                })
                movie.Writers.forEach(PID=>{
                    //if person isnt in list and isnt itself
                    if(!collablist.hasOwnProperty(PID) && !PID.equals(personID)){
                        collablist[PID] = 1;
                    }
                    else if(!PID.equals(personID)){
                        collablist[PID] += 1;
                    }
                })
                movie.Actors.forEach(PID=>{
                    //if person isnt in list and isnt itself
                    if(!collablist.hasOwnProperty(PID) && !PID.equals(personID)){
                        collablist[PID] = 1;
                    }
                    else if(!PID.equals(personID)){
                        collablist[PID] += 1;
                    }
                })
            })
            
            let topcollaberators = [];

            //sort using messy map method

            let collabmap = Object.keys(collablist).map(function(key){
                return[key, collablist[key]];
            });

            collabmap.sort(function(a,b){
                return b[1]-a[1];
            });
            
            
            if(collabmap.length > 10){
                for(let i = 0 ; i < 10 ; i++){
                    topcollaberators.push(collabmap[i][0]);
                }
            }
            else{
                for(let i = 0 ; i < collabmap.length ; i++){
                    topcollaberators.push(collabmap[i][0]);
                }
            }


            let topcollaberatornames = []

            for(let i = 0 ; i < topcollaberators.length ; i++){
                People.findById(topcollaberators[i]).exec((err,res)=>{
                    topcollaberatornames.push(res.Name);
                })
            }

            People.findById(personID)
            .populate("DirectedWorkHistory", "Title _id Poster Released")
            .populate("WrittenWorkHistory", "Title _id Poster Released")
            .populate("ActedWorkHistory", "Title _id Poster Released")
            .exec((err,res4)=>{
                res.render("templates/person.pug", {topcollaberators : topcollaberatornames, topcollaberatorids : topcollaberators, person : res4})
            })
        })
    });
}

module.exports = router;