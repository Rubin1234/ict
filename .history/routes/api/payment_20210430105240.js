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
var orderModel = require('../../modules/orders');
const { rejects } = require('assert');

/* GET home page. */

//Cart View
router.get('/store',async function(req, res, next){
       //For E-Sewa
    var totalAmount = req.body.tAmt;
    var amount = req.body.amt;
    var taxAmount = req.body.txAmt;

    var paymentId = req.body.pid;
    // var successLink = req.body.su;
    // var failureLink = req.body.fu;

    var fullName = req.body.fullname;
    var phoneNumber = req.body.phonenumber;
    var city = req.body.city;
    var streetAddress = req.body.street_address;
    var paymentType = req.body.paymentmethod;
    var cookiesCustomerId = req.body.customerId;

    var customerProducts = await modelCart.findOne({customer_id : cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }})

    var products = customerProducts.products;

    var arr = [];
    products.forEach(function(d){
      var products = new Object();
      products.booktype = d.booktype
      products.qty = d.qty
      products.product = d.product_id.toObject()
      arr.push(products);
    })
  
    var saveOrder = new orderModel({
        customerId : cookiesCustomerId,
        fullName : fullName,
        phoneNumber : phoneNumber,
        city : city,
        streetAddress: streetAddress,
        products : arr,
        paymentType : paymentType,
        totalAmount : totalAmount,
        orderId : paymentId,
        ordered_from : 'mobile'
      })

      saveOrder.save().then(async result => {
        var products = result.products;
        products.forEach( async element => {
      
          // var stock = element.product.product_stock;
          var product = await ModelProduct.findOne({_id:element.product._id});
          var stock = product.product_stock - element.qty;

          if(element.booktype != 'ebook'){
            await ModelProduct.findOneAndUpdate({_id:element.product._id},{product_stock:stock});
          }
        });

        await modelCart.update({customer_id : cookiesCustomerId}, {$pull: {products:{selected:true}}})

        orderModel.populate(result,{path : 'customerId'},(err, placeOrder) => {
            
            //Emit Event
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('orderPlaced',placeOrder);
            res.send(result);
        
        });
      });

   
  
    // res.redirect('https://uat.esewa.com.np/epay/main?tAmt='+totalAmount+'&amt='+amount+'&txAmt='+taxAmount+'&psc='+serviceCharge+'&pdc='+DeliveryCharge+'&scd=EPAYTEST&pid='+orderId+'&su='+successLink+'&fu='+failureLink);


});
       
module.exports = router;