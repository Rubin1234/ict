     
      $('#addAdminBtn').on('click',function(){
        if($('#newpassword').val().trim() != ''){
             
             $('#conpassword').prop('required',true);
          
        }else{
             $('#conpassword').prop('required',false);;
        }
   });


   function changeAdminType(){
     var adminType = $(event.currentTarget).find('option:selected').attr('adminType');
     console.log(adminType);

     if(adminType == 'Publication'){
          $('#publicationName').css('display','block')
          $('#publicationName .selectpicker').prop('required',true)

     }else{
          $('#publicationName').css('display','none')
          $('#publicationName .selectpicker').prop('required',false)
     }


   }
