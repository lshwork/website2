var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var config = require('./config');
var api = require('./app_api/app');
var admin = require('./app_admin/app');
var site = require('./app_site/app');

var app = express();

mongoose.connect(config.database);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use('/admin', admin);
app.use('/', site);

module.exports = app;
