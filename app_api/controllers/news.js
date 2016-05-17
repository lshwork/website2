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
    var limit = 2;
    var q = {deleted: false,enabled:true};
    async.parallel({
        news: function (callback) {
            New.find(q).skip(start).limit(limit).sort({createdTime: -1}).exec(callback);
        },
        count: function (callback) {
            New.count(q).exec(callback);
        }
    }, function (err, data) {
        if (err) return next(err);
        res.render('news', {
            title: '新闻管理',
            news: data.news,
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
    res.render('news/edit', {
        title: '添加新闻',
        singleNew: {enabled: true},
    });
};
exports.edit = function (req, res, next) {
    var id = req.query.id;
    New.findById(id).exec(function (err, singleNew) {
        if (err) return next(err);
        res.render('news/edit', {
            title: '修改新闻',
            singleNew: singleNew,
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
        enabled: req.body.enabled ? true : false
    };
    if(req.body.priority){
        singleNew.priority=req.body.priority;
    }
    req.checkBody('title', '新闻标题为必填项').notEmpty();
    req.checkBody('content', '新闻内容为必填项').notEmpty();
    req.checkBody('desc', '新闻摘要为必填项').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.render('news/edit', {
            title: id ? '修改新闻' : '新增新闻',
            errors: errors,
            singleNew: singleNew,
        });
    } else {
        req.singleNew = singleNew;
        next();
    }
};

exports.post = function (req, res, next) {
    var id = req.body.id;
    if (id) {
        // 修改
        New.findById(id, function (err, singleNew) {
            if (err) return next(err);
            extend(true, singleNew, req.singleNew, {
                updatedTime: Date.now()
            });
            singleNew.save(function (err) {
                if (err) return next(err);
                return res.redirect('/admin/news/');
            });
        });
    } else {
        // 新增
        var singleNew = new New(req.singleNew);
        singleNew.save(function (err) {
            if (err) return next(err);
            res.redirect('/admin/news/');
        });
    }
};

exports.updateDeleteStu = function (req, res, next) {
    var id = req.body.id;
    New.findById(id, function (err, singleNew) {
        if (err) return next(err);
        singleNew.deleted = req.body.deleted;
        singleNew.updatedTime = Date.now();
        singleNew.save(function (err) {
            if (err) return next(err);
            res.json({
                success: true
            });
        });
    });
};