var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');       
var fs = require('fs');
const axios = require('axios');  
var uniqid = require('uniqid');
var FormData = require('form-data');

var router = app.Router();

const categoryModel = require('../../modules/categories');
const SubCategoryModel = require('../../modules/subcategories');
const brandModel = require('../../modules/brand');
const bookAttributesModel = require('../../modules/bookAttributes'); 
const productImagesModel = require('../../modules/product_images'); 
const util = require('util');
const ModelProduct = require('../../modules/product');
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
const cartModel = require('../../modules/cart');
const settingModel = require('../../modules/setting');
const orderModel = require('../../modules/orders') 

router.get('/', function(req, res, next) {

    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

    var esewa_orderID = uniqid();
    var customerCart = cartModel.findOne({customer_id:cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }});
    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status:'Active'});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status:'Active'});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status:'Active'}).populate('subcategory_id');
     // var records = util.inspect(data, false, null, true /* enable colors */);

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
  
            customerCart.exec(function(err4,data4){

              //For Total Price
              var productItemNumber = 0;
              var finalAmount = 0;
              data4.products.forEach(function(doc){ 
            

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

          var deliveryCharge = dataa.delivery_charge;
          var serviceCharge = dataa.service_charge/100 * finalAmount;
          var taxCharge = dataa.tax_charge/100 * finalAmount;
          var total = finalAmount + parseInt(deliveryCharge) + parseInt(serviceCharge) + parseInt(taxCharge);

 
                    
            // var records = util.inspect(data4, false, null, true /* enable colors */);
            res.render('frontend/payment',{
              bookSubcategories:data1,
              stationarySubcategories:data2,
              ebookSubcategories:uniqueValueEbook,
              cookiesCustomerToken,
              cookiesCustomerrName,
              cookiesCustomerId,
              cookiesCustomerEmail,
              setting : dataa,
              esewa_orderID,
              finalAmount,
              serviceCharge,
              deliveryCharge,
              taxCharge,
              total
            
            });
            });
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

   //Making Unique value for E-book
 function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
   } 

  module.exports = router;