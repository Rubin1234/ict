var express = require('express');
var router = express.Router();

//package
bcyrpt = require('bcryptjs');

//Models
var userModel = require('../../modules/admin');

//SIgn Up
router.get('/', function(req, res, next) {
    res.render('register',{errormsg:'',successmsg:''});
  });


//Middleware for register

//For matching password & confirm password
checkConfirmPassword = function(req,res,next){
  var password = req.body.password;
  var confirmPassword = req.body.confirmpassword;
  if(password != confirmPassword){
    return res.render('/',{errormsg:"Password does not matched. Please Try Again",successmsg:''});
  }
  next();
}

//for checking alredy taken email

checkEmail = function(req,res,next){
  var email = req.body.emailaddress;
  var existEmail = userModel.findOne({email:email});

  existEmail.exec(function(err,data){
    if(err) throw err;
    if(data){
      return  res.render('/', { errormsg:"Email has already taken.", successmsg:'' });
    }
    next();
  });

}

//storing user information
router.post('/',checkEmail,checkConfirmPassword,function(req,res,next){
  var userName = req.body.fullname;
  var emailAddress = req.body.emailaddress;
  var password = req.body.password;
  var confirmPassword = req.body.confirmpassword;
  
  password = bcyrpt.hashSync(password,10);

  saveUser = new userModel({
    fullname: userName,
    email: emailAddress,
    password: password,
    role: 'admin',
  });
  
  saveUser.save(function(err){
    if(err) throw err;
    else
    res.render('register',{successmsg:"User registered successfully. Please Log In",errormsg:''});
  });

});

module.exports = router;