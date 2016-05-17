/**
 * Created by wjc on 2016/4/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
/**
 * 新闻
 * @type {Model|Aggregate|*}
 */
exports.New = mongoose.model('New', new Schema({
    title:{type:String,index:{ unique: true, sparse : true } },
    image: {type: String,require:false},
    desc: {type: String},
    type:{type:String},  //1:德天动态  2:体育新闻 3:招纳贤士
    priority:{type:Number,default:0},//优先级
    content: {type: String},
    enabled:{type:Boolean,default:true},
    deleted:{type:Boolean,default:false},
    createdUser:{type:ObjectId,ref:"User"},
    updatedUser:{type:ObjectId,ref:"User"},
    createdTime: {type: Date, default: Date.now, index: true},
    updatedTime: {type: Date, default: Date.now, index: true}
}));