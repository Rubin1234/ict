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

  router.post('/signup', function(req, res, next) {

    var username = req.body.customerusername;
    var email = req.body.customeremail;
    var phoneNumber = req.body.pnumber;
    var password = req.body.customerpassword;
    var slugname = slug(username);

   var hashpassword = bcyrpt.hashSync(password,10);

    var customer = new customerModel({
      user_name : username,
      email : email,
      phone_number : phoneNumber,
      password : hashpassword,
      slug : slugname,
    });

    customer.save();
    res.send('Signed Up Successfuull');
    
  
  });

          
module.exports = router;