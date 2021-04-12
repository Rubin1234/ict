   
      $('#customeraccountupdate').on('click',function(){
  
        if($('#newpassword').val() != ''){
             $('#conpassword').prop('required',true);
                if($('#newpassword').val() != $('#conpassword').val()){
                    event.preventDefault();
                    $('#pwnotmatched').empty().append('New and old password does not matched.')
                    return;
                }else{
                    return true;
                }

               
        }else{
             $('#conpassword').prop('required',false);;
        }
   });
