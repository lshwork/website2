/**
 * Created by wjc on 2016/4/15.
 */
var express = require('express');
var expressValidator = require('express-validator');
var hbs = require('hbs');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./router');

var paginate = require('../helpers/paginate');

var app = express();
var blocks = {};

hbs.registerHelper('extend', function (name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function (name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

hbs.registerHelper("formatDate", function (timestamp) {
    if (!timestamp) {
        return "";
    }
    var time = moment(timestamp).format('YYYY-MM-DD HH:mm');
    return time;
});
hbs.registerHelper("formatDateYYYYMMDD", function (timestamp) {
    if (!timestamp) {
        return "";
    }
    var time = moment(timestamp).format('YYYY-MM-DD');
    return time;
});

hbs.registerHelper("timeRange", function (from, to) {
    if (from && to) {
        return from + "-" + to;
    }
    return "";
});
/*
var obj = setInterval(function(){
    console.log(1)
}, 1000);
*/

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

hbs.registerHelper("myif", function (type, number, options) {
    if (type == number) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
hbs.registerHelper("urlConvert", function (url) {
    var string='';
    string+='<input type=\"hidden\" name=\"images\" value=\"'+url+'\">';
    return string;
});
hbs.registerHelper("arrayConvert", function (array) {
    var names="";
   for(var i=0;i<array.length;i++){
       if(i==array.length-1){
           names+=array[i].name;
       }else{
           names+=array[i].name+",";
       }
   }
    return "<td  style='text-align: center'>"+names+"</td>";
});
hbs.registerHelper("firstImage", function (images) {
    var image="/public/site/image/btn_pic@2x.png";
    if(images.length > 0 && images[0].url){
        image=images[0].url;
    }
    return image;
});

hbs.registerHelper('paginate', paginate);

hbs.registerPartials(path.join(__dirname, 'views/partials'));
//hbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        return res.render('error', {
            layout: false,
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    return res.render('error', {
        layout: false,
        message: err.message,
        error: {}
    });
});


module.exports = app;