$(document).ready(function(){

  //For Search
    $('#searchProduct').autocomplete({
      source : function(req, res){

        $.ajax({
          url : "../autocomplete/",
          dataType : "jsonp",
          type : "GET",
          data : req,
          success : function(data){
            res(data);
          },
          error : function(err){
            console.log(err.status);
          }
        });
      },

      minLength:1,
      select : function(event,ui){
        if(ui.item){
          $('#searchProduct').text(ui.item.label);
        }
      }
    });

  // for 
  axios
  .get('/viewcart',
  {
 
   }).then(function(response){
        var productLength = response.data.productitem;
        var totalAmount = response.data.totalAmount;
   if(totalAmount == undefined){
    totalAmount = 0
   }
  
        $('#cartproductnumber').append(productLength);
        $('#cartproductnumber2').append(productLength);
        $('#cartProductPrice').empty().append(totalAmount);
      });
});



function addtocart(){

  var productId = $(event.currentTarget).attr('productId');
  var productNumber = $('#booknumber').val();

  //FOr Showing loader
  $('#loader').show();

    axios
       .get('/addtocart',
       {
        params:{
          productId: productId,
          productNumber: productNumber
       }
        }).then(function(response){
          if(response.data == 'nocookies'){
            window.location.href = "customer/login?n=0";
          }else{

            var productLength = response.data.productitem;
            var totalAmount = response.data.totalAmount;
         
       
            $('#cartproductnumber').empty().append(productLength);
            $('#cartproductnumber2').empty().append(productLength);
            // $('#cartProductPrice').empty().append(totalAmount);

            //FOr hiding Loader
            $('#loader').hide();
            
              bootoast.toast({
                message: 'Product Added To Cart',
                type: 'success'
              });
          }
           });
}



function mycart(){
  axios
  .get('/mycart',
  {
  
   }).then(function(response){
    var myCart = response.data.products;
    
    if(myCart != undefined){
      var cart = '';
      var total_price = 0;
      myCart.forEach(function(data){
               
      cart += '<div class="top-cart-item clearfix"><div class="top-cart-item-image"><a href="#"><img src="/images/backend/products/'+data.product_image+'" alt="'+data.product_name+'" /></a></div><div class="top-cart-item-desc"><a href="#">'+data.product_name+'</a><p style="margin-bottom:0px;">';
      if(data.book_type == 'paperbook'){
        cart += 'Paperbook';
      }else if(data.book_type == 'ebook'){
        cart += 'Ebook';
      }
      cart += '</p><span class="top-cart-item-price">'+data.product_price*data.qty+'</span><span class="top-cart-item-quantity">x '+data.qty+'</span></div></div>';
      
      total_price += data.product_price*data.qty;
    });
    }else{
      cart = 'No Product Added';
      total_price = 0;
    }
  
      $('#cartitemtotal').empty().append('Rs '+total_price);
      $('.top-cart-items').empty().append(cart);
    });
}




function addtobookcart(){

  var productId = $(event.currentTarget).attr('productId');
  var booknumber = $('#booknumber').val();

  //For Showing Loader
  $('#loader').show();

  axios
  .get('/addtobookcart',
  {
   params:{
     productId: productId,
     booknumber: booknumber
  }
   }).then(function(response){
     if(response.data == 'nocookies'){
       window.location.href = "../customer/login?n=0";
     }else{
        
      var productLength = response.data.productitem;
      var totalAmount = response.data.totalAmount;  
 

        $('#cartproductnumber').empty().append(productLength);
        $('#cartproductnumber2').empty().append(productLength);
        // $('#cartProductPrice').empty().append(totalAmount);
        
        //For Showing Loader
        $('#loader').hide();
        
        bootoast.toast({
          message: 'Product Added To Cart',
          type: 'success'
        });
     }
      });
}

function addtoEbookcart(){
  var productId = $(event.currentTarget).attr('productId');

  //For Showing Loader
  $('#loader').show();

  axios
  .get('/addtoebookcart',
  {
   params:{
     productId: productId
  }
   }).then(function(response){

     if(response.data == 'nocookies'){
       window.location.href = "customer/login?n=0";
     }else{
       var productLength = response.data.productitem;
       var totalAmount = response.data.totalAmount;  
   
       $('#cartproductnumber').empty().append(productLength);
       $('#cartproductnumber2').empty().append(productLength);
      //  $('#cartProductPrice').empty().append(totalAmount);

       $('#loader').hide();
         bootoast.toast({
           message: 'Product Added To Cart',
           type: 'success'
         });
     }
      });
}

function proceedPayment(){
  var fullname = $('#fullname').val();
  var phoneNumber = $('#phoneNumber').val();
  var city = $('#city').val();
  var streetAddress = $('#streetAdd').val();


  //Fullname
  if(fullname == ''){
   var fullnameErr = "Please enter your full name."
   $('#fullNameErr').empty().html(fullnameErr);
   event.preventDefault();
  }else{
    $('#fullNameErr').empty();
  }

  // if(phoneNumber == ''){
  //   var phoneNumberErr = "Please enter your Phone Number"
  //   $('#phoneNumberErr').empty().html(phoneNumberErr);
  //  }

  //For Phone Number
   var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
   if(phoneNumber.match(phoneno)){
    $('#phoneNumberErr').empty();
   }else{
    var phoneNumberErr = "Please enter Valid Phone Number"
    $('#phoneNumberErr').empty().html(phoneNumberErr);
    event.preventDefault();
   }

   //For City
   if(city == ''){
    var cityErr = "Please select your city."
    $('#cityErr').empty().html(cityErr);
    event.preventDefault();
   }else{
    $('#cityErr').empty();
   }

 
   //For Street Address
   if(streetAddress == ''){
    var streetErr = "Please enter you street Address."
    $('#streetAddressErr').empty().html(streetErr);
    event.preventDefault();
   }else{
    $('#streetAddressErr').empty();
   }

   //Payment Method
   if($('#esewa').is(":checked") || $('#cod').is(":checked")){
    $('#choosePaymentErr').empty();

   }else{
     var choosePaymentErr = "Please choose one of the payment method."
     $('#choosePaymentErr').empty().html(choosePaymentErr);
     event.preventDefault();
   }
  

}