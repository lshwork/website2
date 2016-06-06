/**
 * Created by wjc on 2016/4/15.
 */
var ActivityApply = require('../../models/activityApply').ActivityApply;
var extend = require('extend');
var async = require('async');

exports.beforePost = function(req, res, next) {
    var id = req.body.id;
    var activityApply = {
        realName: req.body.realName,
        sex: req.body.sex,
        birthday: req.body.birthday,
        nationality: req.body.nationality,
        blood: req.body.blood,
        phone: req.body.phone,
        location: req.body.location,
        email: req.body.email,
        contactAddress: req.body.contactAddress,
        postCode: req.body.postCode,
        contactName: req.body.contactName,
        contactPhone: req.body.contactPhone,
        activityName: req.body.activityName,
        guardianPhone: req.body.guardianPhone,
		identification:req.body.identification
        /*age: req.body.age,
        job: req.body.job,
        phone:req.body.phone*/
    };
    var phoneReg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    req.checkBody('realName', '姓名是必填项').notEmpty();
    req.checkBody('phone', '联系电话是必填项').notEmpty();
    req.checkBody('phone', '手机号码格式不正确').matches(phoneReg);
    var errors = req.validationErrors();
    if (errors) {
        return res.json({
            errors: errors
        });
    } else {
        req.activityApply = activityApply;
        next();
    }
};

exports.post = function(req, res, next) {
    var id = req.body.id;
    if (id) {
        // 修改
        ActivityApply.findById(id, function(err, activityApply) {
            if (err) return next(err);
            extend(true, activityApply, req.activityApply, {
                updatedTime: Date.now()
            });
            activityApply.save(function(err) {
                if (err) return next(err);
                return res.json({
                    success:true
                });
            });
        });
    } else {
        // 新增
        var activityApply = new ActivityApply(req.activityApply);
        activityApply.save(function(err) {
            if (err) return next(err);
            return res.json({
                success:true
            });
        });
    }
};