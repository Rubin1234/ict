
$(document).ready(function(){

  // for 
  axios
  .get('/wishlists/viewwishlist',
  {
 
   }).then(function(response){
        var productLength = response.data.productitem;
        $('#wishlistproductnumber').empty().append(productLength);
      });


});





function addtobookwishlist(){
    var productId = $(event.currentTarget).attr('productId');
    $('#loader').show();
    axios
    .get('../wishlists/addtobookwishlist',
    {
     params:{
       productId: productId,
    }
     }).then(function(response){
      $('#loader').hide();
       if(response.data == 'nocookies'){
         window.location.href = "../customer/login?n=0";
       }else if(response.data == 'item-already-exist'){

        bootoast.toast({
          message: 'Item already exists in wishlist.',
          type: 'danger'
        });
       }
       
       else{
         var productLength = response.data.productitem;
         
  

         
         $('#wishlistproductnumber').empty().append(productLength);
           bootoast.toast({
             message: 'Product Added To Wishlist',
             type: 'success'
           });
       }
        });
  }


  function addtoEbookwishlist(){
    var productId = $(event.currentTarget).attr('productId');
    $('#loader').show();
    
    axios
    .get('../wishlists/addtoebookwishlist',
    {
     params:{
       productId: productId,
    }
     }).then(function(response){
      $('#loader').hide();
       if(response.data == 'nocookies'){
         window.location.href = "../customer/login?n=0";
       }else if(response.data == 'item-already-exist'){

        bootoast.toast({
          message: 'Item already exists in wishlist.',
          type: 'danger'
        });
       }
       
       else{
         var productLength = response.data.productitem;
         console.log(productLength);
  

         
         $('#wishlistproductnumber').empty().append(productLength);
           bootoast.toast({
             message: 'Product Added To Wishlist',
             type: 'success'
           });
       }
        });
  }



  function removeWishlistItem(){
    var productId =  $(event.currentTarget).attr('productId');
    var bookType =  $(event.currentTarget).attr('bookType');
    var cartProduct = $(event.currentTarget).attr('cartProduct');
    
    $(event.currentTarget).parent().parent().remove();
    var wishlistItemCount = $('.wishlistItem').children().length;
    $('#loader').show();
    axios
    .get('/wishlists/removewishlistitem',
        {   
            params:{
                productId : productId,
                bookType : bookType,
                cartProduct : cartProduct,
            }
        }).then(function(response){
          $('#loader').hide();
            bootoast.toast({
                message: 'Cart Item Deleted',
                type: 'success'
            })

            if(wishlistItemCount == 0){
              window.location.href = "../wishlists";
             }
           
        
        });
}

function addtostationarywishlist(){
  var productId = $(event.currentTarget).attr('productId');

  $('#loader').show();
  axios
  .get('../wishlists/addtostationarywishlist',
  {
   params:{
     productId: productId,
  }
   }).then(function(response){
    $('#loader').hide();
     if(response.data == 'nocookies'){
       window.location.href = "../customer/login?n=0";
     }else if(response.data == 'item-already-exist'){

      bootoast.toast({
        message: 'Item already exists in wishlist.',
        type: 'danger'
      });
     }
     
     else{
       var productLength = response.data.productitem;
       
       $('#wishlistproductnumber').empty().append(productLength);
         bootoast.toast({
           message: 'Product Added To Wishlist',
           type: 'success'
         });
     }
      });

}