/**
 * Created by wjc on 2016/4/15.
 */
var New = require('../../models/new').New;
var async = require('async');
var extend = require('extend');
var config = require('../../config');
var fs = require('fs');

exports.list = function (req, res, next) {
    var start = parseInt(req.query.start || 0);
    var limit = 10;
    var q = {deleted: false,type:3,enabled:true};
    async.parallel({
        jobs: function (callback) {
            New.find(q,{title:1,priority:1}).skip(start).limit(limit).sort({priority:-1,createdTime: -1}).exec(callback);
        }
    }, function (err, data) {
        if (err) return next(err);
        return res.json({
            success:true,
            jobs:data.jobs
        })
    });
};
exports.detail = function (req, res, next) {
    var id = req.query.id;
    New.findById(id,{title:1,content:1,_id:0}).exec(function (err, singleNew) {
        if (err) return next(err);
        return res.json({
            success:true,
            job:singleNew
        });
    });
};


