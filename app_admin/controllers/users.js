/**
 * Created by wjc on 2016/4/15.
 */
var async = require('async');
var extend = require('extend');
var User = require('../../models/user').User;
var config = require('../../config');
var fs=require('fs');

exports.isAdmin=function(req,res,next){
    var currentUser=req.currentUser;
    if(currentUser.isAdmin){
        next();
    }else{
        return res.redirect("/admin");
    }
};

exports.index = function (req, res, next) {
    var limit = 20;
    var start = parseInt(req.query.start || 0);
    var q = {deleted: false};
    if (req.query.phone) q.phone = req.query.phone;
    if(req.query.username) q.username = new RegExp(req.query.username, "i");
    async.parallel({
        users: function (callback) {
            User.find(q).skip(start).limit(limit).sort({updatedTime: -1}).exec(callback);
        },
        count: function (callback) {
            User.count(q, callback)
        }
    }, function (err, data) {
        if (err) return next(err);
        res.render('users/index', {
            title: '用户管理',
            users: data.users,
            pagination: {
                start: start,
                limit: limit,
                total: data.count,
                query:req.query
            }
        });
    });
};

exports.add = function (req, res) {
    return res.render('users/edit', {
        title: '新增用户'
    });
};

exports.edit = function (req, res, next) {
    var id = req.query.id;
    User.findById(id).exec(function (err, user) {
        if (err) return next(err);
        return res.render('users/edit', {
            title: '修改用户',
            user: user
        });
    });
};

exports.beforePost = function (req, res, next) {
    var id = req.body.id;
    var password = req.body.password;
    var username=req.body.username;
    var phone=req.body.phone;
    var user = {
        id: id,
        phone: req.body.phone,
        realName:req.body.realName,
        username:username
    };
    req.checkBody('username', '用户名是必填项').notEmpty();
    var phoneReg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    if(phone) req.checkBody('phone', '手机号码格式不正确').matches(phoneReg);
    if(!id){
        req.checkBody('password', '新增时密码为必填项').notEmpty();
    }
    if (password) {
        req.checkBody('password', '密码至少要6位以上').len(6);
        req.checkBody('confirmPassword', '两次密码必须相同').equals(password);
    }
    async.parallel({
        existUsername:function(callback){
            User.findOne({username:username},{username:1}).exec(callback);
        }
    },function(err,data){
        if(!id&&data.existUsername){
           req.checkBody('username', '用户名已被使用').len(100);
        }
    var errors = req.validationErrors();
    if (errors) {
        return res.render('users/edit', {
            title: id ? '修改用户' : '新增用户',
            errors: errors,
            user: user
        });
    } else {
        req.user = user;
        next();
    }
    });
};

exports.post = function (req, res, next) {
    var id = req.body.id;
    var redirect='/admin/users/';
    if (id) {
        // 修改
        User.findById(id, function (err, user) {
            if (err) return next(err);
            extend(true, user, req.user, {
                updatedTime: Date.now()
            });
            if (req.body.password) user.password = req.body.password;
            user.save(function (err) {
                if (err) return next(err);
                return res.redirect(redirect);
            });
        });
    } else {
        // 新增
        console.log(req.user);
        var user = new User(req.user);
        user.password = req.body.password;
        user.save(function (err) {
            if (err) return next(err);
            res.redirect(redirect);
        });
    }
};

exports.updateDeleteStu = function (req, res, next) {
    var id = req.body.id;
    User.findById(id, function (err, user) {
        if (err) return next(err);
        if(user&&user.isAdmin){
            return  res.status(200).send({
                success: false
            });
        }
        user.deleted = req.body.deleted;
        user.updatedTime = Date.now();
        user.save(function (err) {
            if (err) return next(err);
            return res.json({
                success: true
            });
        });
    });
};


exports.upload=function(req,res,next){
    console.log(req.files);
    return res.json({
        url:config.filePath+req.file.filename,
        width:640,
        height:640
    });
};