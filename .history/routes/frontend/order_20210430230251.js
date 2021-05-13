var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');       
var fs = require('fs');
var url = require('url');
const moment = require('moment')
const axios = require('axios');   

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
const orderModel = require('../../modules/orders'); 
const productModel = require('../../modules/product');

/* GET home page. */


router.get('/', async function(req, res, next) {

     
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;


  //After E-sewa success Payment 
  if(fullUrl.includes('q=su')){
    // console.log(req.cookies);

    var object_url = url.parse(fullUrl, true);

    //ORder Id, Amount, refId
    var orderID = object_url.query.oid;
    var amount = object_url.query.amt;
    var refId = object_url.query.refId;


    var cookiesCustomerId = req.cookies.customerId;
    var customerProducts = await cartModel.findOne({customer_id : cookiesCustomerId}).populate({path: 'products.product_id',model: 'product', populate : { path: 'ebook_id', model: 'ebook' }})

    var products = customerProducts.products;

    var arr = [];
    products.forEach(function(d){
      var products = new Object();
      products.booktype = d.booktype
      products.qty = d.qty
      products.product = d.product_id.toObject()
      arr.push(products);
    })
  
    var customerFullName = req.cookies.customerFullName;
    var customerCity = req.cookies.customerCity;
    var customerStreetAddress = req.cookies.customerStreetAddress;
    var customerPaymentType = req.cookies.customerPaymentType;
    var customerTotalAmount = req.cookies.customerTotalAmount;
    var customerPhoneNumber = req.cookies.customerPhoneNumber;
 
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


            //Saving order after successful payment in esewa
            var saveOrder = new orderModel({
              customerId : cookiesCustomerId,
              fullName : customerFullName,
              phoneNumber : customerPhoneNumber,
              city : customerCity,
              streetAddress: customerStreetAddress,
              products : arr,
              paymentType : customerPaymentType,
              totalAmount : customerTotalAmount,
              orderId : orderID
            })
        
            saveOrder.save().then(async result => {

              // var records = util.inspect(result, false, null, true /* enable colors */);

              var products = result.products;
              products.forEach( async element => {
            
                // var stock = element.product.product_stock;
                var product = await productModel.findOne({_id:element.product._id});
                var stock = product.product_stock - element.qty;

                if(element.booktype != 'ebook'){
                  await productModel.findOneAndUpdate({_id:element.product._id},{product_stock:stock});
                }
            
          
                // console.log(stock);
                // db.collection('products').aggregate( [ { $project: { product_stock:{$subtract:[  'product_stock','5'] }}} ] )
               
              });
             


              await cartModel.update({customer_id : cookiesCustomerId}, {$pull: {products:{selected:true}}})
              
              orderModel.populate(result,{path : 'customerId'},(err, placeOrder) => {
            
                //Emit Event
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('orderPlaced',placeOrder);

                req.flash('success','Thank you for purchasing our products.');
                res.redirect('/orders');
                    
                    });
                  });
        
          }else{
            console.log('IT is a failure');
          
          }
        })
        .catch((error) => {
          console.error(error)
        })
  }else{

    
    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status:'Active'});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status:'Active'});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status:'Active'}).populate('subcategory_id');
     // var records = util.inspect(data, false, null, true /* enable colors */);

     var settingData = settingModel.findOne({});
     var orderData = await orderModel.find({customerId : cookiesCustomerId}, null , { sort : {'createdAt' : -1}})

   
  
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
          
            // var records = util.inspect(data4, false, null, true /* enable colors */);
            res.render('frontend/order',{
              bookSubcategories:data1,
              stationarySubcategories:data2,
              ebookSubcategories:uniqueValueEbook,
              cookiesCustomerToken,
              cookiesCustomerrName,
              cookiesCustomerId,
              cookiesCustomerEmail,
              setting : dataa,
              orderData,
              moment,
        
            });
         
          });
        });
      });
    });  

  }

   

  });

  router.get('/:id',async function(req, res, next) {
    var cookiesCustomerToken = req.cookies.customerToken;
    var cookiesCustomerrName = req.cookies.customerName;
    var cookiesCustomerId = req.cookies.customerId;
    var cookiesCustomerEmail = req.cookies.customerEmail;

    var bookSubcategories = SubCategoryModel.find({category_type_id : ['5fba1ad7fae27545a03341fe','5fc86fabe5825658544dfa06'],status:'Active'});
    var stationarySubcategories = SubCategoryModel.find({category_type_id : ['5fc871bce5825658544dfa0c','5fba1b3afae27545a0334206'],status:'Active'});
    var ebookSubcategories = ModelProduct.find({book_type : ['ebook','both'],status:'Active'}).populate('subcategory_id');
     // var records = util.inspect(data, false, null, true /* enable colors */);

     var settingData = settingModel.findOne({});
     const orderData = await orderModel.findById(req.params.id);
  
     if(cookiesCustomerId.toString() === orderData.customerId.toString()){

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
  

         
          
            // var records = util.inspect(data4, false, null, true /* enable colors */);
            res.render('frontend/singleOrder',{
              bookSubcategories:data1,
              stationarySubcategories:data2,
              ebookSubcategories:uniqueValueEbook,
              cookiesCustomerToken,
              cookiesCustomerrName,
              cookiesCustomerId,
              cookiesCustomerEmail,
              setting : dataa,
              orderData,
              moment
            });
          
          });
        });
      });
    }); 
}else{
    return res.redirect('/');
}
  });




  //Making Unique value for E-book
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
   } 


module.exports = router;