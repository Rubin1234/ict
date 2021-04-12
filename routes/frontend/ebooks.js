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
var ModelProduct = require('../../modules/product'); 
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
const reviewModel = require('../../modules/review');
var settingModel = require('../../modules/setting'); 

/* GET home page. */


  router.get('/', function(req, res, next) {

    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;


  // var records = util.inspect(data, false, null, true /* enable colors */);
  var allEbooks = ModelProduct.find({book_type : ['ebook','both'],status: 'Active'}).populate('ebook_id').populate('book_attribute');
    
  var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status: 'Active'});
  var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status: 'Active'});
  var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status: 'Active'}).populate('subcategory_id');

  
  var slug = '';
  var checked = '';

  allEbooks.exec(function(err,data){
    
    //For Rating
    const promises = data.map((item,index) => new Promise((resolve,reject) => {
      var reviewData = reviewModel.find({product_slug : item.slug});
      reviewData.exec(function(err1,ebooksData){
          resolve(ebooksData);
      });
    }));

    Promise.all(promises)
    .then(allArray => {

          //FOr NEw Arrival RAting IN Front View
          var ebooksReviewArray = [];
          for(var i=0; i<=allArray.length-1; i++){

            var average = 0;
            var totalStar = 0;
            var actualValue = 0;
            var ratingArray = [];
    
            allArray[i].forEach(function(date){
              totalStar += parseInt(date.rating_star);
            });
    
            var totalRatingUser =  allArray[i].length;
    
            if(totalRatingUser > 0){
              average = totalStar/totalRatingUser;
              average = average.toFixed(1);
            }
      
            var roundOffValue = parseInt(average);
            
            actualValue = average - roundOffValue

            ratingArray.push(average);
            ratingArray.push(actualValue);
          
            
            ebooksReviewArray.push(ratingArray);
          }

          var settingData = settingModel.findOne({});
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
                var records = util.inspect(data, false, null, true /* enable colors */);
        
                res.render('frontend/ebooks',{
                  allEbooks:data,
                  bookSubcategories:data1,
                  stationarySubcategories:data2,
                  ebookSubcategories:uniqueValueEbook,
                  cookiesCustomerToken,
                  cookiesCustomerrName,
                  cookiesCustomerId,
                  cookiesCustomerEmail,
                  slug,
                  checked,
                  ebooksReviewArray,
                  setting : dataa
                }); 
              }); 
              });
        });
      });
    });
  });
});


router.get('/:slug',(req,res,next) => {

  var slug = req.params.slug;
  var checked = 'checked';
  var subCategoryName = subCategoryModel.findOne({slug:slug});

  var cookiesCustomerToken = req.cookies.customerToken;
  var cookiesCustomerrName = req.cookies.customerName;
  var cookiesCustomerId = req.cookies.customerId;
  var cookiesCustomerEmail = req.cookies.customerEmail;

  //FOr Menu
  var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status:'Active'});
  var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status:'Active'});
  var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status:'Active'}).populate('subcategory_id');



  subCategoryName.exec(function(err,data){

    var subcategoryId = data._id;

    ModelProduct.find({subcategory_id:subcategoryId,book_type : ['ebook','both'],status:'Active'}).exec(function(err1,data1){

        //For Rating
        const promises = data1.map((item,index) => new Promise((resolve,reject) => {
          var reviewData = reviewModel.find({product_slug : item.slug});
          reviewData.exec(function(err1,stationaryData){
              resolve(stationaryData);
          });
        }));
  
        
        Promise.all(promises)
        .then(allArray => {
  
                //FOr NEw Arrival RAting IN Front View
                var ebooksReviewArray = [];
                for(var i=0; i<=allArray.length-1; i++){
  
                  var average = 0;
                  var totalStar = 0;
                  var actualValue = 0;
                  var ratingArray = [];
          
                  allArray[i].forEach(function(date){
                    totalStar += parseInt(date.rating_star);
                  });
          
                  var totalRatingUser =  allArray[i].length;
          
                  if(totalRatingUser > 0){
                    average = totalStar/totalRatingUser;
                    average = average.toFixed(1);
                  }
            
                  var roundOffValue = parseInt(average);
                  
                  actualValue = average - roundOffValue
  
                  ratingArray.push(average);
                  ratingArray.push(actualValue);
                
                  
                  ebooksReviewArray.push(ratingArray);
                }
  
  


      bookSubcategories.exec(function(err2,data2){
        stationarySubcategories.exec(function(err3,data3){
          ebookSubcategories.exec(function(err4,data4){

                //Storing subcategories in array for taking unique value
           var array = [];
           data4.forEach(function(data5){
             var subcategoryEbook = data5.subcategory_id;
             array.push(subcategoryEbook);
           });
       
           var uniqueValueEbook = array.filter(onlyUnique);

           var settingData = settingModel.findOne({});
           settingData.exec(function(errr,dataa){
            res.render('frontend/ebooks',{
              allEbooks:data1,
              bookSubcategories:data2,
              stationarySubcategories:data3,
              ebookSubcategories:uniqueValueEbook,
              cookiesCustomerToken,
              cookiesCustomerrName,
              cookiesCustomerId,
              cookiesCustomerEmail,
              slug,
              checked,
              setting : dataa,
              ebooksReviewArray
              });
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
           

   router.get('/ebooksubcategory/changecheckbox',function(req,res,next){
    var subcategoryId = req.query.subcategoryId;
  

    if(subcategoryId == undefined){
      
      var allBooks = ModelProduct.find({book_type : ['ebook','both']}).populate('book_attribute').populate('ebook_id');
      allBooks.exec(function(err,data){
     
                 //For Rating
                 const promises = data.map((item,index) => new Promise((resolve,reject) => {
    
                  var reviewData = reviewModel.find({product_slug : item.slug});
                  reviewData.exec(function(err1,booksData){
               
                    resolve(booksData);
                  });
                }));
          
                
                Promise.all(promises)
                .then(allArray => {
          
                    //FOr NEw Arrival RAting IN Front View
                    var booksReviewArray = [];
                    for(var i=0; i<=allArray.length-1; i++){
          
                      var average = 0;
                      var totalStar = 0;
                      var actualValue = 0;
                      var ratingArray = [];
              
                      allArray[i].forEach(function(date){
                        totalStar += parseInt(date.rating_star);
                      });
              
                      var totalRatingUser =  allArray[i].length;
              
                      if(totalRatingUser > 0){
                        average = totalStar/totalRatingUser;
                        average = average.toFixed(1);
                      }
                
                      var roundOffValue = parseInt(average);
                      
                      actualValue = average - roundOffValue
          
                      ratingArray.push(average);
                      ratingArray.push(actualValue);
                    
                      
                      booksReviewArray.push(ratingArray);
                    }
                    
                    res.send({
                      'data': data, 
                      'bookReviewArray': booksReviewArray,
                    });
          
           
                });
      });
    }else{
      var productDetails = ModelProduct.find({subcategory_id:subcategoryId,book_type:['ebook','both']}).populate('book_attribute').populate('ebook_id');
      productDetails.exec(function(err,data){
              //For Rating
      const promises = data.map((item,index) => new Promise((resolve,reject) => {
    
        var reviewData = reviewModel.find({product_slug : item.slug});
        reviewData.exec(function(err1,booksData){
     
          resolve(booksData);
        });
      }));

      
      Promise.all(promises)
      .then(allArray => {

          //FOr NEw Arrival RAting IN Front View
          var booksReviewArray = [];
          for(var i=0; i<=allArray.length-1; i++){

            var average = 0;
            var totalStar = 0;
            var actualValue = 0;
            var ratingArray = [];
    
            allArray[i].forEach(function(date){
              totalStar += parseInt(date.rating_star);
            });
    
            var totalRatingUser =  allArray[i].length;
    
            if(totalRatingUser > 0){
              average = totalStar/totalRatingUser;
              average = average.toFixed(1);
            }
      
            var roundOffValue = parseInt(average);
            
            actualValue = average - roundOffValue

            ratingArray.push(average);
            ratingArray.push(actualValue);
          
            
            booksReviewArray.push(ratingArray);
          }
          
          res.send({
            'data': data, 
            'bookReviewArray': booksReviewArray,
          });

 
      });
      });
    }
 
  
  });


module.exports = router;