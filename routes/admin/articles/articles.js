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


//Checking if the admin is from publication
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

    var article = articleModel.find({});
    var userData = admin.findOne({_id:userId});

    article.exec(function(err,data){
        userData.exec(function(admindataErr,admindata){
            res.render('backend/articles/index',{adminType,title:"Articles List",records:data,dateFormat,admindata});
        });
    });

});

router.get('/create',checkPublication,function(req,res,next){
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});

    userData.exec(function(admindataErr,admindata){
        res.render('backend/articles/create',{adminType,title:"Articles List",admindata});
    });
});



router.post('/store',upload,function(req,res,next){
    
    var adminType = req.cookies.adminType;
    var articleTitle = req.body.articlename;
    var articleDate = req.body.articledate;
    var articleDescription = req.body. product_description;
    var status = req.body.status;

    var slugname = slug(articleTitle);



    articleModel.find({article_title:articleTitle}).exec(function(er,doc){
      
        if(doc.length > 0){
         req.flash('error','Sorry, The Article Title has Already Existed.');
         res.redirect('/articles/create'); 
        }else{

            var image;
            if(req.file == null){
                image = "";
            }else{
                image = req.file.filename;
        
                
                let width = 750;
                let height = 400;
        
                let width1 = 570;
                let height1 = 350;
                
                sharp(req.file.path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/articles/'+ req.file.filename);
                sharp(req.file.path).resize(width1,height1).toFile('/home/kitabharu/kitabharu/public/images/backend/articles/frontview/'+ req.file.filename);
            }
        
            var saveArticle = new articleModel({
                article_title : articleTitle,
                article_date : articleDate,
                article_image : image,
                article_description : articleDescription,
                status : status,
                slug : slugname
            });
        
            saveArticle.save(function(err,data){
                req.flash('success','Article Saved Succesfully. Thank you!!!');
                res.redirect('/articles/index');
            });
        }
    });
});



router.get('/edit/:id',checkPublication,function(req,res,next){
    var adminType = req.cookies.adminType;
    var Id = req.params.id;
    var userId = req.cookies.userId;
    var selected = 'selected';

    var edit_article = articleModel.findById(Id);
    var userData = admin.findOne({_id:userId});

    edit_article.exec(function(err,data){
        userData.exec(function(admindataErr,admindata){
            res.render('backend/articles/edit',{adminType,title:'Edit Article',data,selected,admindata});
        });
    });
});


router.post('/update',upload,function(req,res,next){
    var articleId = req.body.id;
    var articleName = req.body.articlename;
    var articleDate = req.body.articledate;
    var previousArticleImage = req.body.previousArticleImage;
    var description = req.body.product_description;
    var status = req.body.status;

    var slugname = slug(articleName);


    articleModel.find({_id:{$ne:articleId},article_title:articleName}).exec(function(er,doc){
        if(doc.length > 0){
            req.flash('error','Sorry, The Article Title has Already Existed.');
            res.redirect('/articles/edit/'+articleId); 
           }else{
                var image;
                if(req.file == null){
                    image = previousArticleImage;
                }else{
                    image = req.file.filename;
        
                    let width = 750;
                    let height = 425;

                    let width1 = 570;
                    let height1 = 350;
        
                    sharp(req.file.path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/articles/'+ req.file.filename);
                    sharp(req.file.path).resize(width1,height1).toFile('/home/kitabharu/kitabharu/public/images/backend/articles/frontview/'+ req.file.filename);

                    if(previousArticleImage != ''){
                        console.log(1)
                    var filePath = '/home/kitabharu/kitabharu/public/images/backend/articles/'+previousArticleImage;
                    var filePath1 = '/home/kitabharu/kitabharu/public/images/backend/articles/frontview/'+previousArticleImage;
                    fs.unlinkSync(filePath);
                    fs.unlinkSync(filePath1);
                    }
                }

                var updateArticle = articleModel.findByIdAndUpdate(articleId,{
                    article_title : articleName,
                    article_date :articleDate,
                    article_image : image,
                    article_description : description,
                    status : status,
                    slug : slugname
                });

                updateArticle.exec(function(err,data){
                    req.flash('success','Article Updated Succesfully. Thank you!!!');
                    return res.redirect('/articles/index');
                });


            }
    });
});


router.get('/delete/:id',function(req,res,next){
    var Id = req.params.id;
   var deleteArticle =  articleModel.findByIdAndDelete(Id);

   deleteArticle.exec(function(err,data){
        if(err) throw err;

            // If category image is not null
            if(data.article_image != null){       
                var filePath = '/home/kitabharu/kitabharu/public/images/backend/articles/'+data.article_image;
                var filePath1 = '/home/kitabharu/kitabharu/public/images/backend/articles/frontview/'+data.article_image;
                fs.unlinkSync(filePath);
                fs.unlinkSync(filePath1);
            }


        req.flash('success','Article Deleted Succesfully. Thank you!!!');
        return res.redirect('/articles/index');
    
      }); 

});














module.exports = router;
