/**
 * Created by wjc on 2016/4/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.Advertisement = mongoose.model('Advertisement',new Schema({
    ADLocation:{type:Number,require:true,index:true},  //1:首页 2:物业 3:到家服务 4:社区团购 5:家庭金融
    images:{type:Array,require:true},
    deleted:{type:Boolean,default:false},
    createdTime: { type: Date, default: Date.now, index: true },
    updatedTime: { type: Date, default: Date.now, index: true }
}));