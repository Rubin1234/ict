var express = require('express');
var dateFormat = require('dateformat');
var router = express.Router();

var adminTypeModel = require('../../../modules/admintype');
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

    var dataAdminType = adminTypeModel.find({});
    var userData = admin.findOne({_id:userId});
    
   
    dataAdminType.exec(function(err,data){
      if(err) throw err;
        userData.exec(function(admindataErr,admindata){
          res.render('manageadmin/admintype/index',{adminType,title:"Add Admin Type",records:data,dateFormat,admindata});
      });
    });
});



router.get('/create',checkPublication,function(req,res,next){
    var userName = req.cookies.userName;
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});
    userData.exec(function(admindataErr,admindata){
      res.render('manageadmin/admintype/create',{adminType,title:"Add Admin Type",admindata});
    });
});



router.post('/store',function(req,res,next){
  var admintype = req.body.admintype;
  var status = req.body.status;

  var saveAdminType = new adminTypeModel({
    admin_type: admintype,
    status: status,
  });

  saveAdminType.save(function(err){
    req.flash('success','Data Inserted Succesfully. Thank you!!!');
    res.redirect('/admintype/index');
  });
});


router.get('/edit/:id',checkPublication,function(req,res,next){
  var userName = req.cookies.userName;
  var adminType = req.cookies.adminType;
  var userId = req.cookies.userId;
  var id = req.params.id;

  var editData = adminTypeModel.findOne({_id:id});
  var userData = admin.findOne({_id:userId});

  editData.exec(function(err,data){
    if(err) throw err;
    var selected = 'selected';
    
    userData.exec(function(admindataErr,admindata){
      res.render('manageadmin/admintype/edit',{adminType,title:"Edit Admin Type",records:data,selected,admindata});
    });
  });
});


router.post('/update',function(req,res,next){
  var id = req.body.id;
  var adminType = req.body.admintype;
  var status = req.body.status; 
  
  var update = adminTypeModel.findByIdAndUpdate(id,{
    admin_type : adminType,
    status: status
  });

    update.exec(function(err,data){
      req.flash('success','Data Updated Succesfully. Thank you!!!');
      return res.redirect('/admintype/index');
    })
});

router.get('/delete/:id',function(req,res,next){
  var id = req.params.id;
  var deleteAdminType = adminTypeModel.findByIdAndDelete(id);

  // var dataAdminType = adminTypeModel.find({});

  deleteAdminType.exec(function(err,data){
    if(err) throw err;

    req.flash('success','Data Deleted Succesfully. Thank you!!!');
    return res.redirect('/admintype/index');
  });


});






module.exports = router;
