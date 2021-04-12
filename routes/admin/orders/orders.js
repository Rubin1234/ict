var app = require('express');
var path = require('path');
var multer = require('multer');
var bcrypt = require('bcryptjs');
var sharp = require('sharp');
var dateFormat = require('dateformat');
var slug = require('slug');
var fs = require('fs');
var router = app.Router();
const moment = require('moment')


var brandModel = require('../../../modules/brand');
var admin = require('../../../modules/admin');
var orderModel = require('../../../modules/orders');
var sessionstorage = require('sessionstorage');

//Checking if the admin is from publication
checkPublication = async function(req,res,next){
    var userId = req.cookies.userId;
    var userDetails = await admin.findOne({_id:userId}).populate('admin_type')
    if(userDetails.admin_type.admin_type == 'Publication'){
      res.render('404');
    }
    next();
  }

router.get('/index',checkPublication, async function (req, res, next) {
  
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var orderData = await orderModel.find({}, null , { sort : {'createdAt' : -1}}).populate('customerId');

    // var brand = brandModel.find({});
    var userData =  admin.findOne({_id:userId});
        userData.exec(function(admindataErr,admindata){
            var selected = 'selected';
            res.render('backend/orders/index', { adminType, title: "Order Lists", records: orderData, dateFormat,admindata,moment,selected });
    
    });
});

router.post('/updatestatus', async function (req, res, next) {
   
    orderModel.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data) => {
        if(err){
         return   res.redirect('/order/index')  
        }
      
        // Emit Event
        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('orderUpdated',{id: req.body.orderId, status: req.body.status})
    
        return  res.redirect('/order/index')
    })
});











router.get('/create',checkPublication,function (req, res, next) {
    var adminType = req.cookies.adminType;
    var userId = req.cookies.userId;

    var userData = admin.findOne({_id:userId});

    userData.exec(function(admindataErr,admindata){
        res.render('backend/brands/create', { adminType, title: "Add Brand",admindata });
    });
});




//storage for Image Upload
var Storage = multer.diskStorage({

    // destination: './public/images/backend/admins/',
    filename: function (req, file, cb) {
        console.log(cb)
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: Storage
}).single('brandimage');






router.post('/store', upload, function (req, res, next) {
    var adminType = req.cookies.adminType;
    var brandName = req.body.brandname;
    var status = req.body.status;

    var image;
    if (req.file == null) {
        image = "";
    } else {
        image = req.file.filename;


        let width = 300;
        let height = 300;

        sharp(req.file.path).resize(width, height).toFile('/home/kitabharu/kitabharu/public/images/backend/brands/' + req.file.filename);
    }

    var saveBrand = new brandModel({
        brand_name: brandName,
        brand_image: image,
        status: status,
    });

    saveBrand.save(function (err, data) {
        req.flash('success', 'Product Inserted Succesfully. Thank you!!!');
        res.redirect('/brand/index');
    });
});


router.get('/edit/:id',checkPublication,function (req, res, next) {
    var adminType = req.cookies.adminType;
    var Id = req.params.id;
    var userId = req.cookies.userId;
    
    var edit_brand = brandModel.findById(Id);
    var userData = admin.findOne({_id:userId});
    
    var selected = 'selected';

    edit_brand.exec(function (err, data) {
        userData.exec(function(admindataErr,admindata){
            res.render('backend/brands/edit', { adminType, title: 'Edit Brand', data, selected,admindata });
        });
    });

});

router.post('/update', upload, function (req, res, next) {
    var brandId = req.body.id;
    var brandName = req.body.brandname;
    var previousBrandImage = req.body.previousBrandImage;
    var status = req.body.status;



    var image;
    if (req.file == null) {
        image = previousBrandImage;
    } else {

        image = req.file.filename;

        let width = 300;
        let height = 300;

        sharp(req.file.path).resize(width, height).toFile('/home/kitabharu/kitabharu/public/images/backend/brands/' + req.file.filename);


        if (previousBrandImage != '') {
            console.log(1)
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/brands/' + previousBrandImage;
            fs.unlinkSync(filePath);
        }
    }

    var updateBrand = brandModel.findByIdAndUpdate(brandId, {
        brand_name: brandName,
        brand_image: image,
        status: status,
    })

    updateBrand.exec(function (err, data) {
        req.flash('success', 'Data Updated Succesfully. Thank you!!!');
        return res.redirect('/brand/index');
    });

    console.log(image);


});


router.get('/delete/:id', function (req, res, next) {
    var Id = req.params.id;
    var deleteBrand = brandModel.findByIdAndDelete(Id);

    deleteBrand.exec(function (err, data) {
        if (err) throw err;

        // If category image is not null
        if (data.brand_image != null) {
            var filePath = '/home/kitabharu/kitabharu/public/images/backend/brands/' + data.brand_image;
            fs.unlinkSync(filePath);
        }


        req.flash('success', 'Data Deleted Succesfully. Thank you!!!');
        return res.redirect('/brand/index');

    });

});


module.exports = router;
