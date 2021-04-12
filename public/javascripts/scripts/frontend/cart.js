$(document).ready(function(){
    var productQuantity = $('.qty1').attr('qty');
    $(".amountPerProduct" ).each(function() {
        var amountPerProduct =  $(this).attr('amountPerProduct');
        var productQuantity =  $(this).parent().siblings('.cart-product-quantity').children().children('.qty').val();
        var totalPrice = amountPerProduct * productQuantity;
        $(this).parent().siblings().last().children('.amountTotal').html('Rs '+ totalPrice);
        $(this).parent().siblings().last().children('.amountTotal').attr('totalPrice',totalPrice);
        
        if(productQuantity == 1){
            $(this).parent().siblings().siblings('.cart-product-quantity').children().children('.minus').prop("disabled", true);
        }  
    });
});


function removeItem(){

    var productId =  $(event.currentTarget).attr('productId');
    var bookType =  $(event.currentTarget).attr('bookType');
    var cartProduct = $(event.currentTarget).attr('cartProduct');
    
    $(event.currentTarget).parent().parent().remove();
    var cartItemCount = $('.cartItem').children().length-1;
    
    var a = $(event.currentTarget).parent().siblings('.cart-product-price');
    var totalAmount = 0;


//     $('.amountTotal').each(function(){
//      var totalPricePerProduct = $(this).attr('totalPrice');
//      totalAmount += parseInt(totalPricePerProduct); 
//   });
    
//     $('.amount').empty().html('Rs '+ totalAmount);

    $('#loader').show();
    axios
    .get('/cart/removeitem',
        {   
            params:{
                productId : productId,
                bookType : bookType,
                cartProduct : cartProduct,
            }
        }).then(function(response){
            var productLength = response.data.productitem;
            var totalAmount = response.data.totalAmount; 
            var total = response.data.total; 

            $('.amount').empty().html('Rs '+ totalAmount); 
            $('.totalAmount').empty().html('Rs '+ total);  
       
            $('#cartproductnumber').empty().append(productLength);
            $('#cartproductnumber2').empty().append(productLength);
            $('#cartProductPrice').empty().append(totalAmount);
            $('#loader').hide();

            bootoast.toast({
                message: 'Cart Item Deleted',
                type: 'success'
            });

            if(cartItemCount == 0){
                window.location.href = "../cart";
               }
        
        });
}

function productNumberAdd(){
 
   var quantity =  $(event.currentTarget).siblings('.qty').val();
   var max =  $(event.currentTarget).siblings('.qty').attr('max');
   var totalQuantity = parseInt(quantity) + parseInt(1);

 

    if(parseInt(totalQuantity) > 1){
        $(event.currentTarget).siblings('.minus').prop("disabled", false);
    }
    
    if(parseInt(totalQuantity) == parseInt(max)){
    $(event.currentTarget).attr("disabled","disabled");
    }else{
        $(event.currentTarget).removeAttr("disabled","");
    }


 
  

   var perPrice = $(event.currentTarget).parent().parent().siblings('.cart-product-price').children().attr('amountperproduct');


   var totalPricePerProduct = totalQuantity * parseInt(perPrice);
   $(event.currentTarget).parent().parent().siblings('.cart-product-subtotal').children().html('Rs '+ totalPricePerProduct);
   $(event.currentTarget).parent().parent().siblings('.cart-product-subtotal').children().attr('totalPrice',totalPricePerProduct);

   var totalAmount = 0;
//    $('.amountTotal').each(function(){
//     var totalPricePerProduct = $(this).attr('totalPrice');
//     totalAmount += parseInt(totalPricePerProduct); 
//  });

//  $('.amount').empty().html('Rs '+ totalAmount);

//Using Axios to change into database of quantity and totalprice
var productId =  $(event.currentTarget).attr('productId');
var bookType =  $(event.currentTarget).attr('bookType');
$('#loader').show();
axios
.get('/cart/updated/add',
    {   
        params:{
            totalQuantity : totalQuantity,
            productId : productId,
            bookType : bookType,
        }
    }).then(function(response){
        var productLength = response.data.productitem;
        var totalAmount = response.data.totalAmount;
        var total = response.data.total;
      
         $('.amount').empty().html('Rs '+ totalAmount);
         $('.totalAmount').empty().html('Rs '+ total);  
   
        $('#cartproductnumber').empty().append(productLength);
        $('#cartproductnumber2').empty().append(productLength);
        $('#cartProductPrice').empty().append(totalAmount);
        $('#loader').hide();

        bootoast.toast({
            message: 'Cart Updated',
            type: 'success'
          })
       
    });

}



function productNumberSub(){

    var quantity =  $(event.currentTarget).siblings('.qty').val();
    var max =  $(event.currentTarget).siblings('.qty').attr('max');
    var totalQuantity = parseInt(quantity) - parseInt(1);
   
    if(totalQuantity < max){
        $(event.currentTarget).siblings('.plus').prop("disabled", false);
    }
   
    if(totalQuantity == 1){
        $(event.currentTarget).attr("disabled","disabled");
    }
   
    var perPrice = $(event.currentTarget).parent().parent().siblings('.cart-product-price').children().attr('amountperproduct');
    var totalPricePerProduct = totalQuantity * parseInt(perPrice);
  

    $(event.currentTarget).parent().parent().siblings('.cart-product-subtotal').children().html('Rs '+ totalPricePerProduct);
    $(event.currentTarget).parent().parent().siblings('.cart-product-subtotal').children().attr('totalPrice',totalPricePerProduct);
    
    var totalAmount = 0;
//     $('.amountTotal').each(function(){
//      var totalPricePerProduct = $(this).attr('totalPrice');
//      totalAmount += parseInt(totalPricePerProduct); 
//   });
//   $('.amount').empty().html('Rs '+ totalAmount);


  //Using Axios to change into database of quantity and totalprice

    var productId =  $(event.currentTarget).attr('productId');
    var bookType =  $(event.currentTarget).attr('bookType');
    $('#loader').show();

    axios
    .get('/cart/updated/sub',
        {   
            params:{
                totalQuantity : totalQuantity,
                productId : productId,
                bookType : bookType,
            }
        }).then(function(response){
            var productLength = response.data.productitem;
            var totalAmount = response.data.totalAmount; 
            var total = response.data.total; 
       
            $('.amount').empty().html('Rs '+ totalAmount); 
            $('.totalAmount').empty().html('Rs '+ total);  
            
            $('#cartproductnumber').empty().append(productLength);
            $('#cartproductnumber2').empty().append(productLength);
            $('#cartProductPrice').empty().append(totalAmount);
            $('#loader').hide();
            bootoast.toast({
                message: 'Cart Updated',
                type: 'success'
            })
        
        });

}

function selectItem(){
    if($(event.currentTarget).prop('checked') == true){

       var cartId = $(event.currentTarget).attr('cartProduct');
       var productId = $(event.currentTarget).attr('productId');
       var bookType = $(event.currentTarget).attr('bookType');
       $('#loader').show();
       axios
       .get('/cart/selectoption',
           {   
               params:{
                    cartId : cartId,
                    productId : productId,
                    bookType : bookType,
               }
           }).then(function(response){
            var productLength = response.data.productitem;
            var totalAmount = response.data.totalAmount; 
            var total = response.data.total;
             
            $('#cartProductPrice').empty().append(totalAmount);
            $('.amount').empty().html('Rs '+ totalAmount); 
            $('.totalAmount').empty().html('Rs '+ total); 
               $('#loader').hide();
               bootoast.toast({
                   message: 'Cart Updated',
                   type: 'success'
               })
           
           });

    }else{
        
       var cartId = $(event.currentTarget).attr('cartProduct');
       var productId = $(event.currentTarget).attr('productId');
       var bookType = $(event.currentTarget).attr('bookType');
       $('#loader').show();
       axios
       .get('/cart/deselectoption',
           {   
               params:{
                    cartId : cartId,
                    productId : productId,
                    bookType : bookType,
               }
           }).then(function(response){
            var productLength = response.data.productitem;
            var totalAmount = response.data.totalAmount; 
            var total = response.data.total; 
       

            $('#cartProductPrice').empty().append(totalAmount);
            $('.amount').empty().html('Rs '+ totalAmount); 
            $('.totalAmount').empty().html('Rs '+ total); 
               $('#loader').hide();
               bootoast.toast({
                   message: 'Cart Updated',
                   type: 'success'
               })
           
           });

    }
}

function proceedToCheckOut(){
       var selectLength = $('.selectoption:checked').length;
       if(selectLength <= 0){
       alert('Please select an item to purchase')
        event.preventDefault();
       }
    



    // $('.selectoption').each(function(){ 
    //     if($(this).prop('checked') == true){
    //         return;
    //     }else{
    //         event.preventDefault();
    //         console.log(222);
    //     }
    // })
  

}