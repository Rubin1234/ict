
var array = [];


$(document).ready(function(){
    $('.bookcheckbox').each(function(){
        if($(this).is(":checked")){
            var subcategory_id = $(this).attr('subcategory_id');
            array.push(subcategory_id);
        }
    });

    //Disabling
    $('#booknumberminus').on('click',function(){
        var booknumber = $('#booknumber').val();
        var max = $('#booknumber').attr('max');
    
        if(booknumber < max){
            $('#booknumberplus').prop("disabled", false);
        }

        if(booknumber == 1){
            $('#booknumberminus').prop("disabled", true);
        }
       
    });

    $('#booknumberplus').on('click',function(){
        var booknumber = $('#booknumber').val();
        var max = $('#booknumber').attr('max');

        if(booknumber > 1){
            $('#booknumberminus').prop("disabled", false);
        }

        if(booknumber == max){
            $('#booknumberplus').attr('disabled','');
        }else{
            $('#booknumberplus').prop("disabled", false);
        }
    });
});


  function bookSubcategoryCheckbox(){
    if($(event.currentTarget).is(":checked")){

        $('.book-listing-page').empty();
        $('#loader').show();

        var subcategory_id =  $(event.currentTarget).attr('subcategory_id');
        array.push(subcategory_id);

       axios
       .get('/books/booksubcategory/changecheckbox',
       {
           
           params:{
               subcategoryId: array
            }

        }).then(function(response){

            $('#loader').hide();
          
            var data = response.data.data;
            var bookReviewArray = response.data.bookReviewArray;
            var doc = '';
          

            if(data.length > 0){
                data.forEach(function(data1,index){
                    doc += '<div class="col-md-3"><div class="new-arrival-books"> <img src="../images/backend/products/'+data1.product_image+'"  style="width: 100%;height: 200px;">';

                    if(data1.discount_percent > 0){
                        doc += ' <div class="showdiscountpercent">' + data1.discount_percent + '% off</div>';
                    }

                    doc += '<div class="new-arrival-books-desc"><h4>'+data1.product_name+'</h4>';
            
                    doc += '<div>';
                    for(var i=1; i <= 5; i++){
                       
                        if(i <= bookReviewArray[index][0]){
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB19ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            var j=i; } 
                        }
                        if((bookReviewArray[index][1]) == 0.5 ){ 
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB13svEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            var j=j+1;
                        }
    
                        if((bookReviewArray[index][1] ) < 0.5 && (bookReviewArray[index][1] ) != 0 ){
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB16MwRdOqAXuNjy1XdXXaYcVXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            var j=j+1; 
                        } 
        
                        if((bookReviewArray[index][1] ) >  0.5 ){
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB14IvEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            var j=j+1; 
                        }
        
                        for(var k=j; k < 5; k++){
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB18ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                        }
                     
                        if(bookReviewArray[index][0] == 0){
                            for(var i=1; i <= 5  ; i++){
                                doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB18ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            }
                        }  
                      doc += '</div>';

                    doc += '<div class="book-price-box d-flex">';
                    if(data1.discount_percent > 0){
                      var discount_price = 0;
                      var discount_price = data1.discount_percent/100* data1.product_price
                      var discountedAmount = data1.product_price - discount_price
                    
                    doc += '<s style="color: #848484;font-family:auto;font-size: 18px;margin-left: auto;margin-right: auto;padding-top: 2px;">Rs '+ data1.product_price +'</s> <h4 style="margin-left: auto;margin-right: auto;">Rs.' + discountedAmount + '</h4>';
                      }else{
                     doc += '<h4 style="margin-left: auto;margin-right: auto;">Rs. '+  data1.product_price + '</h4>';
                         }
                   doc += '</div>';
                    
                    
                    doc += '</div> <div class="view-book"><a href="../bookdetails/'+data1.slug+'" ><button type="" class="form-control"><i class="icon-line-eye"></i>&nbsp;&nbsp;View Details</button></a> <button type="" class="form-control"><i class="icon-cart-plus"></i>&nbsp;&nbsp;Add to Cart</button> </div></div></div>';
                });

            }else{

                doc += ' <h4 style="margin: auto;">Sorry, No Books Available</h4>';
                $('.pagination').remove();
            
            }

                $('.book-listing-page').empty().append(doc);
              
           });
    }else{
            
            
        $('.book-listing-page').empty();
      
        $('#loader').show();
            var subcategory_id =  $(event.currentTarget).attr('subcategory_id');
            const index = array.indexOf(subcategory_id);

            if(index > -1){
                array.splice(index,1);
            }
       
       axios
       .get('/books/booksubcategory/changecheckbox',
       {
           params:{
               subcategoryId: array
            }
        })  .then(function(response){
            
            var data = response.data.data;
            var bookReviewArray = response.data.bookReviewArray;
            var doc = '';

            if(data.length > 0){
                data.forEach(function(data1,index){
                    doc += '<div class="col-md-3"><div class="new-arrival-books"> <img src="../images/backend/products/'+data1.product_image+'"  style="width: 100%;height: 200px;">';
                    if(data1.discount_percent > 0){
                        doc += ' <div class="showdiscountpercent">' + data1.discount_percent + '% off</div>';
                    }

                    doc += '<div class="new-arrival-books-desc"><h4>'+data1.product_name+'</h4>';
                    doc += '<div>';


                    for(var i=1; i <= 5; i++){
                       
                        if(i <= bookReviewArray[index][0]){
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB19ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            var j=i; } 
                        }
                        if((bookReviewArray[index][1]) == 0.5 ){ 
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB13svEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            var j=j+1;
                        }
    
                        if((bookReviewArray[index][1] ) < 0.5 && (bookReviewArray[index][1] ) != 0 ){
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB16MwRdOqAXuNjy1XdXXaYcVXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            var j=j+1; 
                        } 
        
                        if((bookReviewArray[index][1] ) >  0.5 ){
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB14IvEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            var j=j+1; 
                        }
        
                        for(var k=j; k < 5; k++){
                            doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB18ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                        }
                     
                        if(bookReviewArray[index][0] == 0){
                            for(var i=1; i <= 5  ; i++){
                                doc += '<img class="star" src="//laz-img-cdn.alicdn.com/tfs/TB18ZvEgfDH8KJjy1XcXXcpdXXa-64-64.png" style="width: 18.25px; height: 18.25px;display: inline-block;padding: 0px;">';
                            }
                        }  
                      doc += '</div>';




                    doc += '<div class="book-price-box d-flex">';
                    if(data1.discount_percent > 0){
                      var discount_price = 0;
                      var discount_price = data1.discount_percent/100* data1.product_price
                      var discountedAmount = data1.product_price - discount_price
                      console.log('aa')
                    doc += '<s style="color: #848484;font-family:auto;font-size: 18px;margin-left: auto;margin-right: auto;padding-top: 2px;">Rs '+ data1.product_price +'</s> <h4 style="margin-left: auto;margin-right: auto;">Rs.' + discountedAmount + '</h4>';
                      }else{
                          console.log('a')
                     doc += '<h4 style="margin-left: auto;margin-right: auto;">Rs. '+  data1.product_price + '</h4>';
                         }
                   doc += '</div>';

                    doc += '</div> <div class="view-book"><a href="../bookdetails/'+data1.slug+'" ><button type="" class="form-control"><i class="icon-line-eye"></i>&nbsp;&nbsp;View Details</button></a> <button type="" class="form-control"><i class="icon-cart-plus"></i>&nbsp;&nbsp;Add to Cart</button> </div></div></div>';
                });
                $('#loader').hide();
               
            }else{
                doc += ' <h4 style="margin: auto;">Sorry, No Books Available</h4>';
                $('.pagination').remove();
            }
                $('.book-listing-page').empty().append(doc);
              
           });
            
        }
    }
