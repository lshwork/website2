/**
 * Created by wjc on 2016/4/15.
 */
var Content = require('../../models/Content').Content;
var async = require('async');
var extend = require('extend');
var config = require('../../config');
var fs = require('fs');

exports.index = function (req, res, next) {
    var start = parseInt(req.query.start || 0);
    var limit = 10;
    var q = {deleted: false};
    if(req.query.parentName) q.parentName = new RegExp(req.query.parentName, "i");
    if(req.query.name) q.name = new RegExp(req.query.name, "i");
    async.parallel({
        contents: function (callback) {
            Content.find(q).skip(start).limit(limit).sort({parentName:1,updatedTime: -1}).exec(callback);
        },
        count: function (callback) {
            Content.count(q).exec(callback);
        }
    }, function (err, data) {
        if (err) return next(err);
        return res.render('contents/index', {
            title: '内容管理',
            contents: data.contents,
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
    return res.render('contents/edit', {
        title: '添加内容'
    });
};
exports.edit = function (req, res, next) {
    var id = req.query.id;
    Content.findById(id).exec(function (err, content) {
        if (err) return next(err);
        return res.render('contents/edit', {
            title: '修改内容',
            content: content
        });
    });
};

exports.beforePost = function (req, res, next) {
    var id = req.body.id;
    var content = {
        content: req.body.content
    };
    var errors = req.validationErrors();
    if (errors) {
        return res.render('content/edit', {
            title: id ? '修改内容' : '新增内容',
            errors: errors,
            content: content
        });
    } else {
        req.content = content;
        next();
    }
};

exports.post = function (req, res, next) {
    var id = req.body.id;
    if (id) {
        // 修改
        Content.findById(id, function (err, content) {
            if (err) return next(err);
            extend(true, content, req.content, {
                updatedTime: Date.now()
            });
            content.save(function (err) {
                if (err) return next(err);
                return res.redirect('/admin/contents/');
            });
        });
    } else {
        // 新增
        var content = new Content(req.content);
        content.save(function (err) {
            if (err) return next(err);
            return res.redirect('/admin/contents/');
        });
    }
};

exports.updateDeleteStu = function (req, res, next) {
    var id = req.body.id;
    Content.findById(id, function (err, content) {
        if (err) return next(err);
        content.deleted = req.body.deleted;
        content.updatedTime = Date.now();
        content.save(function (err) {
            if (err) return next(err);
            res.json({
                success: true
            });
        });
    });
};