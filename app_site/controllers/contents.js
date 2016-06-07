/**
 * Created by wjc on 2016/4/15.
 */
var Content = require('../../models/Content').Content;

exports.index = function (req, res, next) {
    var url=req.url;
    url=url.substring(url.indexOf("/")+1,url.length);
    url=url.substring(0,url.indexOf("?")==-1?url.length:url.indexOf("?"));
    Content.findOne({deleted:false,shorthand:url},{content:1}).exec(function(err,content){
        if (err) return next(err);
        return res.render(url, {
            contents: content.content
        });
    });
};

