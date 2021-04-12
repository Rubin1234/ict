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
var cartModel = require('../../modules/cart'); 
var orderModel = require('../../modules/orders')
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
const { rejects } = require('assert');

/* GET home page. */

//Cart View
router.get('/booking/:customerId',async function(req, res, next){
    var customerId = req.params.customerId;
    var orderData = await orderModel.find({customerId : customerId}, null , { sort : {'createdAt' : -1}})
    res.send(orderData);
});


router.post('/booking/store',async function(req, res, next) {

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

    //User Details
    var fullName = req.body.fullname;
    var phoneNumber = req.body.phonenumber;
    var city = req.body.city;
    var streetAddress = req.body.street_address;
    var paymentType = req.body.paymentmethod;
    var cookiesCustomerId = req.body.customerId;
    var orderId = req.body.oid
 
    var customerProducts = await cartModel.findOne({customer_id : cookiesCustomerId})
    var products = customerProducts.products;
 

            //Saving order after successful payment in esewa
            var saveOrder = new orderModel({
                customerId : cookiesCustomerId,
                fullName : fullName,
                phoneNumber : phoneNumber,
                city : city,
                streetAddress: streetAddress,
                products : products,
                paymentType : paymentType,
                totalAmount : totalAmount,
                orderId : orderId
              })
          
              saveOrder.save().then(async result => {
                await cartModel.findOneAndDelete({customer_id : cookiesCustomerId})
                
                orderModel.populate(result,{path : 'customerId'},(err, placeOrder) => {
              
                  //Emit Event
                  const eventEmitter = req.app.get('eventEmitter');
                  eventEmitter.emit('orderPlaced',placeOrder);
  
                  res.send('success');
                    
                      });
                    });
          
        

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


    res.redirect('https://uat.esewa.com.np/epay/main?tAmt='+totalAmount+'&amt='+amount+'&txAmt='+taxAmount+'&psc='+serviceCharge+'&pdc='+DeliveryCharge+'&scd=EPAYTEST&pid='+orderId+'&su=http://127.0.0.1:3000/api/booking/'+cookiesCustomerId+'?q=su&fu=http://127.0.0.1:3000/payment/?q=fu');
          
  //         //Emit Event
  //         const eventEmitter = req.app.get('eventEmitter');
  //         eventEmitter.emit('orderPlaced',placeOrder)

  //   });
  // });

  });






          
module.exports = router;