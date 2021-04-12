var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');    
var moment = require('moment');     
var fs = require('fs');

var router = app.Router();

var categoryModel = require('../../modules/categories');
var SubCategoryModel = require('../../modules/subcategories');
var brandModel = require('../../modules/brand');
var bookAttributesModel = require('../../modules/bookAttributes'); 
var productImagesModel = require('../../modules/product_images'); 
const util = require('util');
var ModelProduct = require('../../modules/product'); 
const subCategoryModel = require('../../modules/subcategories');
const articleModel = require('../../modules/articles');
const { populate, db } = require('../../modules/categories');
var settingModel = require('../../modules/setting'); 

/* GET home page. */


  router.get('/', function(req, res, next) {

    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

   

    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status:'Active'});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status:'Active'});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status:'Active'}).populate('subcategory_id');
    //var records = util.inspect(data, false, null, true /* enable colors */);

    var articles = articleModel.find({status: 'Active'});
  
    var settingData = settingModel.findOne({});
    settingData.exec(function(errr,dataa){
    articles.exec(function(err,data){
 

     


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
      
            res.render('frontend/articles',{
              bookSubcategories:data1,
              stationarySubcategories:data2,
              ebookSubcategories:uniqueValueEbook,
              cookiesCustomerToken,
              cookiesCustomerrName,
              cookiesCustomerId,
              cookiesCustomerEmail,
              records : data,
              moment: moment,
              setting : dataa
          });
        });
          }); 
        });
      });
    });
  });


  router.get('/:slug', function(req, res, next) {
    var slug = req.params.slug;

    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status:'Active'});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status:'Active'});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status:'Active'}).populate('subcategory_id');
    //var records = util.inspect(data, false, null, true /* enable colors */);

    var articles = articleModel.findOne({slug: slug});
    var otherArticles = articleModel.find({slug:{$ne : slug}}).limit(3);
  

    articles.exec(function(err,data){
     
      var date = moment(data.createdAt).fromNow();
      

      var settingData = settingModel.findOne({});
      settingData.exec(function(errr,dataa){
        otherArticles.exec(function(er,dc){
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
          
                res.render('frontend/articledetails',{
                  bookSubcategories:data1,
                  stationarySubcategories:data2,
                  ebookSubcategories:uniqueValueEbook,
                  cookiesCustomerToken,
                  cookiesCustomerrName,
                  cookiesCustomerId,
                  cookiesCustomerEmail,
                  data,
                  otherarticles: dc,
                  date,
                  setting:dataa 
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