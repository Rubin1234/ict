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
var sliderModel = require('../../../modules/slider');
var sessionstorage = require('sessionstorage');

//storage for Image Upload
var Storage = multer.diskStorage({

    // destination: '/home/kitabharu/kitabharu/public/images/backend/admins/',
    filename: function(req,file,cb){
        console.log(cb)
      var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null,file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname) );
    }
});
  
var upload = multer({
    storage:Storage
}).single('sliderimage');


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

    var article = sliderModel.find({});
    var userData = admin.findOne({_id:userId});

    article.exec(function(err,data){
        console.log(data);

        userData.exec(function(admindataErr,admindata){
            res.render('backend/slider/index',{adminType,title:"Slider List",records:data,dateFormat,admindata});
        });
    });

});

router.get('/create',checkPublication,function(req,res,next){
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});

    userData.exec(function(admindataErr,admindata){
        res.render('backend/slider/create',{adminType,title:"Create Slider",admindata});
    });
});



router.post('/store',upload,function(req,res,next){
    
    var adminType = req.cookies.adminType;

    var sliderTitle = req.body.slidertitle;
    var sliderDescription = req.body.slider_description;
    var status = req.body.status;

    var slugname = slug(sliderTitle);

  
    sliderModel.find({article_title:sliderTitle}).exec(function(er,doc){
      
        if(doc.length > 0){
         req.flash('error','Sorry, The Slider Title has Already Existed.');
         res.redirect('/slider/create'); 
        }else{

            var image;
            if(req.file == null){
                image = "";
            }else{
                image = req.file.filename;
                
                let width = 1630;
                let height = 630;
        
                sharp(req.file.path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/slider/'+ req.file.filename);
             
            }

            var saveSlider = new sliderModel({
                article_title : sliderTitle,
                image : image,
                description : sliderDescription,
                status : status,
                slug : slugname
            });
        
            saveSlider.save(function(err,data){
                req.flash('success','Slider Saved Succesfully. Thank you!!!');
                res.redirect('/slider/index');
            });
        }
    });
});



router.get('/edit/:id',checkPublication,function(req,res,next){
    var adminType = req.cookies.adminType;
    var Id = req.params.id;
    var userId = req.cookies.userId;
    var selected = 'selected';

    var edit_slider = sliderModel.findById(Id);
    var userData = admin.findOne({_id:userId});

    edit_slider.exec(function(err,data){
        userData.exec(function(admindataErr,admindata){
            res.render('backend/slider/edit',{adminType,title:'Edit Slider',data,selected,admindata});
        });
    });
});


router.post('/update',upload,function(req,res,next){

    var sliderId = req.body.id;
    var sliderTitle = req.body.slidertitle;
    var previousSliderImage = req.body.previousSliderImage;
    var description = req.body.description;
    var status = req.body.status;

    var slugname = slug(sliderTitle);


    var image;
    if(req.file == null){
        image = previousSliderImage;
    }else{
        image = req.file.filename;

        let width = 1633;
        let height = 630;

        sharp(req.file.path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/slider/'+ req.file.filename);
  
        if(previousSliderImage != ''){
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/slider/'+previousSliderImage;
            fs.unlinkSync(filePath);
        }
    }

    var updateSlider = sliderModel.findByIdAndUpdate(sliderId,{
        title : sliderTitle,
        image : image,
        description : description,
        status : status,
        slug : slugname
    });

    updateSlider.exec(function(err,data){
        req.flash('success','Slider Updated Succesfully. Thank you!!!');
        return res.redirect('/slider/index');
    });
});


router.get('/delete/:id',function(req,res,next){
    var Id = req.params.id;
    var deleteSlider =  sliderModel.findByIdAndDelete(Id);

    deleteSlider.exec(function(err,data){
        if(err) throw err;

            // If category image is not null
            if(data.image != null){       
                var filePath = '/home/kitabharu/kitabharu/public/images/backend/slider/'+data.image;
                fs.unlinkSync(filePath);
            }

        req.flash('success','Slider Deleted Succesfully. Thank you!!!');
        return res.redirect('/slider/index');
    
      }); 

});














module.exports = router;
