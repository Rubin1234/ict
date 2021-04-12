var app = require('express');
var path = require('path');
const https = require("https");
var url = require('url');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug'); 
const axios = require('axios');      
var fs = require('fs');
var nodemailer = require('nodemailer'); 

var router = app.Router();

var categoryModel = require('../../modules/categories');
var SubCategoryModel = require('../../modules/subcategories');
var brandModel = require('../../modules/brand');
var bookAttributesModel = require('../../modules/bookAttributes'); 
var productImagesModel = require('../../modules/product_images'); 
const util = require('util');
var ModelProduct = require('../../modules/product'); 
var modelCart = require('../../modules/cart'); 
var stationaryAttributesModel = require('../../modules/stationaryAttributes'); 
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
const cartModel = require('../../modules/cart');
const reviewModel = require('../../modules/review');
var settingModel = require('../../modules/setting'); 
const sliderModel = require('../../modules/slider');

/* GET home page. */


  router.get('/', function(req, res, next) {
   
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    if(fullUrl.includes('q=su')){
      var object_url = url.parse(fullUrl, true);

      var orderID = object_url.query.oid;
      var amount = object_url.query.amt;
      var refId = object_url.query.refId;
    
      var fullname = object_url.query.fullname;
  

      $url = "https://uat.esewa.com.np/epay/transrec";
      
      data = {
        'amt': amount,
        'scd': 'EPAYTEST',
        'rid': refId,
        'pid':orderID,
    }
  
      axios
      .post('https://uat.esewa.com.np/epay/transrec?amt='+amount+'&scd=EPAYTEST&rid='+refId+'&pid='+orderID)
      .then((res1) => {
   
        var response = res1.data;
      
        var result = response.includes("Success");
        if(result){
          req.flash('successemail','Thank you for purchasing our products.');
          res.redirect('/');
       
        }else{
          console.log('IT is a failure');
         
        }
      })
      .catch((error) => {
        console.error(error)
      })
   
    }

  

      var cookiesCustomerToken = req.cookies.customerToken;
      var cookiesCustomerrName = req.cookies.customerName;
      var cookiesCustomerId = req.cookies.customerId;
      var cookiesCustomerEmail = req.cookies.customerEmail;

   
  
      var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'], status : 'Active'});
      var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'], status : 'Active'});
      var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'], status : 'Active'}).populate('subcategory_id');
      var newArrival = ModelProduct.find({book_type : ['paperbook','both','ebook'], status : 'Active'}).sort({_id:-1}).populate('book_attribute').limit(10);
      var books = ModelProduct.find({book_type : ['paperbook','both'], status : 'Active'}).populate('book_attribute').limit(10);
      var ebooks = ModelProduct.find({book_type : ['ebook','both'], status : 'Active'}).populate('book_attribute').populate('ebook_id').limit(10);
      //  var productModel = ModelProduct.find({book_type : ['paperbook','both']}).populate('book_attribute');
  
      var stationaryProducts = ModelProduct.find({category_id: ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'], status : 'Active'}).populate('book_attribute').populate('stationary_attribute').limit(10);
  
      newArrival.exec(function(err,data){
      
        const promises = data.map((item,index) => new Promise((resolve,reject) => {
          var reviewData = reviewModel.find({product_slug : item.slug});
          reviewData.exec(function(err1,newArrivalData){
       
              resolve(newArrivalData);
          });
        }));
  
        Promise.all(promises)
        .then(allArray => {
  
          //FOr NEw Arrival RAting IN Front View
          var newArrivalReviewArray = [];
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
          
            
            newArrivalReviewArray.push(ratingArray);
          }
          
          ebooks.exec(function(err0,data0){
  
            //For Rating of Ebook for Frontend
            const promises1 = data0.map((item1,index1) => new Promise((resolve,reject) => {
              var reviewData1 = reviewModel.find({product_slug : item1.slug});
              reviewData1.exec(function(err2,ebooksData){
                  resolve(ebooksData);
              });
            }));
  
            Promise.all(promises1)
            .then(allArray1 => {
  
              //FOr NEw Arrival RAting IN Front View
              var ebookReviewArray = [];
              for(var i=0; i<=allArray1.length-1; i++){
  
                var average1 = 0;
                var totalStar1 = 0;
                var actualValue1 = 0;
                var ratingArray1 = [];
    
                allArray1[i].forEach(function(date1){
                  totalStar1 += parseInt(date1.rating_star);
                });
    
                var totalRatingUser1 =  allArray1[i].length;
    
                if(totalRatingUser1 > 0){
                  average1 = totalStar1/totalRatingUser1;
                  average1 = average1.toFixed(1);
                }
       
                var roundOffValue1 = parseInt(average1);
            
                actualValue1 = average1 - roundOffValue1;
  
                ratingArray1.push(average1);
                ratingArray1.push(actualValue1);
          
            
                ebookReviewArray.push(ratingArray1);
              }
  
              books.exec(function(err1,data1){
                //Rating For Book in frontend
                const promises2 = data1.map((item2,index2) => new Promise((resolve,reject) => {
                  var reviewData2 = reviewModel.find({product_slug : item2.slug});
                  reviewData2.exec(function(err3,booksData){
               
                    resolve(booksData);
                  });
                }));
  
                Promise.all(promises2)
                .then(allArray2 => {
  
                  //FOr NEw Arrival RAting IN Front View
                  var bookReviewArray = [];
                  for(var i=0; i<=allArray2.length-1; i++){
  
                    var average2 = 0;
                    var totalStar2 = 0;
                    var actualValue2 = 0;
                    var ratingArray2 = [];
  
                    allArray2[i].forEach(function(date2){
                      totalStar2 += parseInt(date2.rating_star);
                    });
    
                  var totalRatingUser2 =  allArray2[i].length;
    
                if(totalRatingUser2 > 0){
                  average2 = totalStar2/totalRatingUser2;
                  average2 = average2.toFixed(1);
                }
       
                var roundOffValue2 = parseInt(average2);
            
                actualValue2 = average2 - roundOffValue2;
  
                ratingArray2.push(average2);
                ratingArray2.push(actualValue2);
        
                bookReviewArray.push(ratingArray2);
              }
  
  
                stationaryProducts.exec(function(err2,data2){
  
                  //Rating For Book in frontend
                  const promises3 = data2.map((item3,index3) => new Promise((resolve,reject) => {
                    var reviewData3 = reviewModel.find({product_slug : item3.slug});
                    reviewData3.exec(function(err4,stationaryData){
                 
                      resolve(stationaryData);
                    });
                  }));
  
                  Promise.all(promises3)
                  .then(allArray3 => {
  
                         //FOr NEw Arrival RAting IN Front View
                  var stationaryReviewArray = [];
                  for(var i=0; i<=allArray3.length-1; i++){
  
                    var average3 = 0;
                    var totalStar3 = 0;
                    var actualValue3 = 0;
                    var ratingArray3 = [];
  
                    allArray3[i].forEach(function(date3){
                      totalStar3 += parseInt(date3.rating_star);
                    });
    
                  var totalRatingUser3 =  allArray3[i].length;
    
                if(totalRatingUser3 > 0){
                  average3 = totalStar3/totalRatingUser3;
                  average3 = average3.toFixed(1);
                }
       
                var roundOffValue3 = parseInt(average3);
            
                actualValue3 = average3 - roundOffValue3;
  
                ratingArray3.push(average3);
                ratingArray3.push(actualValue3);
        
                stationaryReviewArray.push(ratingArray3);
              }
  
              var settingData = settingModel.findOne({});
              settingData.exec(function(errr,dataa){
                  bookSubcategories.exec(function(err3,data3){
                    stationarySubcategories.exec(function(err4,data4){
                      ebookSubcategories.exec(function(err5,data5){
                     
                        //Storing subcategories in array for taking unique value
                        var array = [];
  
                        data5.forEach(function(data6){
                          var subcategoryEbook = data6.subcategory_id;
                          array.push(subcategoryEbook);
                        });
                    
                        var uniqueValueEbook = array.filter(onlyUnique);
                  
                     

                        sliderModel.find({status:'Active'}).exec(function(error,sliderdata){
                        
                     
                        res.render('frontend/index',{
                          newArrival:data,
                          ebooks:data0,
                          books:data1,
                          stationary:data2,
                          bookSubcategories:data3,
                          stationarySubcategories:data4,
                          ebookSubcategories:uniqueValueEbook,
                          cookiesCustomerToken,
                          cookiesCustomerrName,
                          cookiesCustomerId,
                          cookiesCustomerEmail,
                          newArrivalReviewArray,
                          ebookReviewArray,
                          bookReviewArray,
                          stationaryReviewArray,
                          setting : dataa,
                          sliderdata
                        })
                        }); 
                      });
                    });
                  })
                  });
                }); 
              }); 
              });
            });
            });
          });
        });
    })
   





   
 


  
  });

  
        
  router.get('/addtocart', function(req,res,next){

    var productId = req.query.productId;
    var productNumber = req.query.productNumber;
    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

    if(cookiesCustomerEmail == undefined && cookiesCustomerId == undefined && cookiesCustomerrName == undefined && cookiesCustomerToken == undefined){
      res.send('nocookies');
    }else{  
          ModelProduct.findById(productId).populate('book_attribute').exec(function(err,data){
            modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err1,cart){
            
              var total_quantity = 0;
              //IF Cart is empty
              if(cart != null){
                const existingProductIndex = cart.products.findIndex(p => p.product_id == productId);  //to check product is existing in cart

                //If Cart has same product
                if(existingProductIndex >= 0){
                  const existingProduct = cart.products[existingProductIndex];

                  if(productNumber == undefined){
                    total_quantity =  parseInt(existingProduct.qty) + 1;
                  }else{
                    total_quantity =  parseInt(existingProduct.qty) + parseInt(productNumber);
                  }

                  //Udate Product Array in cart
                  var updateArray = modelCart.updateOne( 
                    { _id: cart.id, "products.product_id": existingProduct.product_id}, 
                    { $set: { "products.$.qty": total_quantity } }
                  )

            
        
                  updateArray.exec(function(err3,data3){
           
                           //For Count Latest Item Quantity Number
                           modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }}).exec(function(err5,cart2){
                    
                            var productItemNumber = 0;
                            var finalAmount = 0;
                            cart2.products.forEach(function(doc){
                
                              //For Showing Item Number
                              productItemNumber += parseInt(doc.qty);
        
                              if(doc.selected == true){
                                //If there is discount on product
                                if(doc.product_id.discount_percent > 0){
                                  if(doc.booktype == 'paperbook' || doc.booktype == null){
                                    var productPrice = doc.product_id.product_price * doc.qty;
                                  }
                                  if(doc.booktype == 'ebook'){
                                    var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                                  }
                
                                  var discountPercent = doc.product_id.discount_percent; 
                                  var discount_price = 0;
                                  var discount_price = discountPercent/100 * productPrice;
                                  var discountedAmount = productPrice - discount_price;
                                  finalAmount += parseInt(discountedAmount);
                                }  
                                else{ 
                                  
                                  //If there is no discount price
                                  if(doc.booktype == 'paperbook' || doc.booktype == null){
                                    var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.product_price);
                                  }
                
                                  if(doc.booktype == 'ebook'){
                                    var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.ebook_id.ebook_price);
                                  }
                
                                  finalAmount += parseInt(productPrice);
                                }
                              } 
                            }); 
                        res.send({
                          'productitem': productItemNumber, 
                          'cart': cart,
                          'totalAmount': finalAmount
                        });
                      });;
                
                  });
                }
                else
                { 

                   //Creating new objects for adding products
                  var products = new Object();
                  
                  //Asigning book type null
                  products.booktype = null;
                  
                  //product number
                  if(productNumber == undefined){
                    products.qty = 1;
                  }else{
                    products.qty = productNumber;
                  }


                //Definiing product object Id
                products.product_id = data._id;
            
                
                cart.products.push(products);
                cart.save().then(arr => {
                         //For Count Latest Item Quantity Number
                         modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : {path: 'ebook_id', model: 'ebook'}}).exec(function(err5,cart1){
                      
                          var productItemNumber = 0;
                          var finalAmount = 0;
                          cart1.products.forEach(function(doc){
                  
                            //For Showing Item Number
                            productItemNumber += parseInt(doc.qty);
            
                            if(doc.selected == true){
                              //If there is discount on product
                              if(doc.product_id.discount_percent > 0){
                                if(doc.booktype == 'paperbook' || doc.booktype == null){
                                  var productPrice = doc.product_id.product_price * doc.qty;
                                }
                                if(doc.booktype == 'ebook'){
                                  var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                                }
              
                                var discountPercent = doc.product_id.discount_percent; 
                                var discount_price = 0;
                                var discount_price = discountPercent/100 * productPrice;
                                var discountedAmount = productPrice - discount_price;
                                finalAmount += parseInt(discountedAmount);
                              }  
                              else{ 
                                
                                //If there is no discount price
                                if(doc.booktype == 'paperbook' || doc.booktype == null){
                                  var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.product_price);
                                }
              
                                if(doc.booktype == 'ebook'){
                                  var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.ebook_id.ebook_price);
                                }
              
                                finalAmount += parseInt(productPrice);
                              }
                            } 
                          });
            
                    res.send({
                      'productitem': productItemNumber, 
                      'cart': cart,
                      'totalAmount' : finalAmount
                    });
                  });   
                });          
                }
              }
              else
              { 
                
                //If Cart is empty
                
                //Creating new objects for adding products
                var products = new Object();

                //Defininig booktype
                products.booktype = null;

                if(productNumber == undefined){
                  products.qty = 1;
                }else{
                  products.qty = productNumber;
                }

                //Defining Selected or not
                products.selected = false;
             
                //Definiing product object Id
                products.product_id = data._id;

                var totalPrice = products.qty * data.product_price;

                var finalAmount = 0;
                //If Discount percent is greater than 0
                if(data.discount_percent > 0){
                  var discount_price = 0;
                  var discount_price = data.discount_percent/100 * totalPrice;
                  var finalAmount = totalPrice - discount_price;

                  var saveCart = new modelCart({
                    customer_id : cookiesCustomerId
                  });
                }else{

                    //Final Price Amount
                    var finalAmount = data.product_price;   
                  
                    var saveCart = new modelCart({
                      customer_id : cookiesCustomerId
                    });
                }
           
                saveCart.products.push(products);
                saveCart.save();

                  res.send({
                    'productitem': products.qty, 
                    'cart': cart,
                    'totalAmount' : finalAmount
                  });
              }
            }); 
          });    
        }
  });



    router.get('/addtobookcart',function(req,res,next){

      var productId = req.query.productId;
      var booknumber = req.query.booknumber;
      var cookiesCustomerToken = req.cookies.customerToken;
      var cookiesCustomerrName = req.cookies.customerName;
      var cookiesCustomerId = req.cookies.customerId;
      var cookiesCustomerEmail = req.cookies.customerEmail;
  
      //If user not signed in
      if(cookiesCustomerEmail == undefined && cookiesCustomerId == undefined && cookiesCustomerrName == undefined && cookiesCustomerToken == undefined){
        res.send('nocookies');
      }else{ 

        //If signed In
        ModelProduct.findById(productId).populate('book_attribute').exec(function(err,data){
          modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err1,cart){
            var total_quantity = 0;
            
            //IF Cart is empty
            if(cart != null){
              const existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == 'paperbook');  //to check product is existing in cart
  
              //If Cart has same product
              if(existingProductIndex >= 0){
                const existingProduct = cart.products[existingProductIndex];
                if(booknumber == undefined){
                  total_quantity =  parseInt(existingProduct.qty) + 1;
                }else{
                  total_quantity =  parseInt(existingProduct.qty) + parseInt(booknumber);
                }
     
                //Update Quantity in Product  Array in cart
                var updateArray = modelCart.update(
                  {customer_id:cookiesCustomerId, 
                  products:{ $elemMatch :{"booktype": "paperbook", "product_id": existingProduct.product_id}}},
                  { $set: { "products.$.qty":  total_quantity }}
                )
            
                updateArray.exec(function(err3,data3){
                  //For Count Latest Item Quantity Number
                  modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }}).exec(function(err5,cart2){
                    
                    var productItemNumber = 0;
                    var finalAmount = 0;
                    cart2.products.forEach(function(doc){
        
                      //For Showing Item Number
                      productItemNumber += parseInt(doc.qty);

                      if(doc.selected == true){
                        //If there is discount on product
                        if(doc.product_id.discount_percent > 0){
                          if(doc.booktype == 'paperbook' || doc.booktype == null){
                            var productPrice = doc.product_id.product_price * doc.qty;
                          }
                          if(doc.booktype == 'ebook'){
                            var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                          }
        
                          var discountPercent = doc.product_id.discount_percent; 
                          var discount_price = 0;
                          var discount_price = discountPercent/100 * productPrice;
                          var discountedAmount = productPrice - discount_price;
                          finalAmount += parseInt(discountedAmount);
                        }  
                        else{ 
                          
                          //If there is no discount price
                          if(doc.booktype == 'paperbook' || doc.booktype == null){
                            var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.product_price);
                          }
        
                          if(doc.booktype == 'ebook'){
                            var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.ebook_id.ebook_price);
                          }
        
                          finalAmount += parseInt(productPrice);
                        }
                      } 
                    });                 
                    res.send({
                      'productitem': productItemNumber, 
                      'cart': cart,
                      'totalAmount' : finalAmount
                    });
                  });  
                });
              }
              else
              { 
                //If card has other different product

            //Creating new objects for adding products
                var products = new Object();
            
                //adding purchased book type
                book_type = 'paperbook';
                products.booktype = book_type;

                if(booknumber == undefined){
                  products.qty = 1;
                }else{
                  products.qty = booknumber;
                }

                //Defining Selected or not
                products.selected = false;

                //Defining product object Id
                products.product_id = data._id;
                  
                cart.products.push(products);

                cart.save().then( arr => {

                  //For Count Latest Item Quantity Number
                  modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : {path: 'ebook_id', model: 'ebook'}}).exec(function(err5,cart1){
                      
                    var productItemNumber = 0;
                    var finalAmount = 0;
                    cart1.products.forEach(function(doc){
            
                      //For Showing Item Number
                      productItemNumber += parseInt(doc.qty);
      
                      if(doc.selected == true){
                        //If there is discount on product
                        if(doc.product_id.discount_percent > 0){
                          if(doc.booktype == 'paperbook' || doc.booktype == null){
                            var productPrice = doc.product_id.product_price * doc.qty;
                          }
                          if(doc.booktype == 'ebook'){
                            var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                          }
        
                          var discountPercent = doc.product_id.discount_percent; 
                          var discount_price = 0;
                          var discount_price = discountPercent/100 * productPrice;
                          var discountedAmount = productPrice - discount_price;
                          finalAmount += parseInt(discountedAmount);
                        }  
                        else{ 
                          
                          //If there is no discount price
                          if(doc.booktype == 'paperbook' || doc.booktype == null){
                            var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.product_price);
                          }
        
                          if(doc.booktype == 'ebook'){
                            var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.ebook_id.ebook_price);
                          }
        
                          finalAmount += parseInt(productPrice);
                        }
                      } 
                    });
              
                    res.send({
                      'productitem': productItemNumber, 
                      'cart': cart,
                      'totalAmount' : finalAmount
                    });
                  });
                });      
              }
            }
            else{ 

              //Creating new objects for adding products
              var products = new Object();
          
              //adding purchased book type
              book_type = 'paperbook';
              products.booktype = book_type;
                
              //Defining book number
              if(booknumber == undefined){
                products.qty = 1;
              }else{
                products.qty = booknumber;
              }

              //Definiing product object Id
              products.product_id = data._id;

              //Defining Selected or not
              products.selected = false;
              
              //If book order is 0
              var totalPrice = products.qty * data.product_price;
                
              var finalAmount = 0;
              //If Discount percent is greater than 0
              if(data.discount_percent > 0){
                var discount_price = 0;
                var discount_price = data.discount_percent/100 * totalPrice;
                var finalAmount = totalPrice - discount_price;

                var saveCart = new modelCart({
                  customer_id : cookiesCustomerId
                });
              }else{

                //Final Price Amount
                var finalAmount = data.product_price;
                var saveCart = new modelCart({
                  customer_id : cookiesCustomerId
                });
              }

              saveCart.products.push(products);
              saveCart.save();
              
              res.send({
                'productitem': products.qty, 
                'cart': cart,
                'totalAmount' : finalAmount
              });
            }
          }); 
        });    
      }
    });


    
    router.get('/addtoebookcart',function(req,res,next){

      var productId = req.query.productId;
      var cookiesCustomerToken = req.cookies.customerToken;
      var cookiesCustomerrName = req.cookies.customerName;
      var cookiesCustomerId = req.cookies.customerId;
      var cookiesCustomerEmail = req.cookies.customerEmail;
  
      if(cookiesCustomerEmail == undefined && cookiesCustomerId == undefined && cookiesCustomerrName == undefined && cookiesCustomerToken == undefined){
        res.send('nocookies');
      }else{ 
        ModelProduct.findById(productId).populate('book_attribute').populate('ebook_id').exec(function(err,data){
          modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err1,cart){
            
            var total_quantity = 0;
            var total_amount = 0;
            
            //IF Cart is empty
            if(cart != null){
              const existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == 'ebook');  //to check product is existing in cart
          
              //If Cart has same product
              if(existingProductIndex >= 0){
               
                const existingProduct = cart.products[existingProductIndex];
             
                total_quantity =  parseInt(existingProduct.qty) + 1;
                
                var updateArray = modelCart.update( 
                  {customer_id:cookiesCustomerId, 
                    products:{ $elemMatch :{"booktype": "ebook",  "product_id": existingProduct.product_id}}},
                    { $set: { "products.$.qty":  total_quantity }}
                )
          
                var totalPrice = data.ebook_id.ebook_price;
          
                updateArray.exec(function(err3,data3){
             
                    //For Count Latest Item Quantity Number
                    modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }}).exec(function(err5,cart2){
            
                      var productItemNumber = 0;
                      var finalAmount = 0;
                      cart2.products.forEach(function(doc){
          
                        //For Showing Item Number
                        productItemNumber += parseInt(doc.qty);
  
                        if(doc.selected == true){
                          //If there is discount on product
                          if(doc.product_id.discount_percent > 0){
                            if(doc.booktype == 'paperbook' || doc.booktype == null){
                              var productPrice = doc.product_id.product_price * doc.qty;
                            }
                            if(doc.booktype == 'ebook'){
                              var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                            }
          
                            var discountPercent = doc.product_id.discount_percent; 
                            var discount_price = 0;
                            var discount_price = discountPercent/100 * productPrice;
                            var discountedAmount = productPrice - discount_price;
                            finalAmount += parseInt(discountedAmount);
                          }  
                          else{ 
                            
                            //If there is no discount price
                            if(doc.booktype == 'paperbook' || doc.booktype == null){
                              var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.product_price);
                            }
          
                            if(doc.booktype == 'ebook'){
                              var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.ebook_id.ebook_price);
                            }
          
                            finalAmount += parseInt(productPrice);
                          }
                        } 
                      }); 

                      res.send({
                        'productitem': productItemNumber, 
                        'cart': cart,
                        'totalAmount' : finalAmount
                      });
                    });
              
                });
              }
              else
              { 

                //If card has other different product
              

                //Creating new objects for adding products
                var products = new Object();
                
                //adding purchased book type
                book_type = 'ebook';
                products.booktype = book_type;
                products.qty = 1;

                //Definiing product object Id
                products.product_id = data._id;

                //Defining Selected or not
                products.selected = false;
              
                cart.products.push(products);
                cart.save().then(arr => {

                  //For Count Latest Item Quantity Number
                  modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : {path: 'ebook_id', model: 'ebook'}}).exec(function(err5,cart1){

                           
                    var productItemNumber = 0;
                    var finalAmount = 0;
                    cart1.products.forEach(function(doc){
            
                      //For Showing Item Number
                      productItemNumber += parseInt(doc.qty);
      
                      if(doc.selected == true){
                        //If there is discount on product
                        if(doc.product_id.discount_percent > 0){
                          if(doc.booktype == 'paperbook' || doc.booktype == null){
                            var productPrice = doc.product_id.product_price * doc.qty;
                          }
                          if(doc.booktype == 'ebook'){
                            var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                          }
        
                          var discountPercent = doc.product_id.discount_percent; 
                          var discount_price = 0;
                          var discount_price = discountPercent/100 * productPrice;
                          var discountedAmount = productPrice - discount_price;
                          finalAmount += parseInt(discountedAmount);
                        }  
                        else{ 
                          
                          //If there is no discount price
                          if(doc.booktype == 'paperbook' || doc.booktype == null){
                            var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.product_price);
                          }
        
                          if(doc.booktype == 'ebook'){
                            var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.ebook_id.ebook_price);
                          }
        
                          finalAmount += parseInt(productPrice);
                        }
                      } 
                    });
                   
                    res.send({
                      'productitem': productItemNumber, 
                      'cart': cart,
                      'totalAmount' : finalAmount
                      });
                    });
           
                });

              }

            }
            else
            { 

              //Creating new objects for adding products
              var products = new Object();
         
              //adding purchased book type
              book_type = 'ebook';
              products.booktype = book_type;

              products.qty = 1;

              //Definiing product object Id
              products.product_id = data._id;

              //Defining Selected or not
              products.selected = false;

              //If book order is 0
              var totalPrice = data.ebook_id.ebook_price;

              var finalAmount = 0;
    
              if(data.discount_percent > 0){
                var discount_price = 0;
                var discount_price = data.discount_percent/100 * totalPrice;
                var finalAmount = totalPrice - discount_price;

                var saveCart = new modelCart({
                  customer_id : cookiesCustomerId
                });

              }else{
                var saveCart = new modelCart({
                  customer_id : cookiesCustomerId
                });

                   //Final Price Amount
                   var finalAmount = data.ebook_id.ebook_price;
              }

              saveCart.products.push(products);
              saveCart.save();     
                res.send({
                  'productitem': products.qty, 
                  'cart': cart,
                  'totalAmount' : finalAmount
                });
            }
          }); 
        });    
      }
    });


  
  router.get('/viewcart', function(req,res,next){
    
    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

    if(cookiesCustomerEmail == undefined && cookiesCustomerId == undefined && cookiesCustomerrName == undefined && cookiesCustomerToken == undefined){
      res.send({
        'productitem': 0, 
       
      });
    }else{

    
     modelCart.findOne({customer_id:cookiesCustomerId}).populate({
      path: 'products.product_id',
      model: 'product', populate : {path: 'ebook_id', model: 'ebook'}
    }).exec(function(err1,cart){
          if(cart == null){
            var productItemNumber = 0;
            res.send({
              'productitem': productItemNumber, 
              'cart': cart,
              'totalAmount': 0,
            });
          }else{
            var productItemNumber = 0;
            var finalAmount = 0;
            cart.products.forEach(function(doc){
              
              //For Showing Item Number
              productItemNumber += parseInt(doc.qty);

              if(doc.selected == true){
                //If there is discount on product
                if(doc.product_id.discount_percent > 0){
                  if(doc.booktype == 'paperbook' || doc.booktype == null){
                    var productPrice = doc.product_id.product_price * doc.qty;
                  }
                  if(doc.booktype == 'ebook'){
                    var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                  }

                  var discountPercent = doc.product_id.discount_percent; 
                  var discount_price = 0;
                  var discount_price = discountPercent/100 * productPrice;
                  var discountedAmount = productPrice - discount_price;
                  finalAmount += parseInt(discountedAmount);
                }  
                else{ 
                  
                  //If there is no discount price
                  if(doc.booktype == 'paperbook' || doc.booktype == null){
                    var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.product_price);
                  }

                  if(doc.booktype == 'ebook'){
                    var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.ebook_id.ebook_price);
                  }

                  finalAmount += parseInt(productPrice);
                }
              } 
            });
  
            res.send({
              'productitem': productItemNumber, 
              'cart': cart,
              'totalAmount': finalAmount,
            });
          }
      });
    }  
  });



  router.get('/mycart',async function(req,res,next){
 
      var cookiesCustomerToken = req.cookies.customerToken;
      var cookiesCustomerrName = req.cookies.customerName;
      var cookiesCustomerId = req.cookies.customerId;
      var cookiesCustomerEmail = req.cookies.customerEmail;
      
    if(cookiesCustomerEmail == undefined && cookiesCustomerId == undefined && cookiesCustomerrName == undefined && cookiesCustomerToken == undefined){
      
      cart = "No Product Added.";
      res.send(cart);
    }else{

      modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err1,cart){
        res.send(cart);
      });
    }
  });



  router.get('/autocomplete', function(req,res,next){

    var regex = new RegExp(req.query["term"],'i');


    var productFilter = ModelProduct.find({product_name:regex},{'product_name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
    productFilter.exec(function(err,data){

      var result = [];

      if(!err){
        if(data && data.length && data.length > 0){
          data.forEach(products=>{
            let obj = {
              id : products._id,
              label : products.product_name
            };
            result.push(obj);
          });
        }
        res.jsonp(result);
      }
    });
  });


  router.post('/search', function(req,res,next){
      
    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;


    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06']});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206']});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both']}).populate('subcategory_id');

    if(req.body.headersearch != ''){

    var regex = new RegExp(req.body.headersearch,'i');

    var productFilter = ModelProduct.find({product_name:regex},{'product_name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
    productFilter.exec(function(err,data){
      const promises = data.map((item,index) => new Promise((resolve,reject) => {
        var productFilter = ModelProduct.findOne({_id:item._id}).populate('book_attribute').populate('stationary_attribute');
        productFilter.exec(function(err1,data1){
            resolve(data1);
        })
      }));

      Promise.all(promises)
      .then(allArray => {  
        // var records = util.inspect(allArray, false, null, true /* enable colors */);  
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

              res.render('frontend/searchpage',{
                bookSubcategories:data1,
                stationarySubcategories:data2,
                ebookSubcategories:uniqueValueEbook,
                cookiesCustomerToken,
                cookiesCustomerrName,
                cookiesCustomerId,
                cookiesCustomerEmail,
                searchedProducts : allArray,
                searchValue : req.body.headersearch,
                setting : dataa
              }); 
            }); 
            });
          });
        });
      });
    });
  }else{
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

      allArray = [];

          res.render('frontend/searchpage',{
            bookSubcategories:data1,
            stationarySubcategories:data2,
            ebookSubcategories:uniqueValueEbook,
            cookiesCustomerToken,
            cookiesCustomerrName,
            cookiesCustomerId,
            cookiesCustomerEmail,
            searchedProducts : allArray,
            searchValue : req.body.headersearch,
            setting: dataa
          }); 
          }); 
        });
      });
    });
  }
  });


  router.post('/newsletter', function(req,res,next){
    var email = req.body.email;
        //Step 1
        let transporter = nodemailer.createTransport({
          service : 'gmail',
          auth : {
            user: process.env.Email,
            pass: process.env.Password
          }
        });
    
        
      //Step 2
      let mailOptions = {
        from : email,
        to : 'rubinawale10@gmail.com',
        subject : 'Kitabharu Newsletter',
        html : '<div style="font-size:16px"><strong>Email: </strong>'+email+'<br>',
      }
    
      transporter.sendMail(mailOptions, function(err,data){
  
        if(err){
          console.log('Error Occurs');
        }else{
          console.log('Email Send');
        }
    
      });
    
    
      req.flash('successnewsletter','Email Sent Succesfully. We will contact you later.Thank you!!!');
      res.redirect('/');
  
  })


    //Making Unique value for E-book
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }



module.exports = router;