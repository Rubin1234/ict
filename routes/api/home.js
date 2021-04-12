var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');       
var fs = require('fs');

var router = app.Router();

var categoryModel = require('../../modules/categories');
var SubCategoryModel = require('../../modules/subcategories');
var brandModel = require('../../modules/brand');
var bookAttributesModel = require('../../modules/bookAttributes'); 
var productImagesModel = require('../../modules/product_images'); 
const util = require('util');
const ModelProduct = require('../../modules/product');
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
const { rejects } = require('assert');

/* GET home page. */




  router.get('/category', function(req, res, next) {
    
    categoryModel.find({}).exec(function(err,data){
      
      const promises = data.map((item) => new Promise((resolve,reject) => {
        SubCategoryModel.find({category_type_id:item._id},function(err1,data1){
          data1.forEach(function(doc){
        
            item.subcategories.push(doc);           
          });                        
          resolve(item);
        });   
      }));

      Promise.all(promises)
      .then(allArray => {  
        console.log(allArray);
        var records = util.inspect(allArray, false, null, true /* enable colors */);    
        console.log(records);
        res.send(allArray);
        
      });
    });
  });



          
module.exports = router;