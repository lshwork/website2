/**
 * Created by wjc on 2016/4/15.
 */
var ActivityApply = require('../../models/activityApply').ActivityApply;
var extend = require('extend');
var xlsx = require('node-xlsx');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var async = require('async');

exports.index=function(req,res,next){
    var start = parseInt(req.query.start || 0);
    var limit = 10;
    var q = {deleted:false};
    if(req.query.activityName) q.activityName =req.query.activityName;
    if(req.query.phone) q.phone =req.query.phone;
    if(req.query.realName) q.realName = new RegExp(req.query.realName, "i");
    if(req.query.sex) q.sex = req.query.sex;
    async.parallel({
        activityApplies: function(callback) {
            ActivityApply.find(q).skip(start).limit(limit).sort({createdTime: -1}).exec(callback);
        },
        count: function(callback) {
            ActivityApply.count(q, callback)
        }
    }, function(err, data) {
        if (err) return next(err);
        return res.render('activityApplies/index', {
            title: '报名管理',
            activityApplies: data.activityApplies,
            pagination: {
                start: start,
                limit: limit,
                total: data.count,
                query: req.query
            }
        });
    });
};

exports.edit = function(req, res, next) {
    var id = req.query.id;
    ActivityApply.findById(id, function (err, activityApply) {
        if (err) return next(err);
            return res.render('activityApplies/edit', {
                title: '修改报名信息',
                activityApply: activityApply
            });
    });
};

exports.beforePost = function(req, res, next) {
    var id = req.body.id;
    var sex=req.body.sex?1:0;
    var activityApply = {
        realName: req.body.realName,
        sex: sex,
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
    /*  req.checkBody('realName', '联系姓名是必填项').notEmpty();
     req.checkBody('phone', '联系电话是必填项').notEmpty();
     req.checkBody('phone', '手机号码格式不正确').matches(phoneReg);*/
    var errors = req.validationErrors();
    if (errors) {
        return res.render('activityApplies/edit', {
            errors: errors,
            title: id ? '修改报名信息' : '新增报名',
            activityApply: activityApply
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
                return res.redirect("/admin/activityApplies");
            });
        });
    } else {
        // 新增
        var activityApply = new ActivityApply(req.activityApply);
        activityApply.save(function(err) {
            if (err) return next(err);
            return res.redirect("/admin/activityApplies");
        });
    }
};

exports.updateDeleteStu=function(req,res,next){
    var id=req.body.id;
    ActivityApply.findById(id, function (err, activityApply) {
        if (err) return next(err);
        activityApply.deleted = req.body.deleted;
        activityApply.updatedTime = Date.now();
        activityApply.save(function (err) {
            if (err) return next(err);
            return res.redirect("/admin/activityApplies");
        });
    });
};

exports.exportExcel=function(req,res,next){
    var start = parseInt(req.query.start || 0);
    var activityName=req.query.activityName;
    var phone=req.query.phone;
    var realName=req.query.realName;
    var sex = req.query.sex;
    var q={deleted:false};
    if(activityName) q.activityName=activityName;
    if(phone) q.phone=phone;
    if(sex) q.phone=sex;
    if(realName) q.realName=new RegExp("" + realName + "", "i");
    async.parallel({
        activityApplies: function (callback) {
            ActivityApply.find(q).skip(start).sort({createdTime: -1}).exec(callback);
        }
    }, function (err, option) {
        if (err) return next(err);
        //  var data1 = [['订单编号',2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
        var data=[];
        data[0]=['活动名称','真实姓名','性别','出生年月','国籍','血型','手机号码','居住地','邮箱','报名时间','通信地址','邮编','紧急联系人','紧急联系人电话','监护人电话','身份证'];
        for(var i=1;i<option.activityApplies.length+1;i++){
            var activityApply=option.activityApplies[i-1];
            data[i]=[activityApply.activityName, activityApply.realName,activityApply.sex==1?'男':'女', activityApply.birthday
                ,activityApply.nationality,activityApply.blood,activityApply.phone,activityApply.location,activityApply.email,activityApply.contactAddress,moment(activityApply.createdTime).format("YYYY-MM-DD"),activityApply.postCode,activityApply.contactName,activityApply.contactPhone,activityApply.guardianPhone,activityApply.identification];
        }
        var buffer = xlsx.build([{name: "报名清单", data: data}]);
        var file =moment().format("YYYYMMDDHHmmssss")+'.xlsx';
        fs.writeFileSync(file, buffer, 'binary');
        var filename ="报名清单_"+ path.basename(file);
        var mimetype = mime.lookup(file);        //匹配文件格式

        res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(filename));
        res.setHeader('Content-type', mimetype);
        var filestream = fs.createReadStream(file).pipe(res);
		if( fs.existsSync(file) ) {
			fs.unlink(file);
		}
    });

};