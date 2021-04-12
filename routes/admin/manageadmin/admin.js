var express = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');       
var fs = require('fs');
var router = express.Router();


//Model
var admin = require('../../../modules/admin');
var adminTypeModel = require('../../../modules/admintype');
var publicationModel = require('../../../modules/publication');
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

    //accessing all data
    allData = admin.find({}).populate('admin_type');
    var userData = admin.findOne({_id:userId});
    
    allData.exec(function(err,data){ 
        userData.exec(function(admindataErr,admindata){
            res.render('manageadmin/admin/index',{adminType,title:"Role Lists",records:data,admindata});
        });
    });
});


router.get('/create',checkPublication,async function(req,res,next){
    var userName = req.cookies.userName;
    var userId = req.cookies.userId;

    var adminType = req.cookies.adminType;
    var dataAdminType = adminTypeModel.find({});
    var userData = admin.findOne({_id:userId});
    var publication = await publicationModel.find({});


    dataAdminType.exec(function(err,data){
        userData.exec(function(admindataErr,admindata){
            res.render('manageadmin/admin/create',{adminType,title:"Add Admins",admintype:data,admindata,publication});
        });
    });
});


//storage for Image Upload
var Storage = multer.diskStorage({

    // destination: './public/images/backend/admins/',
    filename: function(req,file,cb){
      var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null,file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname) );
    }
});
  
var upload = multer({
    storage:Storage
}).single('profilePic');
  

router.post('/store',upload,function(req,res,next){
 


    var status = req.body.status;
    var adminType = req.body.admintype;
    console.log(adminType);

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var publicationName = req.body.publicationName;
    var address = req.body.address;
    var phonenumber = req.body.phonenumber;
    var email = req.body.email;
    var confirmpassword = req.body.confirmpassword;

    var password = bcrypt.hashSync(confirmpassword,10);

    if(publicationName){
        var publicationName = req.body.publicationName;
    }else{
        var publicationName = null;
    }



    //File  
    var image
    if(req.file == null){
        image = '';
    }else{
        image = req.file.filename;
        let width = 500;
        let height = 500;
    
        sharp(req.file.path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/admins/'+ req.file.filename);
    }



   
    var saveAdmin = new admin({
        firstname:firstname,
        lastname:lastname,
        address:address,
        phonenumber:phonenumber,
        email:email,
        image:image,
        password:password,
        publication : publicationName,
        admin_type:adminType,
        status:status,
    });


    adminTypeModel.findOne({_id:adminType},function(error,admintypedata){
    if(admintypedata){
        admintypedata.admins.push(saveAdmin);
        admintypedata.save();
    }
   });

    saveAdmin.save(function(err){
        req.flash('success','Data Inserted Succesfully. Thank you!!!');
        res.redirect('/admin/index');
      });
});



router.get('/edit/:id',checkPublication,async function(req,res,next){
    var userName = req.cookies.userName;
    var userId = req.cookies.userId;
    var adminType = req.cookies.adminType;
    var id = req.params.id;

    //For All Admin Type
    var dataAdminType = adminTypeModel.find({});
    var adminData = admin.findById(id).populate('admin_type');
    var selected = 'selected';
    var userData = admin.findOne({_id:userId});
    var publication = await publicationModel.find({});

    dataAdminType.exec(function(err,data){
        adminData.exec(function(err1,data1){
            userData.exec(function(admindataErr,admindata){
                res.render('manageadmin/admin/edit',{adminType,title:"Edit Admins",admintype:data,admin:data1,selected,admindata,publication});
            });   
        });    
    });    
});



  

router.get('/delete/:id',function(req,res,next){
    var id = req.params.id;
    var deleteAdmin = admin.findByIdAndDelete(id);

    deleteAdmin.exec(function(err,data){
        if(err) throw err;
        
        //Deleteing Admins Array in AdminType Model
        var deleteAdminArray =  adminTypeModel.update({_id:data.admin_type}, { $pull: { admins: { $in: data._id  } }});


        deleteAdminArray.exec(function(err1,data1){
        
            console.log(data.image);
            if(data.image != ' '){  
                console.log(1);      
                var filePath = '/home/kitabharu/kitabharu/public/images/backend/admins/'+data.image;
                console.log(filePath);
                fs.unlinkSync(filePath);
            }
    
     
        req.flash('success','Data Deleted Succesfully. Thank you!!!');
        return res.redirect('/admin/index');
        });
      });
});


var update = multer({
    storage:Storage
  }).single('profilePic');
  
router.post('/update',update,async function(req,res,next){
  
    var id = req.body.id;
    var adminType = req.body.admintype;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var address = req.body.address;
    var phoneNumber = req.body.phonenumber;
    var previousprofilePic = req.body.previousprofilePic;
    var email = req.body.email;
    var confirmPassword = req.body.confirmpassword;
    var status = req.body.status;
    var publicationName = req.body.publicationName

   var adminTypeData = await adminTypeModel.findById(adminType);

   //If Admin type is publication
   if(adminTypeData.admin_type == 'Publication'){
      var savePublication = publicationName
   }else{
    var savePublication = null
   }


   
    //hashing password
    var password = bcrypt.hashSync(confirmPassword,10);

    var image;
    if(req.file == null){
        image = previousprofilePic;
    }else{
        image = req.file.filename;   
        let width = 500;
        let height = 500;
    
        sharp(req.file.path).resize(width,height).toFile('/home/kitabharu/kitabharu/public/images/backend/admins/'+ req.file.filename);
       
        //Deleting File 
        if(previousprofilePic != ''){
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/admins/'+previousprofilePic;
            fs.unlinkSync(filePath);
        }
        
    }   


    //If password is not changed
        if(confirmPassword == ''){
            var adminData = admin.findById(id);
                adminData.exec(function(err1,data1){
        
                    var oldpwd = data1.password;
                
                    var update = admin.findByIdAndUpdate(id,{
                        publication : savePublication,
                        status: status,
                        firstname : firstName,
                        lastname : lastName,
                        address: address,
                        phonenumber: phoneNumber,
                        email: email,
                        image: image,
                        password: oldpwd,
                        admin_type: adminType,
                    });


                    update.exec(function(err,data){
                        var removeArray = adminTypeModel.update({_id:data.admin_type}, { $pull: { admins: { $in: data._id  } }}); 

                        
                    adminTypeModel.findOne({_id:adminType},function(error,admintypedata){
                        if(admintypedata){
                            admintypedata.admins.push(id);
                            admintypedata.save();
                        }
                       });

                        removeArray.exec(function(err1,data1){
                            req.flash('success','Data Updated Succesfully. Thank you!!!');
                            return res.redirect('/admin/index');
                        });
                    });
                });
        }else{
            //if password is changed
            var update1 = admin.findByIdAndUpdate(id,{
                publication : savePublication,
                status: status,
                firstname : firstName,
                lastname : lastName,
                address: address,
                phonenumber: phoneNumber,
                email: email,
                image: image,
                password: password,
                admin_type: adminType,
              });

            

                update1.exec(function(err,data){
                    var removeArray = adminTypeModel.update({_id:data.admin_type}, { $pull: { admins: { $in: data._id  } }});
                     
                    adminTypeModel.findOne({_id:adminType},function(error,admintypedata){
                        if(admintypedata){
                            admintypedata.admins.push(id);
                            admintypedata.save();
                        }
                       });        

                    removeArray.exec(function(err1,data1){
                        req.flash('success','Data Updated Succesfully. Thank you!!!');
                        return res.redirect('/admin/index');
                    });
                });
        }


});







module.exports = router;