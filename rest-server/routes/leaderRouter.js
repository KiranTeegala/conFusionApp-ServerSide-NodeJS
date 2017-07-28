
    var express = require('express');
    var leaderRouter = express.Router();

    var mongoose = require('mongoose');

    var leadership = require('../models/leadership');

    var Verify = require('./verify');
    
    leaderRouter.route('/')
    .get(Verify.verifyOrdinaryUser,function (req, res, next) {
    leadership.find({}, function (err, leadership) {
        if (err) throw err;
        res.json(leadership);
    });
})

.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    leadership.create(req.body, function (err, leadership) {
        if (err) throw err;
        console.log('leadership created!');
        var id = leadership._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leadership with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    leadership.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

    leaderRouter.route('/:leaderID')
    .get(Verify.verifyOrdinaryUser,function (req, res, next) {
    leadership.findById(req.params.leaderID, function (err, leadership) {
        if (err) throw err;
        res.json(leadership);
    });
})

.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    leadership.findByIdAndUpdate(req.params.leaderID, {
        $set: req.body
    }, {
        new: true
    }, function (err, leadership) {
        if (err) throw err;
        res.json(leadership);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    leadership.findByIdAndRemove(req.params.leaderID, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});


    module.exports =leaderRouter;