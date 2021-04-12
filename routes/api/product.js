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
const subCategoryModel = require('../../modules/subcategories');
const { populate, db } = require('../../modules/categories');
const { rejects } = require('assert');

/* GET home page. */



//All Product
router.get('/productlist', function(req, res, next) {
    var product = ModelProduct.find({}).populate('book_attribute').populate('stationary_attribute').populate('ebook_id');
    product.exec(function(err,data){
    res.send(data);
    })
});

//All Product
router.get('/productlist/:id', function(req, res, next) {
    var productId = req.params.id;
    var product = ModelProduct.findOne({_id : productId}).populate('book_attribute').populate('stationary_attribute').populate('ebook_id');
    product.exec(function(err,data){
    res.send(data);
    })
});



//By Category Id
router.get('/productlist/category/:id',async function(req, res, next) {
    var categoryId = req.params.id;
    var productByCategory = await ModelProduct.find({category_id:categoryId}).populate('book_attribute').populate('stationary_attribute').populate('ebook_id');
    res.send(productByCategory);
});

  //By SubCategory Id
router.get('/productlist/subcategory/:id',async function(req, res, next) {
    var categoryId = req.params.id;
    var productBySubCategory = await ModelProduct.find({subcategory_id:categoryId}).populate('book_attribute').populate('stationary_attribute').populate('ebook_id');
    res.send(productBySubCategory);
});
          
module.exports = router;