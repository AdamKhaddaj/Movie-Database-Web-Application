const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = mongoose.Schema({
    
    Title:{
        type: String,
        required: [true, "Please inut the movie title"],
        minlength: [1, "Title must be more than 1 char"],
        trim: true
    },
    Year: String,
    Rated: String,
    Released: String,
    Runtime: String,
    Genre: [String],
    Directors: [{type: mongoose.Schema.Types.ObjectId, ref: 'People'}],
    Writers: [{type: mongoose.Schema.Types.ObjectId, ref: 'People'}],
    Actors: [{type: mongoose.Schema.Types.ObjectId, ref: 'People'}],
    Reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    BasicReviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'BasicReview'}],
    Plot: String,
    Awards: String,
    Poster: String

});

movieSchema.methods.getSimilarMovies = function(callback){
    this.model("Movie").find().where("_id").ne(this._id).where("Genre").all(getGenres(this.Genre)).limit(5).select("_id").exec(callback);
}

//helper func to return array of genres for selected movie
function getGenres(genres){
    let length = 0
    if(genres < 2){
        length = genres.length;
    }
    else{
        length = 2;
    }

    let genrelist = [];
    let count = 0;
    do{
        let i = Math.floor(Math.random() * genres.length);
        let genreAt = genres[i];

        if (!genrelist.includes(genreAt)){
            genrelist.push(genreAt);
            count++;
        }
    } while (count<length)
    
    return genrelist;
}

module.exports = mongoose.model('Movie', movieSchema);
