/**
 * Created by wjc on 2016/4/15.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var userSchema = new mongoose.Schema({
    username: { type: String, required: false, index: { unique: true, sparse : true } },
    password: { type: String },
    isAdmin: { type: Boolean,default:false },
	valid:{type:Number,default:1},
    phone: { type: String },
    realName: { type: String},
    deleted: { type: Boolean, default: false, index: true },
    createdTime: { type: Date, default: Date.now, index: true },
    updatedTime: { type: Date, default: Date.now, index: true }
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.password) return next();
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, crypted) {
            if (err) return next(err);
            console.log(crypted);
            user.password = crypted;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, matched) {
        if (err) return cb(err);
        cb(null, matched);
    });
};



exports.User = mongoose.model('User', userSchema);
