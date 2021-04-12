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
const publicationModel = require('../../modules/publication');
const { populate, db } = require('../../modules/categories');
var settingModel = require('../../modules/setting'); 
/* GET home page. */


  router.get('/', function(req, res, next) {

    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

    // var records = util.inspect(data, false, null, true /* enable colors */);
    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status:'Active'});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status:'Active'});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status:'Active'}).populate('subcategory_id');
    // var records = util.inspect(data, false, null, true /* enable colors */);

    var settingData = settingModel.findOne({});
    var publication = publicationModel.find({status:'Active'});

    settingData.exec(function(errr,dataa){
    bookSubcategories.exec(function(err1,data1){
      stationarySubcategories.exec(function(err2,data2){
        ebookSubcategories.exec(function(err3,data3){

          //Storing subcategories in array for taking unique value
          var array = [];
          data3.forEach(function(data4){
            var subcategoryEbook = data4.subcategory_id;
            array.push(subcategoryEbook);
          });
          
          var uniqueValueEbook = array.filter(onlyUnique);
          //var records = util.inspect(data, false, null, true /* enable colors */);
          publication.exec(function(err4,data4){
            console.log(data4);
        
          res.render('frontend/publication',{
            bookSubcategories:data1,
            stationarySubcategories:data2,
            ebookSubcategories:uniqueValueEbook,
            cookiesCustomerToken,
            cookiesCustomerrName,
            cookiesCustomerId,
            cookiesCustomerEmail,
            setting : dataa ,
            publicationData : data4
          })
          });
          }); 
        });
      });
    }); 
  });


  router.get('/:slug', function(req, res, next) {

    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

    var slug = req.params.slug;
 

    // var records = util.inspect(data, false, null, true /* enable colors */);
    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status:'Active'});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status:'Active'});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status:'Active'}).populate('subcategory_id');
    // var records = util.inspect(data, false, null, true /* enable colors */);

    var settingData = settingModel.findOne({});
    var publicationDetail = publicationModel.findOne({slug : slug, status : "Active"});


    settingData.exec(function(errr,dataa){
    bookSubcategories.exec(function(err1,data1){
      stationarySubcategories.exec(function(err2,data2){
        ebookSubcategories.exec(function(err3,data3){

          //Storing subcategories in array for taking unique value
          var array = [];
          data3.forEach(function(data4){
            var subcategoryEbook = data4.subcategory_id;
            array.push(subcategoryEbook);
          });
          
          var uniqueValueEbook = array.filter(onlyUnique);
          //var records = util.inspect(data, false, null, true /* enable colors */);
          publicationDetail.exec(function(err4,data4){
   
            var publicationBook = bookAttributesModel.find({publication : data4.publication_name}).populate('product_id');
            
            publicationBook.exec(function(err5, data5){
        
     
            
      
              res.render('frontend/publicationdetails',{
                bookSubcategories:data1,
                stationarySubcategories:data2,
                ebookSubcategories:uniqueValueEbook,
                cookiesCustomerToken,
                cookiesCustomerrName,
                cookiesCustomerId,
                cookiesCustomerEmail,
                setting : dataa,
                publicationDetail : data4,
                publicationBooks : data5
              });
        });
          });
          }); 
        });
      });
    }); 
    

  });

          
  //Making Unique value for E-book
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
   } 

module.exports = router;