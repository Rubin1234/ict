var express = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');       
var fs = require('fs');

var router = express.Router();

var categoryModel = require('../../../modules/categories');
var SubCategoryModel = require('../../../modules/subcategories');
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
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;


    var subCategories = SubCategoryModel.find({}).populate('category_type_id');
    var categories = categoryModel.find({});
    var userData = admin.findOne({_id:userId});
  
    subCategories.exec(function(err,data){
        categories.exec(function(err1,data1){
            userData.exec(function(admindataErr,admindata){
                res.render('backend/subcategories/index',{adminType,title:"Sub-Categories Lists",records:data,dateFormat,categories:data1,admindata});
            });
        });
    });
});


router.get('/create',checkPublication,function(req,res,next){
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var category = categoryModel.find({});
    var userData = admin.findOne({_id:userId});


    category.exec(function(err,data){
        userData.exec(function(admindataErr,admindata){
            res.render('backend/subcategories/create',{adminType,title:"Add Sub-Category",records:data,admindata});
        });
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
    { name: 'subcategory_image', maxCount: 1 },
    { name: 'subcategory_icon', maxCount: 1 }
  ]);
 

router.post('/store',image,function(req,res,next){
    
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var category_type = req.body.categoryTypeId;

     
    var subCategoryName = req.body.subcategory_name;
    var status = req.body.status;

    var slugname = slug(subCategoryName);
    

    if(Object.keys(req.files).length > 0){
        //if categoryicon is null
        if(req.files['subcategory_icon'] == null){
           
            var subCategoryImage = req.files['subcategory_image'][0].filename;
            var image = subCategoryImage;

            //Image Size
            let width = 500;
            let height = 500;

            sharp(req.files['subcategory_image'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/subcategories/'+ image);


            var saveSubCategory = new SubCategoryModel({
                subcategory_name:subCategoryName,
                subcategory_image:subCategoryImage,
                category_type_id: category_type,
                slug:slugname,
                status:status,
        });

        
        categoryModel.findOne({_id:category_type},function(error,categorytypedata){
            if(categorytypedata){
            categorytypedata.subcategories.push(saveSubCategory);
            categorytypedata.save();
        }
       });
    


        saveSubCategory.save(function(err,data){
          
            req.flash('success','Category Inserted Succesfully. Thank you!!!');
            res.redirect('/subcategories/index');
        });
    
   
        //if categoryimage is null
        }else if(req.files['subcategory_image'] == null){
            var subCategoryIcon= req.files['subcategory_icon'][0].filename;
            var icon = subCategoryIcon;

            //Icon Size
            let width1 = 100;
            let height1 = 100;

            sharp(req.files['subcategory_icon'][0].path).resize(width1,height1).toFile('/home/kitabharu/kitabharu/public/images/backend/subcategories/icons/'+ icon);

            var savesubCategory = new SubCategoryModel({
            subcategory_name:subCategoryName,
            subcategory_icon:subCategoryIcon,
            category_type_id: category_type,
            slug:slugname,
            status:status,
        });

        savesubCategory.save(function(err,data){
            req.flash('success','Category Inserted Succesfully. Thank you!!!');
            res.redirect('/subcategories/index');
        });
    
    //     //if image is not null
        }else if(req.files['subcategory_image'] != null & req.files['subcategory_icon'] != null){
         
            var subCategoryImage = req.files['subcategory_image'][0].filename;
            var subCategoryIcon = req.files['subcategory_icon'][0].filename;
        
            var image = subCategoryImage;
            var icon = subCategoryIcon;
            
            let width = 500;
            let height = 500;
        
            //Icon Size
            let width1 = 100;
            let height1 = 100;
                
            sharp(req.files['subcategory_image'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/subcategories/'+ image);
                
            sharp(req.files['subcategory_icon'][0].path).resize(width1,height1).toFile('/home/kitabharu/kitabharu/public/images/backend/subcategories/icons/'+ icon);

            var savesubCategory = new SubCategoryModel({
                subcategory_name:subCategoryName,
                subcategory_image:subCategoryImage,
                category_type_id: category_type,
                subcategory_icon:subCategoryIcon,
                slug:slugname,
                status:status,
            });

            savesubCategory.save(function(err,data){
                req.flash('success','Category Inserted Succesfully. Thank you!!!');
                res.redirect('/subcategories/index');
            });
        }
    }else{
        var savesubCategory = new SubCategoryModel({
            subcategory_name:subCategoryName,
            category_type_id: category_type,
            slug:slugname,
            status:status,
        });

        savesubCategory.save(function(err,data){
            req.flash('success','Category Inserted Succesfully. Thank you!!!');
            res.redirect('/subcategories/index');
        });
 
    
}
    // req.flash('success','Category Inserted Succesfully. Thank you!!!');
    //         res.redirect('/subcategories/index');

});





router.get('/edit/:id',checkPublication,function(req,res,next){
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;
    var id = req.params.id;


    var mainCategories = categoryModel.find({});    
    var subcategoryDetails = SubCategoryModel.findById(id).populate('category_type_id');
    var userData = admin.findOne({_id:userId});
   
    mainCategories.exec(function(err,data){
        if(err) throw err;
        subcategoryDetails.exec(function(err1,data1){
            if(err1) throw err1;
            userData.exec(function(admindataErr,admindata){
                var selected = "selected"
                res.render('backend/subcategories/edit',{adminType,title:"Edit SubCategories",subCategoriesDetails:data1,selected,mainCategories:data,admindata});
            });  
        });     
    });
});







var image1 = multer({
    storage:Storage
}).fields([
    { name: 'subcategory_image', maxCount: 1 },
    { name: 'subcategory_icon', maxCount: 1 }
  ]);


router.post('/update',image1,function(req,res,next){


    var subcategoryName = req.body.subcategory_name;
    var previousSubCategoryImage = req.body.previousSubCategoryImage;
    var previousSubCategoryIcon = req.body.previousIconImage;
    var categoryTypeId = req.body.categoryTypeId;

    var status = req.body.status;
    var id = req.body.id;

    var slugname = slug(subcategoryName);

     if(Object.keys(req.files).length > 0){
        //if categoryicon is null
        if(req.files['subcategory_icon'] == null){
            var subcategoryImage = req.files['subcategory_image'][0].filename;
          
          

            //Image Size
            let width = 500;
            let height = 500;

            sharp(req.files['subcategory_image'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/subcategories/'+ subcategoryImage);

            if(previousSubCategoryImage != ''){
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/subcategories/'+previousSubCategoryImage;
            fs.unlinkSync(filePath);
            }

            var updateSubCategory = SubCategoryModel.findByIdAndUpdate(id,{
                subcategory_name:subcategoryName,
                subcategory_image:subcategoryImage,
                category_type_id:categoryTypeId,
                slug:slugname,
                status:status,
            });

        
            updateSubCategory.exec(function(err,data){

                //Deleting the Object Id in CategoryModel of subcategories 
                var removeArray = categoryModel.update({_id:data.category_type_id}, { $pull: { subcategories: { $in: data._id  } }});  

                //Changing the Object Id in CategoryModel of subcategories 
                categoryModel.findOne({_id:categoryTypeId},function(error,subcategorytypedata){
                    if(subcategorytypedata){
                        subcategorytypedata.subcategories.push(id);
                        subcategorytypedata.save();
                    }
               });

                removeArray.exec(function(err1,data1){
                    req.flash('success','Category Updated Succesfully. Thank you!!!');
                    res.redirect('/subcategories/index');
                });
            });
        
        
         }else if(req.files['subcategory_image'] == null){
   
            var subcategoryIcon = req.files['subcategory_icon'][0].filename;
        

            //Image Size
            let width = 100;
            let height = 100;

            sharp(req.files['subcategory_icon'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/subcategories/icons/'+ subcategoryIcon);

            if(previousSubCategoryIcon != ''){
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/subcategories/icons/'+previousSubCategoryIcon;
            fs.unlinkSync(filePath);
           
        }

            var updateSubCategory = SubCategoryModel.findByIdAndUpdate(id,{
                subcategory_name:subcategoryName,
                subcategory_icon:subcategoryIcon,
                category_type_id:categoryTypeId,
                slug:slugname,
                status:status,
            });

         

            updateSubCategory.exec(function(err,data){

                //Deleting the Object Id in CategoryModel of subcategories 
                var removeArray = categoryModel.update({_id:data.category_type_id}, { $pull: { subcategories: { $in: data._id  } }}); 

                //Changing the Object Id in CategoryModel of subcategories 
                categoryModel.findOne({_id:categoryTypeId},function(error,subcategorytypedata){
                    if(subcategorytypedata){
                        subcategorytypedata.subcategories.push(id);
                        subcategorytypedata.save();
                    }
                });

                removeArray.exec(function(err1,data1){
                    req.flash('success','Category Updated Succesfully. Thank you!!!');
                    res.redirect('/subcategories/index');
                });
            });
    

         }else if(req.files['subcategory_image'] != null && req.files['subcategory_icon'] != null){
          
            var subcategoryImage = req.files['subcategory_image'][0].filename;
            var subcategoryIcon = req.files['subcategory_icon'][0].filename;
        

            //Image Size
            let width = 500;
            let height = 500;

            sharp(req.files['subcategory_image'][0].path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/subcategories/'+ subcategoryImage);

            if(previousSubCategoryImage != ''){
            var filePath1 = '/home/kitabharu/kitabharu/public/images/backend/subcategories/'+previousSubCategoryImage;
            fs.unlinkSync(filePath1);
            }

            //Image Size
            let width1 = 100;
            let height1 = 100;

            sharp(req.files['subcategory_icon'][0].path).resize(width1,height1).toFile('/home/kitabharu/kitabharu/public/images/backend/subcategories/icons/'+ subcategoryIcon);

            if(previousSubCategoryIcon != ''){
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/subcategories/icons/'+previousSubCategoryIcon;
            fs.unlinkSync(filePath);}

            var updateSubCategory = SubCategoryModel.findByIdAndUpdate(id,{
                subcategory_name:subcategoryName,
                subcategory_image:subcategoryImage,
                subcategory_icon:subcategoryIcon,
                category_type_id:categoryTypeId,
                slug:slugname,
                status:status,
            });


            updateSubCategory.exec(function(err,data){

                  //Deleting the Object Id in CategoryModel of subcategories 
                var removeArray = categoryModel.update({_id:data.category_type_id}, { $pull: { subcategories: { $in: data._id  } }}); 

                
                //Changing the Object Id in CategoryModel of subcategories 
                categoryModel.findOne({_id:categoryTypeId},function(error,subcategorytypedata){
                    if(subcategorytypedata){
                        subcategorytypedata.subcategories.push(id);
                        subcategorytypedata.save();
                    }
                });

                removeArray.exec(function(err1,data1){
                req.flash('success','Category Updated Succesfully. Thank you!!!');
                res.redirect('/subcategories/index');
                 });
            });
         }
    }else{
            var updateSubCategory = SubCategoryModel.findByIdAndUpdate(id,{
                subcategory_name:subcategoryName,
                category_type_id:categoryTypeId,
                slug:slugname,
                status:status,
            });
      


            updateSubCategory.exec(function(err,data){
            
                //Deleting the Object Id in CategoryModel of subcategories 
                var removeArray = categoryModel.update({_id:data.category_type_id}, { $pull: { subcategories: { $in: data._id  } }});
                
                //Changing the Object Id in CategoryModel of subcategories 
                categoryModel.findOne({_id:categoryTypeId},function(error,subcategorytypedata){
                    if(subcategorytypedata){
                        subcategorytypedata.subcategories.push(id);
                        subcategorytypedata.save();
                    }
               });

                removeArray.exec(function(err1,data1){
                    req.flash('success','Category Updated Succesfully. Thank you!!!');
                    res.redirect('/subcategories/index');
                }); 
            }); 
    }

});






router.get('/delete/:id',function(req,res,next){
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var id = req.params.id;

    var deletesubCategory = SubCategoryModel.findByIdAndDelete(id);
    
    deletesubCategory.exec(function(err,data){
      
        if(err) throw err;
        var deleteCategoryArray = categoryModel.update({_id:data.category_type_id}, { $pull: {subcategories: { $in: data._id}}});

        deleteCategoryArray.exec(function(err1,data1){
            if(err1) throw err1;

            // If category image is not null
            if(data.subcategory_image != null){       
                var filePath = '/home/kitabharu/kitabharu/public/images/backend/subcategories/'+data.subcategory_image;
                fs.unlinkSync(filePath);
            }

            // If category icon is not null
            if(data.subcategory_icon != null){  
                
                var filePath1 = '/home/kitabharu/kitabharu/public/images/backend/subcategories/icons/'+data.subcategory_icon;
             
                fs.unlinkSync(filePath1);
            }

          
            req.flash('success','Data Deleted Succesfully. Thank you!!!');
            return res.redirect('/subcategories/index');
    
      }); 
    }); 
});



router.get('/sortby',function(req,res,next){
    var category = req.query.Id;
 

    var category = categoryModel.findOne({category_name:category});

    category.exec(function(err,data){
            
        var subCategories = subCategoryModel.find({category_type_id:data._id}).populate('category_type_id');
            
            subCategories.exec(function(err1,data1){
                console.log(data1);
                res.send(data1);
            });
    });
});







module.exports = router;
