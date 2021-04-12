var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');       
var fs = require('fs');
var router = app.Router();
var videosModel = require('../../../modules/videos'); 
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



checkPublication = async function(req,res,next){
    var userId = req.cookies.userId;
    var userDetails = await admin.findOne({_id:userId}).populate('admin_type')
    if(userDetails.admin_type.admin_type == 'Publication'){
      res.render('404');
    }
    next();
  
  }
  


router.get('/index',checkPublication,function(req,res,next){
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var article = videosModel.find({});
    var userData = admin.findOne({_id:userId});

    article.exec(function(err,data){
        userData.exec(function(admindataErr,admindata){
            res.render('backend/videos/index',{adminType,title:"Videos List",records:data,dateFormat,admindata});
        });
    });
});

router.get('/create',function(req,res,next){
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});

    userData.exec(function(admindataErr,admindata){
        res.render('backend/videos/create',{adminType,title:"Videos List",admindata});
    });
});



router.post('/store',upload,function(req,res,next){

    var adminType = req.cookies.adminType;
    var myvideoTitle = req.body.video_title;
    var myvideoLink = req.body.youtube_link;
    var status = req.body.status;

    var slugname = slug(myvideoTitle);
    var stringVideoLink = myvideoLink.toString();
    var videoLink = stringVideoLink.split('&list')[0];
 

    videosModel.find({youtube_link:myvideoLink}).exec(function(er,doc){

        if(doc.length > 0){
         req.flash('error','Sorry, The Video has Already Existed.');
         res.redirect('/myvideos/create'); 
        }else{
        
            var saveArticle = new videosModel({
                video_title : myvideoTitle,
                youtube_link : videoLink,
                slug : slugname,
                status : status
             
            });
        
            saveArticle.save(function(err,data){
                req.flash('success','Vidoe Saved Succesfully. Thank you!!!');
                res.redirect('/myvideos/index');
            });
        }
    });
});



router.get('/edit/:id',function(req,res,next){
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;
    var Id = req.params.id;
    var selected = 'selected';


    var edit_videos = videosModel.findById(Id);
    var userData = admin.findOne({_id:userId});

    edit_videos.exec(function(err,data){
        userData.exec(function(admindataErr,admindata){
            res.render('backend/videos/edit',{adminType,title:'Edit Video',data,selected,admindata});
        });
    });
});


router.post('/update',upload,function(req,res,next){
    var myvideosId = req.body.id;
    var myvideoTitle = req.body.video_title;
    var myvideoLink = req.body.youtube_link;
    var status = req.body.status;
    var slugname = slug(myvideoTitle);

    videosModel.find({_id:{$ne:myvideosId},youtube_link:myvideoLink}).exec(function(er,doc){
        if(doc.length > 0){
            req.flash('error','Sorry, The Video has Already Existed.Please insert a new link.');
            res.redirect('/myvideos/edit/'+myvideosId); 
           }else{
     
                var updateVideos = videosModel.findByIdAndUpdate(myvideosId,{
                    video_title : myvideoTitle,
                    youtube_link : myvideoLink,
                    status : status,
                    slug : slugname
                });

                updateVideos.exec(function(err,data){
                    req.flash('success','Video Updated Succesfully. Thank you!!!');
                    return res.redirect('/myvideos/index');
                });


            }
    });
});


router.get('/delete/:id',function(req,res,next){
    var Id = req.params.id;
   var deleteVideos =  videosModel.findByIdAndDelete(Id);

   deleteVideos.exec(function(err,data){
        if(err) throw err;
        req.flash('success','Video Deleted Succesfully. Thank you!!!');
        return res.redirect('/myvideos/index');
    
      }); 

});














module.exports = router;
