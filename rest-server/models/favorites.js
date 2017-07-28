var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Dishes = require('../models/dishes');
var User = require('../models/user');


var favoriteSchema = new Schema({

        dishes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dishes'
        }],
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var favorites = mongoose.model('favorites', favoriteSchema);

// make this available to our Node applications
module.exports = favorites;