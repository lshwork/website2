var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var utils = require('../utils');
var news=require('./controllers/news')
/* GET home page. */

router.use(utils.checkCookie);
router.get('/news',news.index);
router.get('/newsDetail',news.detail);
router.get('/',function(req,res){
    return res.render('index')
});
router.get('/index',function(req,res){
    return res.render('index')
});

router.get('/about',function(req,res){
    return res.render('about')
});
router.get('/news_show',function(req,res){
    return res.render('news_show')
});
router.get('/chairman',function(req,res){
    return res.render('chairman')
});
router.get('/team',function(req,res){
    return res.render('team')
});
router.get('/deeds',function(req,res){
    return res.render('deeds')
});
router.get('/culture',function(req,res){
    return res.render('culture')
});
router.get('/territory',function(req,res){
    return res.render('territory')
});
router.get('/framework',function(req,res){
    return res.render('framework')
});
router.get('/industry',function(req,res){
    return res.render('industry')
});
router.get('/service',function(req,res){
    return res.render('service')
});
router.get('/operate',function(req,res){
    return res.render('operate')
});
router.get('/marketing',function(req,res){
    return res.render('marketing')
});
router.get('/media',function(req,res){
    return res.render('media')
});
router.get('/recruit',function(req,res){
    return res.render('recruit')
});
router.get('/contact',function(req,res){
    return res.render('contact')
});
router.get('/bm',function(req,res){
    return res.render('bm')
});
router.get('/recruitDetail',function(req,res){
    var id=req.query.id;
    return res.render('recruitDetail',{
        id:id
    })
});
module.exports = router;
