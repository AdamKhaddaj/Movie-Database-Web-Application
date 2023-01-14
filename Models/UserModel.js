const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = mongoose.Schema({
    
    Username: {
        type : String,
        required: [true, "Please input a username"],
        trim : true,
        minlength: [1, "Sorry, username must be at least 1 character long"],
        maxlength: [25, "Sorry, username must be less than 25 characters long"],

    },
    Password: {
        type : String,
        required: [true, "Please input a password"],
        minlength: [1, "Sorry, password must be at least 1 characters long"],
        maxlength: [25, "Sorry, password must be less than 25 characters long"],
    },
    Contributor: {
        type: Boolean,
        default: false
    },
    Reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    BasicReviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'BasicReview'}],
    Watchlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    FollowedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    FollowedPeople: [{type: mongoose.Schema.Types.ObjectId, ref: 'People'}],
    Notifications: [String],

});

userSchema.statics.findUser = function(username, callback){
	this.find({Username: new RegExp(username, 'i')}, callback);
}

module.exports = mongoose.model('User', userSchema);
