/**
 * Created by wjc on 2016/4/15.
 */

var async = require('async');
var uuid = require('node-uuid');
var utils = require('../../utils');
var User = require('../../models/user').User;
var New = require('../../models/new').New;
var ActivityApply = require('../../models/activityApply').ActivityApply;
var config = require('../../config');
var fs = require('fs');
/*__dirname//当前路径
__filename//当前在执行的js文件路径*/
exports.index = function (req, res, next) {
    async.parallel({
        userCount: function (callback) {
            User.count({deleted: false}, callback);
        },
        activityAppliesCount: function (callback) {
            ActivityApply.count({deleted: false}, callback);
        },
        newCount: function (callback) {
            New.count({deleted: false,type:{$in:[1,2]}}, callback);
        }
    }, function (err, data) {
        if (err) return next(err);
        res.render('index', {
            title: '主页',
            userCount: data.userCount,
            activityAppliesCount: data.activityAppliesCount,
            newCount: data.newCount
        });
    });
};

exports.login = function (req, res) {
    res.render('login', {layout: false});
};
exports.postLogin = function (req, res, next) {
    req.checkBody('username', '用户名不能为空').notEmpty();
    req.checkBody('password', '密码不能为空').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.render('login', {
            layout: false,
            errors: errors,
            username: req.body.username,
            rememberMe: req.body.rememberMe
        });
    }
    var username = req.body.username;
    var password = req.body.password;
    var rememberMe = req.body.rememberMe;
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) return next(err);
        if ((!user)) {
            var errors = [{msg: '登录信息不正确或没有管理权限'}];
            return res.render('login', {
                layout: false,
                errors: errors,
                username: req.body.username,
                rememberMe: req.body.rememberMe
            });
        }
        user.comparePassword(password, function (err, matched) {
            var errors = [{msg: '邮箱或密码不正确'}];
            if (!matched) {
                return res.render('login', {
                    layout: false,
                    errors: errors,
                    username: req.body.username,
                    rememberMe: req.body.rememberMe
                });
            }
            // if user is found and password is right
            // create a token
            var token = (new Buffer(uuid.v4())).toString('base64');
            var seconds = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
            utils.redisClient.setex('token:' + token, seconds, user.id);
            res.cookie('token', token, {
                maxAge: seconds * 1000,
                httpOnly: true,
                path: '/'
            });
            res.redirect('/admin/');
        });
    });
};

exports.logout = function (req, res, next) {
    var token = req.cookies.token || req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        return res.redirect('/admin/login');
    }

    utils.redisClient.del('token:' + token, function (err, reply) {
        if (err) return next(err);
        res.clearCookie('token', {
            httpOnly: true,
            path: '/'
        });
        return res.redirect('/admin/login');
    });
};



exports.upload=function(req,res,next){
    console.log(req.file);
    var url = "/public/upload/"+req.file.filename;
    var json={
        initialPreview: [
            "<img style='height:160px' src='" + url + "' class='file-preview-image'>"
        ],
        initialPreviewConfig: [
            {caption: req.file.originalname, width: '120px', url: '/admin/image/delete', key: url}
        ],
        append: true,
        url: url,
        key:url
    };
    if(req.body.kingEditor=="kingEditor") json.error=0;
    return res.json(json);
};

exports.imageDelete=function(req,res,next){
    var key=req.body.key;
    var filePath=(config.basePath+key).replace(/\\/g,'/');
    console.log(filePath);
    fs.exists(filePath, function( exists ){
        if(exists){
            fs.unlink(filePath,function(){
            });
        }
    });
    return res.json({
       success:true
    });
};