/**
 * Created by wjc on 2016/4/15.
 */
var express = require('express');
var multer = require('multer');
var moment = require('moment');

var config = require('../config');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.upload)
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, moment(Date.now()).format('YYYYMMDDHHmmssSSSS') + file.originalname);
    }
});
var upload = multer({
    /*fileFilter: function (req, file, cb) {
        var reg = /(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$/;
        return cb(null, reg.test(file.originalname));
    },*/
    storage: storage
});
var router = express.Router();
var utils = require('../utils');
var home = require('./controllers/home');
var users = require('./controllers/users');
var news = require('./controllers/news');
var jobs = require('./controllers/jobs');
var activityApplies=require('./controllers/activityApplies');
var contents=require('./controllers/contents');
router.get('/login', home.login);
router.post('/postLogin', home.postLogin);
/*router.use(utils.isAdmin);*/


/*router.post('/pic/upload/:imageType', upload.single('image'), home.upload);
router.post('/pic/uploadKindEditor/:imageType', upload.single('image'), home.uploadKindEditor);*/
router.use(utils.isAdmin);
router.post('/pic/upload', upload.single('file'), home.upload);


router.get('/', home.index);
router.get('/logout', home.logout);
router.get('/users/',users.isAdmin, users.index);
router.get('/users/add',users.isAdmin, users.add);
router.get('/users/edit',users.isAdmin, users.edit);
router.post('/users/post',users.isAdmin, users.beforePost, users.post);
router.post('/users/delete',users.isAdmin, users.updateDeleteStu);
/*router.post('/users/pic/upload/:fileKey', upload.single('avatar'), users.upload);*/

router.post('/image/delete', home.imageDelete);

router.get('/news', news.index);
router.get('/news/add', news.add);
router.get('/news/edit', news.edit);
router.post('/news/post', news.beforePost, news.post);
router.post('/news/delete', news.updateDeleteStu);

router.get('/jobs', jobs.index);
router.get('/jobs/add', jobs.add);
router.get('/jobs/edit', jobs.edit);
router.post('/jobs/post', jobs.beforePost, jobs.post);
router.post('/jobs/delete', jobs.updateDeleteStu);

router.get('/activityApplies',activityApplies.index);
router.post('/activityApplies/post', activityApplies.beforePost, activityApplies.post);
router.get('/activityApplies/edit', activityApplies.edit);
router.get('/activityApplies/exportExcel',activityApplies.exportExcel);
router.post('/activityApplies/delete', activityApplies.updateDeleteStu);

router.get('/contents',contents.index);
router.get('/contents/add', contents.add);
router.post('/contents/post', contents.beforePost, contents.post);
router.get('/contents/edit', contents.edit);
router.post('/contents/delete',contents.updateDeleteStu);

module.exports = router;