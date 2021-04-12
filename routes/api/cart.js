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
var modelCart = require('../../modules/cart'); 
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
var settingModel = require('../../modules/setting'); 
const { rejects } = require('assert');

/* GET home page. */

//Cart View
router.get('/cart/:customerId',async function(req, res, next){
    var customerId = req.params.customerId;
    var cartProduct = await modelCart.findOne({'customer_id':customerId});
    res.send(cartProduct);
})

//Add To Book Cart
router.post('/addtobookcart', function(req, res, next) {

    var productId = req.body.productId;
    var booknumber = req.body.booknumber;
    var cookiesCustomerId = req.body.customerId;

    // var cookiesCustomerToken = req.cookies.customerToken;
    // var cookiesCustomerrName = req.cookies.customerName;
    // var cookiesCustomerId = req.cookies.customerId;
    // var cookiesCustomerEmail = req.cookies.customerEmail;

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
    
});

//Add To Book Cart
router.post('/addtoebookcart', function(req, res, next) {

  var productId = req.body.productId;
  var booknumber = req.body.booknumber;
  var cookiesCustomerId = req.body.customerId;

  // var cookiesCustomerToken = req.cookies.customerToken;
  // var cookiesCustomerrName = req.cookies.customerName;
  // var cookiesCustomerId = req.cookies.customerId;
  // var cookiesCustomerEmail = req.cookies.customerEmail;

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
  
});

//Add to stationary Cart
router.post('/addtostationarycart',function(req,res,next){
    
    var productId = req.body.productId;
    var productNumber = req.body.productNumber;
    var cookiesCustomerId = req.body.customerId;
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
        

});

//Add Item in cart
router.post('/cart/item/add',async function(req, res, next){

    var productId = req.body.productId;
    var cookiesCustomerId = req.body.customerId;
    var bookType = req.body.bookType;

    var productData = await ModelProduct.findById(productId);
    modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err1,cart){
  

        var total_quantity = 0;
      
        // If book type is paperbook or ebook
      if(bookType == 'paperbook' || bookType == 'ebook'){
        var existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == bookType);
      }else{ // if book type is null (Stationary)
        var existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == null);
      }

      const existingProduct = cart.products[existingProductIndex];
 
      
      total_quantity =  parseInt(existingProduct.qty) + 1;

      // total =  parseInt(cart.total_price) + parseInt(totalPrice);

      
      var updateArray = modelCart.updateOne( 
        { _id: cart.id, 
          "products": { "$elemMatch": { "product_id": existingProduct.product_id, "booktype": bookType }}
        }, 
        { $set: { "products.$.qty": total_quantity } }
      )
       
     
   
      updateArray.exec( function(err,data){
   
          //For Count Latest Item Quantity Number
          modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }}).exec(async function(err5,cart2){
                    
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

          //For Delivery and service,tax charge
          var settingData = await settingModel.findOne({});
          var deliveryCharge = settingData.delivery_charge;
          var serviceCharge = settingData.service_charge/100 * finalAmount;
          var taxCharge = settingData.tax_charge/100 * finalAmount;
          var total = finalAmount + parseInt(deliveryCharge) + parseInt(serviceCharge) + parseInt(taxCharge)

            res.send({
              'productitem': productItemNumber, 
              'totalAmount' : finalAmount,
              'total' : total
            });
          });
          
            });
      });
});

//Subtract Item in cart
router.post('/cart/item/sub',async function(req, res, next){

    var totalQuantity = req.body.totalQuantity;
    var productId = req.body.productId;
    var cookiesCustomerId = req.body.customerId;
    var bookType = req.body.bookType;

    var productData = await ModelProduct.findById(productId);

    modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err1,cart){

      var total_quantity = 0;

      // If book type is paperbook or ebook
      if(bookType == 'paperbook' || bookType == 'ebook'){
        var existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == bookType);
      }else{ // if book type is null (Stationary)
        var existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == null);
      }

      const existingProduct = cart.products[existingProductIndex];
   
      total_quantity =  parseInt(existingProduct.qty) - 1;

      //Udate Quantity in Product  Array in cart
      var updateArray = modelCart.updateOne( 
        { _id: cart.id, 
          "products": { "$elemMatch": { "product_id": existingProduct.product_id, "booktype": bookType }}
        }, 
        { $set: { "products.$.qty": total_quantity } }
      )
   
        updateArray.exec(function(err,data){  
            //For Count Latest Item Quantity Number
            modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }}).exec(async function(err5,cart2){
                    
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

              //For Delivery and service,tax charge
              var settingData = await settingModel.findOne({});
              var deliveryCharge = settingData.delivery_charge;
              var serviceCharge = settingData.service_charge/100 * finalAmount;
              var taxCharge = settingData.tax_charge/100 * finalAmount;
              var total = finalAmount + parseInt(deliveryCharge) + parseInt(serviceCharge) + parseInt(taxCharge)
      
              res.send({
                'productitem': productItemNumber, 
                'totalAmount' : finalAmount,
                'total' : total
              });
            });
      
        });
    });

    
  
    // //Udate Quantity in Product  Array in cart
    // var updateArray = modelCart.updateOne(
    //   {customer_id:cookiesCustomerId, 
    //   products:{ $elemMatch :{"book_type": bookType, "_id": productId}}},
    //   { $set: { "products.$.qty":  totalQuantity }}
    // )

 
});

//Cart Item Remove
router.post('/cart/item/removeitem',async function(req, res, next){
  
    //From Axios
    var productId = req.body.productId;
    var bookType = req.body.bookType;
    var cartId = req.body.cartId;
    var cookiesCustomerId = req.body.customerId;

    var productData = await ModelProduct.findById(productId).populate('ebook_id');
    var removeItem = modelCart.findOne({customer_id : cookiesCustomerId, _id : cartId});
     
    removeItem.exec(function(err,data){
  
      // If book type is paperbook or ebook
      if(bookType == 'paperbook' || bookType == 'ebook'){
        var existingProductIndex = data.products.findIndex(p => p.product_id == productId && p.booktype == bookType);
      }else{ // if book type is null (Stationary)
        var existingProductIndex = data.products.findIndex(p => p.product_id == productId && p.booktype == null);
      }
  
      var existingProduct = data.products[existingProductIndex];
  
      var priceToBeDeduct= 0;
  
      // //Price to be deducted
      // if(bookType == 'paperbook' || bookType == ''){
  
      //   var totalPrice =  productData.product_price;
        
      //       //If Product has discount
      //       if(productData.discount_percent > 0){
      //         var discount_price = 0;
      //         var discount_price = productData.discount_percent/100 * totalPrice;
      //         var discountedAmount = totalPrice - discount_price;
      //         priceToBeDeduct = parseInt(existingProduct.qty) * parseInt(discountedAmount);
             
      //       }else{
      //         priceToBeDeduct = parseInt(existingProduct.qty) * parseInt(totalPrice);
             
      //       }
        
     
      // }else{
  
      //   var totalPrice =  productData.ebook_id.ebook_price;
  
      //       //If Product has discount
      //       if(productData.discount_percent > 0){
      //         var discount_price = 0;
      //         var discount_price = productData.discount_percent/100 * totalPrice;
      //         var discountedAmount = totalPrice - discount_price;
  
      //         priceToBeDeduct = parseInt(existingProduct.qty) * parseInt(discountedAmount);
             
      //       }else{
      //         priceToBeDeduct = parseInt(existingProduct.qty) * parseInt(totalPrice);
             
      //       }
  
      // }
     
      //Price Deducted
      // var newTotalPrice = parseInt(data.total_price) - priceToBeDeduct; 
  
      // first element removed
      data.products.splice(existingProductIndex, 1);
  
      //Removing Previous Object
      var updateProduct = modelCart.updateOne({'customer_id':cookiesCustomerId},{ $pull : { 'products': {} }}, {multi:true});
    
      updateProduct.exec(function(err5,data5){
       
        modelCart.updateOne({customer_id:cookiesCustomerId},{products:data.products}).exec(function(err1,data1){
            
            //For Count Latest Item Quantity Number
            modelCart.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }}).exec(async function(err5,cart2){
              
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
  
                //For Delivery and service,tax charge
                var settingData = await settingModel.findOne({});
                var deliveryCharge = settingData.delivery_charge;
                var serviceCharge = settingData.service_charge/100 * finalAmount;
                var taxCharge = settingData.tax_charge/100 * finalAmount;
                var total = finalAmount + parseInt(deliveryCharge) + parseInt(serviceCharge) + parseInt(taxCharge)
      
              res.send({
                'productitem': productItemNumber, 
                'totalAmount' : finalAmount,
                'total' : total
              });
            });
         
          })
  
          //Adding New Object After Deleting
          // cartModel.findOne({customer_id:cookiesCustomerId}).exec(function(err1,data1){
          //   data.products.forEach(function(data2){
          //     data1.products.push(data2);
          //   });
          //   data1.save(); 
          //   res.send(data1);
             
          // });
        });
      });
});


          
module.exports = router;