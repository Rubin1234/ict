$('#sumitresetpassword').on('click',function(){

    if( $('#newpassword').val() == '' || $('#conpassword').val() == ''){
   
        $('#pwnotmatched').empty().append('<b>All fields are required.</b>')
        return;
    }else{
        if($('#newpassword').val() != ''){
            $('#conpassword').prop('required',true);
               if($('#newpassword').val() != $('#conpassword').val()){
                   event.preventDefault();
                   $('#pwnotmatched').empty().append('<b>New and old password does not matched.</b>')
                   return;
               }else{
                   return true;
               }
   
              
       }else{
            $('#conpassword').prop('required',false);;
       }
    }


 
});
