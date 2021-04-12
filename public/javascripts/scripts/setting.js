     
      $('#changesettingBtn').on('click',function(){
        if($('#newpassword').val() != ''){
             $('#conpassword').prop('required',true);;
             console.log(1);
        }else{
             $('#conpassword').prop('required',false);;
        }
   });
