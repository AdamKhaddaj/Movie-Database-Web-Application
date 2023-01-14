const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = mongoose.Schema({
    
    Review: String,
    Title: String,
    Rating: Number,
    AssociatedUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    AssociatedMovie: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}

});

module.exports = mongoose.model('Review', reviewSchema);