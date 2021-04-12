var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');       
var fs = require('fs');
var router = app.Router();
var articleModel = require('../../../modules/articles'); 
var admin = require('../../../modules/admin');
var sessionstorage = require('sessionstorage');

//storage for Image Upload
var Storage = multer.diskStorage({

    // destination: './public/images/backend/admins/',
    filename: function(req,file,cb){
        console.log(cb)
      var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null,file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname) );
    }
});
  
var upload = multer({
    storage:Storage
}).single('articleimage');


router.get('/index',function(req,res,next){

    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});
    userData.exec(function(admindataErr,admindata){
        res.render('backend/magazine/index',{adminType,title:"Magazine List",dateFormat,admindata});
    });
});


router.get('/create',checkPublication,function(req,res,next){
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});

    userData.exec(function(admindataErr,admindata){
        res.render('backend/magazine/create',{adminType,title:"Magazine List",admindata});
    });
});













module.exports = router;
