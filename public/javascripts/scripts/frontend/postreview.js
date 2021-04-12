
function postReview(){
    var comment = $('#message-text').val();
    var starCount =  $('#ratedStar').attr('starCount');
    var productSlug =  $('#productSlug').attr('value');
    var productID =  $('#productID').attr('value');
    var bookType =  $('#booktype').attr('value');


       
    axios
    .get('/savereview',
    {
        params:{
            comment: comment,
            starCount : starCount,
            productSlug : productSlug,
            productID : productID
         }
     })  .then(function(response){
                 $('#ratingModal').modal('hide');
                 $('#thankForRating').empty().html('Thank You For Rating Us !!!');
                 $('.ratenowBtn').blur();

                 if(bookType == ''){
                    window.location.href = "../stationarydetails/"+productSlug;
                }else{
                    window.location.href = "../bookdetails/"+productSlug;
                }
              
        });
   
}

function clickRate(){
    var rate = $(event.currentTarget).val();

    $('#ratedStar').attr('starCount',rate);  
}



function showRatingModal(){
    var productSlug =  $('#productSlug').attr('value');

    axios
    .get('/ratenow',
    {
        params:{
            productSlug : productSlug
         }
     })  .then(function(response){
        if(response.data == 'nocookies'){
            window.location.href = "../customer/login?n=0";
        }else{
                $('#ratingModal .modal-body').html(response.data);
                $('#ratingModal').modal('show');
                var removePostBtn = $('#removePostBtn').attr('value');

                if(removePostBtn == 'null'){
                    $('#postNowBtn').css('display','none');
               }
            }    
    });
}

function closeRatingModal(){
    
    $('#ratingModal').hide();
    $('.modal-backdrop').remove();
  $('.ratenowBtn').blur();
}

function editReview(){
    var data = '';
    data += '<div class="ratingbody" style="position:relative;"> <div><h4 style="text-align: center;color:   #666666;" id="thankForRating">Please Rate Us !!!</h4><div class="star-widget">';

    data += '<input type="radio" name="rate" id="rate-5" value="5" onclick="clickRate()"><label for="rate-5" class="icon-star" ></label><input type="radio" name="rate" id="rate-4" value="4" onclick="clickRate()"><label for="rate-4" class="icon-star" ></label><input type="radio" name="rate" id="rate-3" value="3" onclick="clickRate()"><label for="rate-3" class="icon-star" ></label><input type="radio" name="rate" id="rate-2" value="2" onclick="clickRate()"><label for="rate-2" class="icon-star" ></label><input type="radio" name="rate" id="rate-1" value="1"  onclick="clickRate()"><label for="rate-1" class="icon-star"></label>';
      
    data += '<span id="ratedStar"></span><header><h4 style="font-size: 23px;"></h4></header></div></div></div><div class="form-group"><label for="message-text" class="col-form-label" style="font-weight: bold;">Comment:</label><textarea class="form-control" id="message-text"  rows="4" placeholder="Describe your experience..." ></textarea></div></div>'; 
    
    $('#ratingModal .modal-body').empty().append(data);
    $('#postNowBtn').css('display','block');
}

function deleteComment(){
  var reviewId = $(event.currentTarget).attr('reviewId');
   $(event.currentTarget).parent().remove();
   
  axios
  .get('/deletereview',
  {
      params:{
        reviewId : reviewId
       }
   })  .then(function(response){
    $(event.currentTarget).parent().remove();
       
      });
}