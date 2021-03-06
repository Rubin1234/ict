var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var axios = require('axios');
var slug = require('slug');       
var fs = require('fs');
var cors = require('cors');

var router = app.Router();

var categoryModel = require('../../../modules/categories');
var SubCategoryModel = require('../../../modules/subcategories');
var brandModel = require('../../../modules/brand');
var bookAttributesModel = require('../../../modules/bookAttributes'); 
var productImagesModel = require('../../../modules/product_images'); 
const util = require('util');
const ModelProduct = require('../../../modules/product');
var modelCart = require('../../../modules/cart'); 
const subCategoryModel = require('../../../modules/subcategories');
const { populate, db } = require('../../../modules/categories');
var settingModel = require('../../../modules/setting'); 
const { rejects } = require('assert');
const { resolve } = require('path');

/* GET home page. */

//Cart View
router.get('/cart/:customerId',cors(),async function(req, res, next){
    var customerId = req.params.customerId;
    var cartProduct = await modelCart.findOne({'customer_id':customerId});
    res.send(cartProduct);
})

//Add To Book Cart
router.post('/addtobookcart',cors(), function(req, res, next) {

    var productId = req.body.productId;
    var booknumber = req.body.booknumber;
    var cookiesCustomerId = req.body.customerId;
    axios
    .get(`https://ict.bharyangnepal.org/api/product/${productId}`,
    {
        params:{
            productId: productId
         }
     })
    .then(function(response){
     var data = response.data;
                //If signed In
     
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
                  modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err5,cart2){
                        
                    axios
                    .get(`https://ict.bharyangnepal.org/api/product/${productId}`,
                    {
                        params:{
                            productId: productId
                         }
                     })
                    .then(function(response){
                     var data1 = response.data;

                    var productItemNumber = 0;
                    var finalAmount = 0;
                    cart2.products.forEach(function(doc){
                     
        
                      //For Showing Item Number
                      productItemNumber += parseInt(doc.qty);

                      if(doc.selected == true){
                        //If there is discount on product
                        if(data1.discount > 0){
                          if(doc.booktype == 'paperbook' || doc.booktype == null){
                            var productPrice = parseInt(data1.price) * parseInt(doc.qty);
                            console.log(productPrice);
                          }
                          if(doc.booktype == 'ebook'){
                            var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                          }
        
                          var discountPercent = data1.discount; 
                          var discount_price = 0;
                          var discount_price = discountPercent/100 * productPrice;
                          var discountedAmount = productPrice - discount_price;
                          finalAmount += parseInt(discountedAmount);
                        }  
                        else{ 
                          
                          //If there is no discount price
                          if(doc.booktype == 'paperbook' || doc.booktype == null){
                            var productPrice = parseInt(doc.qty) * parseInt(data1.price);
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
                })
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
                products.product_id = data.id;
                  
                cart.products.push(products);

                cart.save().then( arr => {

                    modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err5,cart2){
                        
                        axios
                        .get(`https://ict.bharyangnepal.org/api/product/${productId}`,
                        {
                            params:{
                                productId: productId
                             }
                         })
                        .then(function(response){
                         var data1 = response.data;
                            console.log(data1);
      
    
    
                        var productItemNumber = 0;
                        var finalAmount = 0;
                        cart2.products.forEach(function(doc){
                         
            
                          //For Showing Item Number
                          productItemNumber += parseInt(doc.qty);
    
                          if(doc.selected == true){
                            //If there is discount on product
                            if(data1.discount > 0){
                              if(doc.booktype == 'paperbook' || doc.booktype == null){
                                var productPrice = parseInt(data1.price) * parseInt(doc.qty);
                             
                              }
                              if(doc.booktype == 'ebook'){
                                var productPrice = doc.product_id.ebook_id.ebook_price * doc.qty;
                              }
            
                              var discountPercent = data1.discount; 
                              var discount_price = 0;
                              var discount_price = discountPercent/100 * productPrice;
                              var discountedAmount = productPrice - discount_price;
                              finalAmount += parseInt(discountedAmount);
                            }  
                            else{ 
                              
                              //If there is no discount price
                              if(doc.booktype == 'paperbook' || doc.booktype == null){
                                var productPrice = parseInt(doc.qty) * parseInt(data1.price);
                              }
            
                              if(doc.booktype == 'ebook'){
                                var productPrice = parseInt(doc.qty) * parseInt(doc.product_id.ebook_id.ebook_price);
                              }
            
                              finalAmount += parseInt(productPrice);
                            }
                          } 
                        }); 
                        console.log(finalAmount);  
                        
             
                        res.send({
                          'productitem': productItemNumber, 
                          'cart': cart,
                          'totalAmount' : finalAmount
                        });
                      });  
                    })
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
              console.log(products.qty);

              //Definiing product object Id
              products.product_id = data.id;

              //Defining Selected or not
              products.selected = false;
              
              //If book order is 0
              var totalPrice = products.qty * data.price;
              console.log(totalPrice);
              var finalAmount = 0;
              //If Discount percent is greater than 0
              if(data.discount > 0){
                var discount_price = 0;
                var discount_price = data.discount/100 * totalPrice;
                var finalAmount = totalPrice - discount_price;

                var saveCart = new modelCart({
                  customer_id : cookiesCustomerId
                });
              }else{

                //Final Price Amount
                var finalAmount = data.price;
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
    })    
});

router.post('/viewcart',cors(), function(req,res,next){
  var cookiesCustomerId = req.body.customerId;
  if(cookiesCustomerId == undefined){
    res.send({
      'productitem': 0, 
    });
  }else{
   modelCart.findOne({customer_id:cookiesCustomerId}).exec( function(err1,cart){
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

          const promises =  cart.products.map((doc) => new Promise((resolve,reject) => {
         
              //For Showing Item Number
              productItemNumber += parseInt(doc.qty);
              resolve(productItemNumber);
          }));
        
        Promise.all(promises)
        .then(allArray => {  
          var lastItem = allArray[allArray.length - 1]
          res.send({
            'productitem': lastItem, 
          });
        });

      
        }
    });
  }  
});

router.post('/cart/item/add',async function(req, res, next){

  var productId = req.body.productId;
  var cookiesCustomerId = req.body.customerId;
  var bookType = req.body.bookType;

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

    var updateArray = modelCart.updateOne( 
      { _id: cart.id, 
        "products": { "$elemMatch": { "product_id": existingProduct.product_id, "booktype": bookType }}
      }, 
      { $set: { "products.$.qty": total_quantity } }
    )
     
    updateArray.exec( function(err,data){
 
        //For Count Latest Item Quantity Number
        modelCart.findOne({customer_id:cookiesCustomerId}).exec(async function(err5,cart2){
          var productItemNumber = 0;
          cart2.products.forEach(function(doc){
            productItemNumber += parseInt(doc.qty);

          }); 
          res.send({
            'productitem': productItemNumber, 
          });
        });
        
          });
    });
});

router.post('/cart/item/sub',async function(req, res, next){

  var totalQuantity = req.body.totalQuantity;
  var productId = req.body.productId;
  var cookiesCustomerId = req.body.customerId;
  var bookType = req.body.bookType;

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
        modelCart.findOne({customer_id:cookiesCustomerId}).exec(async function(err5,cart2){
                  
          var productItemNumber = 0;
          cart2.products.forEach(function(doc){   
            //For Showing Item Number
              productItemNumber += parseInt(doc.qty);
          }); 
          res.send({
            'productitem': productItemNumber, 
          });
        });
      });
  });

});

router.post('/cart/item/removeitem',async function(req, res, next){
  
  //From Axios
  var productId = req.body.productId;
  var bookType = req.body.bookType;
  var cartId = req.body.cartId;
  var cookiesCustomerId = req.body.customerId;

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

    // first element removed
    data.products.splice(existingProductIndex, 1);

    //Removing Previous Object
    var updateProduct = modelCart.updateOne({'customer_id':cookiesCustomerId},{ $pull : { 'products': {} }}, {multi:true});
  
    updateProduct.exec(function(err5,data5){
     
      modelCart.updateOne({customer_id:cookiesCustomerId},{products:data.products}).exec(function(err1,data1){
          
          //For Count Latest Item Quantity Number
          modelCart.findOne({customer_id:cookiesCustomerId}).exec(async function(err5,cart2){
            
              var productItemNumber = 0;
              var finalAmount = 0;
              cart2.products.forEach(function(doc){
  
                //For Showing Item Number
                productItemNumber += parseInt(doc.qty);
              }); 

            res.send({
              'productitem': productItemNumber, 
            });
          });
       
        })
      });
    });
});

router.post('/selectoption',async function(req, res, next){
  var cookiesCustomerId = req.body.customerId;
  var productId = req.body.productId;
  var bookType = req.body.bookType;
  var cartProduct = req.body.cartId;

  modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err1,cart){   

    // If book type is paperbook or ebook
    if(bookType == 'paperbook' || bookType == 'ebook'){
      var existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == bookType);
      const existingProduct = cart.products[existingProductIndex];
      var updateArray = modelCart.updateOne( 
        { _id: cart.id, 
          "products": { "$elemMatch": { "product_id": existingProduct.product_id, "booktype": bookType }}
        }, 
        { $set: { "products.$.selected": true } }
      )
    }else{ // if book type is null (Stationary)
      var existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == null);
      const existingProduct = cart.products[existingProductIndex];
  
      var updateArray = modelCart.updateOne( 
        { _id: cart.id, 
          "products": { "$elemMatch": { "product_id": existingProduct.product_id, "booktype": null }}
        }, 
        { $set: { "products.$.selected": true } }
      )
    }

    updateArray.exec(function(err,data){ 
      modelCart.findOne({customer_id:cookiesCustomerId}).exec(async function(err5,cart2){         //For Count Latest Item Quantity Number
        var productItemNumber = 0;
        var finalAmount = 0;
        cart2.products.forEach(function(doc){   
          productItemNumber += parseInt(doc.qty);      //For Showing Item Number
        });
            
        res.send({
          'productitem': productItemNumber, 
          'cart' : cart2
        });
      });
    });
  });
});

router.post('/deselectoption',async function(req, res, next){
  var cookiesCustomerId = req.body.customerId;
  var productId = req.body.productId;
  var bookType = req.body.bookType;

  modelCart.findOne({customer_id:cookiesCustomerId}).exec(function(err1,cart){
    var total_quantity = 0;

    // If book type is paperbook or ebook
    if(bookType == 'paperbook' || bookType == 'ebook'){
      var existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == bookType);
      const existingProduct = cart.products[existingProductIndex];
      var updateArray = modelCart.updateOne( 
        { _id: cart.id, 
          "products": { "$elemMatch": { "product_id": existingProduct.product_id, "booktype": bookType }}
        }, 
        { $set: { "products.$.selected": false } }
      )
    }else{            // if book type is null (Stationary)
      var existingProductIndex = cart.products.findIndex(p => p.product_id == productId && p.booktype == null);
      const existingProduct = cart.products[existingProductIndex];
      var updateArray = modelCart.updateOne( 
        { _id: cart.id, 
          "products": { "$elemMatch": { "product_id": existingProduct.product_id, "booktype": null }}
        }, 
        { $set: { "products.$.selected": false } }
      )
    }

    updateArray.exec(function(err,data){ 
      modelCart.findOne({customer_id:cookiesCustomerId}).exec(async function(err5,cart2){       //For Count Latest Item Quantity Number
        var productItemNumber = 0;
        cart2.products.forEach(function(doc){   
          productItemNumber += parseInt(doc.qty);          //For Showing Item Number
        }); 

        res.send({
          'productitem': productItemNumber, 
          'cart' : cart2
        });
      });
  });

  });
});

router.post('/store',async function(req, res, next) {

  //For E-Sewa
  var totalAmount = req.body.tAmt;
  var amount = req.body.amt;
  var taxAmount = req.body.txAmt;
  var serviceCharge = req.body.psc;
  var DeliveryCharge = req.body.pdc;
  var Merchantcode = req.body.scd;
  var orderId = req.body.pid;
  var successLink = req.body.su;
  var failureLink = req.body.fu;

  var fullName = req.body.fullname;
  var phoneNumber = req.body.phonenumber;
  var city = req.body.city;
  var streetAddress = req.body.street_address;
  var paymentType = req.body.paymentmethod;

  var cookiesCustomerId = req.cookies.customerId;
  
  var customerProducts = await cartModel.findOne({customer_id : cookiesCustomerId})
  var products = customerProducts.products;

  res.cookie('customerFullName',fullName)
  res.cookie('customerPhoneNumber',phoneNumber)
  res.cookie('customerCity',city)
  res.cookie('customerStreetAddress',streetAddress)
  res.cookie('customerPaymentType',paymentType)
  res.cookie('customerTotalAmount',totalAmount)

  // var saveOrder = new orderModel({
  //   customerId : cookiesCustomerId,
  //   fullName : fullName,
  //   phoneNumber : phoneNumber,
  //   city : city,
  //   streetAddress: streetAddress,
  //   products : products,
  //   paymentType : paymentType,
  //   totalAmount : totalAmount
  // })

  // saveOrder.save().then(async result => {
  // await cartModel.findOneAndDelete({customer_id : cookiesCustomerId})      
  // orderModel.populate(result,{path : 'customerId'},(err, placeOrder) => {

      
  // var data = {
  //   'tAmt' : totalAmount,
  //   'amt' : amount,
  //   'txAmt' : taxAmount,
  //   'psc' : serviceCharge,
  //   'pdc' : DeliveryCharge,
  //   'scd' : Merchantcode,
  //   'pid' : orderId,
  //   'su' : successLink,
  //   'fu' : failureLink,
  // }




  res.redirect('https://uat.esewa.com.np/epay/main?tAmt='+totalAmount+'&amt='+amount+'&txAmt='+taxAmount+'&psc='+serviceCharge+'&pdc='+DeliveryCharge+'&scd=EPAYTEST&pid='+orderId+'&su='+successLink+'&fu='+failureLink);
        
//         //Emit Event
//         const eventEmitter = req.app.get('eventEmitter');
//         eventEmitter.emit('orderPlaced',placeOrder)

//   });
// });

});

router.post('deleteselected',async function(req, res, next){
  console.log(1);
  return;

  await modelCart.update({customer_id : cookiesCustomerId}, {$pull: {products:{selected:true}}});
  res.send('success');
})

module.exports = router;