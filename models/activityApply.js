var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 活动报名
 * @type {Model|Aggregate|*}
 */
exports.ActivityApply = mongoose.model('ActivityApply', new Schema({
    realName: {type: String}, //真实姓名
    sex:{type:String},  //性别
    birthday:{type:String},  //出生年月
    nationality:{type:String},  //国籍
    blood:{type:String},  //血型
    phone: {type: String}, //电话、手机号码
    location:{type:String},  //居住地
    email:{type:String},  //邮箱
    contactAddress:{type:String},  //通信地址
    postCode:{type:String},  //邮编
    contactName:{type:String},  //紧急联系人
    contactPhone:{type:String},  //紧急联系人电话
    activityName: {type: String},//活动名称
    guardianPhone: {type: String},//监护人电话

    identification: {type: String}, //身份证,
    age:{type: String},//年龄
    job:{type: String},//职业

    deleted:{type:Boolean,default:false},
    createdTime: {type: Date, default: Date.now, index: true},
    updatedTime: {type: Date, default: Date.now, index: true}
}));

