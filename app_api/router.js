/**
 * Created by wjc on 2016/4/15.
 */
var express = require('express');
var router = express.Router();
var utils = require('./../utils');
var jobs=require('./controllers/jobs');
var activityApplies=require('./controllers/activityApplies');

router.get('/getJobs',jobs.list);  //招纳贤士列表
router.get('/getJobDetail',jobs.detail); //招纳贤士详情


router.post('/activityApplies/post',activityApplies.beforePost,activityApplies.post); //报名

module.exports = router;