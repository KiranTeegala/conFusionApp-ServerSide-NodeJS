var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var favorites = require('../models/favorites');

var favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json());

var verify = require('./verify');

favoritesRouter.route('/')
	.all(verify.verifyOrdinaryUser)
	.get(function (req, res, next) {
		var id=req.decoded._doc._id;
        favorites.find({
                'postedBy': id
            })
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, favorites) {
                if (err) return err;
                res.json(favorites);
            });
    })
.post(function (req, res, next) {
        favorites.find({'postedBy': req.decoded._doc._id})
            .exec(function (error, dishes) {
                if (error) throw error;
                req.body.postedBy = req.decoded._doc._id;
                if (dishes.length) {
                    var alreadypresent = false;
                    if (dishes[0].dishes.length) {
                        for (var i = (dishes[0].dishes.length - 1); i >= 0; i--) {
                            alreadypresent = dishes[0].dishes[i] == req.body._id;

                            if (alreadypresent) {
                                break;
                            }
                        }
                    }

                    if (!alreadypresent) {
                    	var id=req.body._id;
                        dishes[0].dishes.push(id);
                        dishes[0].save(function (err, favdish) {
                            if (err) throw err;
                            res.json(favdish);
                        });
                    } else {
                        res.json(dishes);
                    }
                } else {
                    favorites.create({
                        postedBy: req.body.postedBy
                    }, function (err, favdish) {
                        if (err) throw err;
                        favdish.dishes.push(req.body._id);
                        favdish.save(function (err, favdish) {
                            if (err) throw err;
                            res.json(favdish);
                        });
                    })
                }
            });
    })

.delete(function (req, res, next) {
        favorites.remove({'postedBy': req.decoded._doc._id}, 
        	function (err, resp) {
            if (err) throw err;
            res.json(resp);
        })
    });

favoriteRouter.route('/:dishId')
    .all(verify.verifyOrdinaryUser)
    .delete(function (req, res, next) {

        favorites.find({'postedBy': req.decoded._doc._id}, 
        	function (err, favdishes) {
            if (err) return err;
            
            if (favdishes) {
            	var fav =favdishes[0];
            } else {
            	var fav =null;
            }

            if (fav) {
                for (var i = (fav.dishes.length - 1); i >= 0; i--) {
                    if (fav.dishes[i] == req.params.dishId) {
                        fav.dishes.remove(req.params.dishId);
                    }
                }
                fav.save(function (err, fav) {
                    if (err) throw err;
                    res.json(fav);
                });
            } else {
                res.json(fav);
            }

        });
    });

module.exports =favoritesRouter;