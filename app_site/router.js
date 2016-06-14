var express = require('express');
var router = express.Router();
var utils = require('../utils');
var news=require('./controllers/news');
var contents=require('./controllers/contents');
/* GET home page. */


router.get('/news',news.index);
router.get('/newsDetail',news.detail);

router.get('/industry',news.industryIndex);
router.get('/industryDetail',news.industryDetail);

router.get('/',function(req,res){
    return res.render('index')
});
router.get('/index',function(req,res){
    return res.render('index')
});

router.get('/about',contents.index);
router.get('/chairman',contents.index);
router.get('/team',contents.index);
router.get('/deeds',contents.index);
router.get('/culture',contents.index);
router.get('/territory',contents.index);
router.get('/framework',contents.index);
router.get('/service',contents.index);
router.get('/operate',contents.index);
router.get('/marketing',contents.index);
router.get('/media',contents.index);
router.get('/recruit',function(req,res){
    return res.render('recruit')
});
router.get('/contact',contents.index);

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
