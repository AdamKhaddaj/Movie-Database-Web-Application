const mongoose = require("mongoose");
const movies = require("./moviedata/movie-data-2500.json")

const Movie = require("./Models/MovieModel")
const User = require("./Models/UserModel")
const People = require("./Models/PeopleModel")
const Review = require("./Models/ReviewModel")
const BasicReview = require("./Models/BasicReviewModel")

//load movies from JSON into local files for organization first

let allmovies = {};
let allpeople = {};

for(id in movies){
    let localm = movies[id];

    let m = new Movie();

    m.Title = localm.Title;
    m.Year = localm.Year;
    m.Rated = localm.Rated;
    m.Released = localm.Released;
    m.Runtime = localm.Runtime;
    m.Genre = localm.Genre;
    m.Plot = localm.Plot;
    m.Awards = localm.Awards;
    m.Poster = localm.Poster;
    m.Directors = [];
    m.Writers = [];
    m.Actors = [];

    localm.Director.forEach(director=>{
        if(!allpeople.hasOwnProperty(director)){
            let newperson = new People();
            newperson.Name = director;
            newperson.DirectedWorkHistory.push(m._id);
            allpeople[director] = newperson;
            m.Directors.push(newperson._id);
        }
        else{
            allpeople[director].DirectedWorkHistory.push(m._id);
            m.Directors.push(allpeople[director]._id);
        }
    })
    localm.Writer.forEach(writer=>{
        if(!allpeople.hasOwnProperty(writer)){ 
            let newperson = new People();
            newperson.Name = writer;
            newperson.WrittenWorkHistory.push(m._id);
            allpeople[writer] = newperson;
            m.Writers.push(newperson._id);
        }
        else{
            allpeople[writer].WrittenWorkHistory.push(m._id);
            m.Writers.push(allpeople[writer]._id);
        }
    })
    localm.Actors.forEach(actor=>{
        if(!allpeople.hasOwnProperty(actor)){
            let newperson = new People();
            newperson.Name = actor;
            newperson.ActedWorkHistory.push(m._id);
            allpeople[actor] = newperson;
            m.Actors.push(newperson._id);
        }
        else{
            allpeople[actor].ActedWorkHistory.push(m._id);
            m.Actors.push(allpeople[actor]._id);
        }
    })

    allmovies[m._id] = m;
}

mongoose.connect('mongodb://localhost/movieDB');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){

    mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped Movie database. Starting re-creation.");

        let moviesadded = 0;
        let peopleadded = 0;

        let movielist = [];
        let peoplelist = [];

        for(id in allmovies){
            movielist.push(allmovies[id]);
        }
        for(pname in allpeople){
            peoplelist.push(allpeople[pname]);
        }

        movielist.forEach(movie=>{
            movie.save(function(err,res){
                if(err) throw (err);
                moviesadded++;
                if(moviesadded >= movielist.length && peopleadded >= peoplelist.length){
                    console.log("database complete!");
                    mongoose.connection.close();
                }
            })
        })

        peoplelist.forEach(person=>{
            person.save(function(err,res){
                if(err)throw(err);
                peopleadded++;
                if(moviesadded >= movielist.length && peopleadded >= peoplelist.length){
                    console.log("database complete!");
                    mongoose.connection.close();
                }
            })
        });
    })
})