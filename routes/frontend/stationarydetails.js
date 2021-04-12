var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');       
var fs = require('fs');
var moment = require('moment');  

var router = app.Router();

var categoryModel = require('../../modules/categories');
var SubCategoryModel = require('../../modules/subcategories');
var brandModel = require('../../modules/brand');
var bookAttributesModel = require('../../modules/bookAttributes'); 
var productImagesModel = require('../../modules/product_images'); 
const util = require('util');
var ModelProduct = require('../../modules/product'); 
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
const reviewModel = require('../../modules/review');
const settingModel = require('../../modules/setting'); 

/* GET home page. */


  router.get('/:slug', function(req, res, next) {

    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;


    // var records = util.inspect(data, false, null, true /* enable colors */);
    var slug = req.params.slug;
    
    var stationaryDetails = ModelProduct.findOne({slug:slug}).populate('images').populate('stationary_attribute').populate('subcategory_id').populate('images').populate('ebook_id');
    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status : 'Active'});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status : 'Active'});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status : 'Active'}).populate('subcategory_id');

    var review = reviewModel.find({product_slug : slug}).populate('customer_id');
    
    stationaryDetails.exec(function(err,data){
      console.log(data);
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
    
            review.exec(function(err4,data5){
              
              var dateArray = [];
              var countFiveStar = [];
              var countFourStar = [];
              var countThreeStar = [];
              var countTwoStar = [];
              var countOneStar = [];
              var average = 0;
              var totalStar = 0;

              data5.forEach(function(date){
                if(date.rating_star == 5){
                  countFiveStar.push(date.rating_star); 
                }
                if(date.rating_star == 4){
                  countFourStar.push(date.rating_star); 
                }
                if(date.rating_star == 3){
                  countThreeStar.push(date.rating_star); 
                }
                if(date.rating_star == 2){
                  countTwoStar.push(date.rating_star); 
                }
                if(date.rating_star == 1){
                  countOneStar.push(date.rating_star); 
                }

                totalStar += parseInt(date.rating_star);
                var date = moment(date.updatedAt).fromNow(); 
                dateArray.push(date);

              });

              var totalRatingUser = data5.length;
              
              if(totalRatingUser > 0){
                average = totalStar/totalRatingUser;
                average = parseInt(average.toFixed(1));
              }
          
              var roundOffValue = parseInt(average);

              var settingData = settingModel.findOne({});


              settingData.exec(function(errr,dataa){
              res.render('frontend/stationarydetails',{
                stationaryDetails:data,
                bookSubcategories:data1,
                stationarySubcategories:data2,
                ebookSubcategories:uniqueValueEbook,
                cookiesCustomerToken,
                cookiesCustomerrName,
                cookiesCustomerId,
                cookiesCustomerEmail,
                reviews : data5,
                dateArray,
                countFiveStar,
                countFourStar,
                countThreeStar,
                countTwoStar,
                countOneStar,
                average,
                roundOffValue,
                setting : dataa
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