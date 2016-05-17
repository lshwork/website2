/**
 * Created by wjc on 2016/4/15.
 */
var redis = require('redis');
var User = require('./models/user').User;
var redisClient = redis.createClient();

exports.redisClient = redisClient;

exports.isAdmin = function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.cookies.token || req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        return res.redirect('/admin/login');
    }
    redisClient.get('token:'+token, function(err, user_id) {
        if (!user_id) {
            return res.redirect('/admin/login');
        }
        User.findById(user_id, function(err, user) {
            if (!user) {
                return res.redirect('/admin/login');
            }
            req.currentUserId = user_id;
            req.currentUser = user;
            res.locals.currentUser = user;
            next();
        });
    });
};

