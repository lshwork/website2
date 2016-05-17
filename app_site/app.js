/**
 * Created by wjc on 2016/4/15.
 */
var express = require('express');
var path = require('path');
var hbs = require('hbs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var moment=require('moment');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var router = require('./router');
var config = require('../config');
var sitePaginate = require('../helpers/sitePaginate');
var app = express();


/*hbs.registerHelper("formatDate", function(timestamp) {
    var time=moment(timestamp).format('YYYY-MM-DD HH:MM');
    return time;
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

app.use('/', router);

hbs.registerHelper('sitePaginate', sitePaginate);
hbs.registerHelper('equal', function (lvalue, rvalue, options) {
    if (arguments.length < 3) {
        throw new Error('Handlebars Helper equal needs 2 parameters');
    }
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

hbs.registerHelper('compare', function (lvalue, rvalue, options) {
    if (arguments.length < 3) {
        throw new Error('Handlebars Helper equal needs 2 parameters');
    }
    if (lvalue <= rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});
hbs.registerHelper("formatDateYYYYMMDD", function (timestamp) {
    if (!timestamp) {
        return "";
    }
    var time = moment(timestamp).format('YYYY-MM-DD');
    return time;
});
hbs.registerHelper("formatDateMMDD", function (timestamp) {
    if (!timestamp) {
        return "";
    }
    var time = moment(timestamp).format('MM/DD');
    return time;
});
hbs.registerHelper("formatDate", function (timestamp) {
    if (!timestamp) {
        return "";
    }
    var time = moment(timestamp).format('YYYY-MM-DD HH:mm');
    return time;
});
hbs.registerHelper("formatArr", function (arr) {
    var string="";
    if (!arr) {
        return string;
    }
    arr.forEach(function(a){
        string+= a.msg+"  ";
    });
    return string;
});
hbs.registerHelper("promoCodeValue", function (promoCodes) {
    if(promoCodes.length>0){
        return promoCodes[0].value;
    }else{
        return "未使用优惠券";
    }

});
hbs.registerHelper("totalPrice", function (price,count) {
    price=parseFloat(price);
    return  (price*count).toFixed(2);
});
hbs.registerHelper("firstImage", function (images) {
    var image="/public/site/image/btn_pic@2x.png";
    if(images.length > 0 && images[0].url){
        image=images[0].url;
    }
    return image;
});

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
