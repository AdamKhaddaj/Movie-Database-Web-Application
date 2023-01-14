const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BasicReviewSchema = mongoose.Schema({

    Rating: Number,
    AssociatedUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    AssociatedMovie: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}

});

module.exports = mongoose.model('BasicReview', BasicReviewSchema);