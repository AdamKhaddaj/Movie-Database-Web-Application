const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let peopleSchema = mongoose.Schema({
    
    Name: String,
    ActedWorkHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    WrittenWorkHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    DirectedWorkHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]

});

peopleSchema.methods.getAllWorkHistory = function(callback){
    this.model("Movie")
    .find()
    .or([{Actors: {"$in": [this._id]}},{Writers: {"$in": [this._id]}},{Directors: {"$in": [this._id]}}])
    .exec(callback);
}

module.exports = mongoose.model('People', peopleSchema);
