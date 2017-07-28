
    var express = require('express');
    var promoRouter = express.Router();

    var mongoose = require('mongoose');

    var promotions = require('../models/promotions');

    var Verify = require('./verify');
    promoRouter.route('/')

    .get(Verify.verifyOrdinaryUser,function (req, res, next) {
    promotions.find({}, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    promotions.create(req.body, function (err, promotion) {
        if (err) throw err;
        console.log('promotion created!');
        var id = promotion._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the promotion with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    promotions.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


    promoRouter.route('/:promoID')

    .get(Verify.verifyOrdinaryUser,function (req, res, next) {
    promotions.findById(req.params.promoID, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    promotions.findByIdAndUpdate(req.params.promoID, {
        $set: req.body
    }, {
        new: true
    }, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    promotions.findByIdAndRemove(req.params.promoID, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});


    module.exports =promoRouter;