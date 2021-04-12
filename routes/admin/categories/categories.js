var express = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');       
var fs = require('fs');
var dateFormat = require('dateformat');
var slug = require('slug');
var router = express.Router();

var categoryModel = require('../../../modules/categories');
const { isNull } = require('util');
const subCategoryModel = require('../../../modules/subcategories');
var admin = require('../../../modules/admin');
var sessionstorage = require('sessionstorage');


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

    var categories = categoryModel.find({});
    var userData = admin.findOne({_id:userId});
    
    userData.exec(function(admindataErr,admindata){
        categories.exec(function(err,data){
            res.render('backend/categories/index',{adminType,title:"Categories Lists",records:data,dateFormat,admindata});
        });
    });
     
});


router.get('/create',checkPublication,function(req,res,next){
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});
    userData.exec(function(admindataErr,admindata){
        res.render('backend/categories/create',{adminType,title:"Add Category",admindata});
    });
});




//storage for Image Upload
var Storage = multer.diskStorage({

    // destination: './public/images/backend/admins/',
    filename: function(req,files,cb){
     
      var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null,files.fieldname + '-' + uniqueSuffix + path.extname(files.originalname) );
    }
});
  
var image = multer({
    storage:Storage
}).fields([
    { name: 'categoryimage', maxCount: 1 },
    { name: 'categoryicon', maxCount: 1 }
  ]);
 

router.post('/store',image,function(req,res,next){
    
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    
    var categoryName = req.body.categoryname;
    var status = req.body.status;

    var slugname = slug(categoryName);
    

    if(Object.keys(req.files).length > 0){
        //if categoryicon is null
        if(req.files['categoryicon'] == null){

            var categoryImage = req.files['categoryimage'][0].filename;
            var image = categoryImage;

            //Image Size
            let width = 500;
            let height = 500;

            sharp(req.files['categoryimage'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/categories/'+ image);

            var saveCategory = new categoryModel({
            category_name:categoryName,
            category_image:categoryImage,
            slug:slugname,
            status:status,

        });

        saveCategory.save(function(err,data){
            req.flash('success','Category Inserted Succesfully. Thank you!!!');
            res.redirect('/categories/index');
        });

        //if categoryimage is null
        }else if(req.files['categoryimage'] == null){
            var categoryIcon= req.files['categoryicon'][0].filename;
            var icon = categoryIcon;

            //Icon Size
            let width1 = 100;
            let height1 = 100;

            sharp(req.files['categoryicon'][0].path).resize(width1,height1).toFile('/home/kitabharu/kitabharu/public/images/backend/categories/icons/'+ icon);

            var saveCategory = new categoryModel({
            category_name:categoryName,
            category_icon:categoryIcon,
            slug:slugname,
            status:status,
        });

        saveCategory.save(function(err,data){
            req.flash('success','Category Inserted Succesfully. Thank you!!!');
            res.redirect('/categories/index');
        });
   
        //if image is not null
        }else if(req.files['categoryimage'] != null & req.files['categoryicon'] != null){
            console.log('not null');
            var categoryImage = req.files['categoryimage'][0].filename;
            var categoryIcon = req.files['categoryicon'][0].filename;
        
            var image = categoryImage;
            var icon = categoryIcon;
            
            let width = 500;
            let height = 500;
        
            //Icon Size
            let width1 = 100;
            let height1 = 100;
                
            sharp(req.files['categoryimage'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/categories/'+ image);
                
            sharp(req.files['categoryicon'][0].path).resize(width1,height1).toFile('/home/kitabharu/kitabharu/public/images/backend/categories/icons/'+ icon);

            var saveCategory = new categoryModel({
                category_name:categoryName,
                category_image:categoryImage,
                category_icon:categoryIcon,
                slug:slugname,
                status:status,
            });

            saveCategory.save(function(err,data){
                req.flash('success','Category Inserted Succesfully. Thank you!!!');
                res.redirect('/categories/index');
            });
        }
    }else{
        var saveCategory = new categoryModel({
            category_name:categoryName,
            slug:slugname,
            status:status,
        });

        saveCategory.save(function(err,data){
            req.flash('success','Category Inserted Succesfully. Thank you!!!');
            res.redirect('/categories/index');
        });
    }

});


router.get('/edit/:id',checkPublication,function(req,res,next){
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var id = req.params.id;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});
    var categoryDetails = categoryModel.findById(id);

    categoryDetails.exec(function(err,data){
        userData.exec(function(admindataErr,admindata){
            var selected = "selected"
            res.render('backend/categories/edit',{adminType,title:"Edit Categories",data,selected,admindata});
        });
    });     
});






var image1 = multer({
    storage:Storage
}).fields([
    { name: 'categoryimage', maxCount: 1 },
    { name: 'categoryicon', maxCount: 1 }
  ]);


router.post('/update',image1,function(req,res,next){
    var categoryName = req.body.categoryname;
    var previousCategoryImage = req.body.previousCategoryImage;
    var previousCategoryIcon = req.body.previousIconImage;
    var status = req.body.status;
    var id = req.body.id;

    console.log(categoryName);
    var slugname = slug(categoryName);

     if(Object.keys(req.files).length > 0){
        //if categoryicon is null
        if(req.files['categoryicon'] == null){
            console.log(1);
            var categoryImage = req.files['categoryimage'][0].filename;
          

            //Image Size
            let width = 500;
            let height = 500;

            sharp(req.files['categoryimage'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/categories/'+ categoryImage);

            if(previousCategoryImage != ''){
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/categories/'+previousCategoryImage;
            fs.unlinkSync(filePath);
            }

            var updateCategory = categoryModel.findByIdAndUpdate(id,{
                category_name:categoryName,
                category_image:categoryImage,
                slug:slugname,
                status:status,
            });

            updateCategory.exec(function(err,data){
                req.flash('success','Category Updated Succesfully. Thank you!!!');
                res.redirect('/categories/index');
            });

        
         }else if(req.files['categoryimage'] == null){
            console.log(2);
            var categoryIcon = req.files['categoryicon'][0].filename;
        

            //Image Size
            let width = 100;
            let height = 100;

            sharp(req.files['categoryicon'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/categories/icons/'+ categoryIcon);

            if(previousCategoryIcon != ''){
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/categories/icons/'+previousCategoryIcon;
            fs.unlinkSync(filePath);
           
        }

            var updateCategory = categoryModel.findByIdAndUpdate(id,{
                category_name:categoryName,
                category_icon:categoryIcon,
                slug:slugname,
                status:status,
            });

            updateCategory.exec(function(err,data){
                req.flash('success','Category Updated Succesfully. Thank you!!!');
                res.redirect('/categories/index');
            });

         }else if(req.files['categoryimage'] != null && req.files['categoryicon'] != null){
            console.log(3);
            var categoryImage = req.files['categoryimage'][0].filename;
            var categoryIcon = req.files['categoryicon'][0].filename;
        

            //Image Size
            let width = 500;
            let height = 500;

            sharp(req.files['categoryimage'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/categories/'+ categoryImage);

            if(previousCategoryImage != ''){
            var filePath1 = '/home/kitabharu/kitabharu/public/images/backend/categories/'+previousCategoryImage;
            fs.unlinkSync(filePath1);
        }

            //Image Size
            let width1 = 100;
            let height1 = 100;

            sharp(req.files['categoryicon'][0].path).resize(width1,height1).toFile('/home/kitabharu/kitabharu/public/images/backend/categories/icons/'+ categoryIcon);

            if(previousCategoryIcon != ''){
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/categories/icons/'+previousCategoryIcon;
            fs.unlinkSync(filePath);}

            var updateCategory = categoryModel.findByIdAndUpdate(id,{
                category_name:categoryName,
                category_image:categoryImage,
                category_icon:categoryIcon,
                slug:slugname,
                status:status,
            });

            updateCategory.exec(function(err,data){
                req.flash('success','Category Updated Succesfully. Thank you!!!');
                res.redirect('/categories/index');
            });
         }
    }else{
        var updateCategory = categoryModel.findByIdAndUpdate(id,{
            category_name:categoryName,
            slug:slugname,
            status:status,
        });

        updateCategory.exec(function(err,data){
            req.flash('success','Category Updated Succesfully. Thank you!!!');
            res.redirect('/categories/index');
        });
    }

});



















router.get('/delete/:id',function(req,res,next){
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var id = req.params.id;

    var deleteCategory = categoryModel.findByIdAndDelete(id);

    deleteCategory.exec(function(err,data){
        if(err) throw err;
      
       
    //   var deleteSubcategory = subCategoryModel.find({category_type_id:data._id});
    var deleteSubcategory = subCategoryModel.deleteMany({category_type_id:data._id});

      deleteSubcategory.exec(function(err1,data1){
   
      
        
            // If category image is not null
            if(data.category_image != null){       
                var filePath = '/home/kitabharu/kitabharu/public/images/backend/categories/'+data.category_image;
                fs.unlinkSync(filePath);
            }

            // If category icon is not null
            if(data.category_icon != null){  
                console.log(1);      
                var filePath1 = '/home/kitabharu/kitabharu/public/images/backend/categories/icons/'+data.category_icon;
                console.log(filePath1);
                fs.unlinkSync(filePath1);
            }
     
        req.flash('success','Data Deleted Succesfully. Thank you!!!');
        return res.redirect('/categories/index');
    
      }); 
             
      });
});

module.exports = router;
