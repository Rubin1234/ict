var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');       
var fs = require('fs'); 
var jwt = require('jsonwebtoken');

var router = app.Router();

var categoryModel = require('../../modules/categories');
var SubCategoryModel = require('../../modules/subcategories');
var brandModel = require('../../modules/brand');
var bookAttributesModel = require('../../modules/bookAttributes'); 
var productImagesModel = require('../../modules/product_images'); 
const util = require('util');
const ModelProduct = require('../../modules/product');
const customerModel = require('../../modules/customers');
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
const { rejects } = require('assert');

/* GET home page. */

  router.get('/viewprofile/:customerId',async function(req, res, next) {

    var userId = req.params.customerId;
    var customerData = await customerModel.findById(userId);
    res.send(customerData);
    
  });


  router.post('/updateprofile', function(req, res, next) {

    var username = req.body.customerusername;
    var email = req.body.customeremail;
    var oldpassword = req.body.oldpassword;
    var newPassword = req.body.newpassword;
    var confirmPassword = req.body.confirmpassword;
    var cookiesCustomerId = req.body.customerId;


    //if confirm password is null
    if(confirmPassword == ''){
      var checkId = customerModel.findOne({_id:cookiesCustomerId});
      checkId.exec(function(err,data){
        if(err) throw err;
    
        var getPassword = data.password;
        
        //checking password
        if(bcrypt.compareSync(oldpassword,getPassword)){      
            var updateCustomer = customerModel.findByIdAndUpdate(cookiesCustomerId,{
              user_name: username,
              email: email,
            });
        
          updateCustomer.exec(function(err1,data1){
            if(err1) throw err1;
            res.send('Email changed successfully');
          });
        }
        else
        {
          res.send('You old password does not matched. Please re-enter your password');

        }
      });
    }


          //if confirm password is not null

    if(confirmPassword != ''){
      
      var checkId = customerModel.findOne({_id:cookiesCustomerId});
        
      checkId.exec(function(err,data){
       

          if(err) throw err;
          var getPassword = data.password;
          
          if(bcrypt.compareSync(oldpassword,getPassword)){
          var updatedpassword = bcyrpt.hashSync(confirmPassword,10);
      
          var updatepasswordData = customerModel.findByIdAndUpdate(cookiesCustomerId,{
            user_name: username,
            email: email,
            password:updatedpassword,

          });

          updatepasswordData.exec(function(err2,data2){
            if(err2) throw err2;
            res.send('password changed successfully');
          });
        }
    else{
        res.send('You old password does not matched. Please re-enter your password');
      }
    });
  }
  });

          
module.exports = router;