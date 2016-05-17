/**
 * Created by wjc on 2016/4/15.
 */
var New = require('../../models/new').New;
var async = require('async');
var extend = require('extend');
var config = require('../../config');
var fs = require('fs');

exports.index = function (req, res, next) {
    var start = parseInt(req.query.start || 0);
    var limit = 10;
    var q = {deleted: false,type:3};
    if(req.query.title) q.title = new RegExp(req.query.title, "i");
    async.parallel({
        jobs: function (callback) {
            New.find(q).populate('createdUser',{realName:1}).populate('updatedUser',{realName:1}).skip(start).limit(limit).sort({priority:-1,createdTime: -1}).exec(callback);
        },
        count: function (callback) {
            New.count(q).exec(callback);
        }
    }, function (err, data) {
        if (err) return next(err);
        res.render('jobs/index', {
            title: '招聘管理',
            jobs: data.jobs,
            pagination: {
                start: start,
                limit: limit,
                total: data.count,
                query: req.query
            }
        });
    });
};


exports.add = function (req, res, next) {
    res.render('jobs/edit', {
        title: '添加职位',
        singleNew: {enabled: true}
    });
};
exports.edit = function (req, res, next) {
    var id = req.query.id;
    New.findById(id).exec(function (err, singleNew) {
        if (err) return next(err);
        res.render('jobs/edit', {
            title: '修改职位',
            singleNew: singleNew
        });
    });
};

exports.beforePost = function (req, res, next) {
    var id = req.body.id;
    var image=req.body.imageUrl;
    var singleNew = {
        title: req.body.title,
        image: image,
        desc: req.body.desc,
        content: req.body.content,
        type:req.body.type,
        enabled: req.body.enabled ? true : false
    };
    if(req.body.priority){
        singleNew.priority=req.body.priority;
    }
    req.checkBody('title', '职位名称为必填项').notEmpty();
    req.checkBody('content', '内容为必填项').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.render('jobs/edit', {
            title: id ? '修改职位' : '新增职位',
            errors: errors,
            singleNew: singleNew
        });
    } else {
        req.singleNew = singleNew;
        next();
    }
};

exports.post = function (req, res, next) {
    var id = req.body.id;
    var currentUserId=req.currentUserId;
    if (id) {
        // 修改
        New.findById(id, function (err, singleNew) {
            if (err) return next(err);
            extend(true, singleNew, req.singleNew, {
                updatedTime: Date.now(),
                updatedUser:currentUserId
            });
            singleNew.save(function (err) {
                if (err) return next(err);
                return res.redirect('/admin/jobs/');
            });
        });
    } else {
        // 新增
        var singleNew = new New(req.singleNew);
        singleNew.createdUser=currentUserId;
        singleNew.updatedUser=currentUserId;
        singleNew.save(function (err) {
            if (err) return next(err);
            res.redirect('/admin/jobs/');
        });
    }
};

exports.updateDeleteStu = function (req, res, next) {
    var id = req.body.id;
    var currentUserId=req.currentUserId;
    New.findById(id, function (err, singleNew) {
        if (err) return next(err);
        singleNew.deleted = req.body.deleted;
        singleNew.updatedTime = Date.now();
        singleNew.updatedUser=currentUserId;
        if(singleNew.image){
            var filePath=config.basePath+singleNew.image;
            fs.exists(filePath, function( exists ){
                if(exists){
                    fs.unlink(filePath,function(){
                    });
                }
            });
        }
        singleNew.save(function (err) {
            if (err) return next(err);
            res.json({
                success: true
            });
        });
    });
};

