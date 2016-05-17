/**
 * Created by wjc on 2016/4/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.Content = mongoose.model('Content', new Schema({
    parentName: {type: String,require:false},
    name: {type: String,require:false},
    shorthand: {type: String,require:false},
    desc: {type: String},
    content: {type: String},
    deleted:{type:Boolean,default:false},
    createdTime: {type: Date, default: Date.now, index: true},
    updatedTime: {type: Date, default: Date.now, index: true}
}));