$(function () {
    CKEDITOR.replace('publicationeditor',{
        toolbar: 'Full',
        enterMode : CKEDITOR.ENTER_BR,
        shiftEnterMode: CKEDITOR.ENTER_P,
        on:{
            change: function() {
              var val = CKEDITOR.instances['publicationeditor'].getData();
              if(val.length > 0){
                $('#editorError').empty();
              }
            }

        }
    });
});


function imagePublicationValidation(){
 
    var validExt = ["jpeg","png","jpg"];
    var imageInput =  $(event.currentTarget).val();

    var pos_of_dot = imageInput.lastIndexOf('.')+1;
    var img_ext = imageInput.substring(pos_of_dot);
    var result = validExt.includes(img_ext);
    
    if(imageInput != ''){
       if(result == false){
          $('#imgError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Image File is not Image</p>')
          event.preventDefault();
          return false;
       }else{
          $('#imgError').empty();
       }
       return true;
    }
}
   

function publicationFormValidation(){
    var publicationeditor = CKEDITOR.instances['publicationeditor'].getData();

    //For Image File Validation
    var validExt = ["jpeg","png","jpg"];   
    var url = window.location.href.split('/')[4];

    if(url == "edit"){
        var newImage = document.forms['parsley-examples']['publicationimage'].value;

        if(newImage == ''){
            imageInput = document.forms['parsley-examples']['previousPublicationImage'].value;
        }else{
            imageInput = newImage;
        }
    }else{
        var imageInput = document.forms['parsley-examples']['publicationimage'].value;
    }


    var pos_of_dot = imageInput.lastIndexOf('.')+1;
    var img_ext = imageInput.substring(pos_of_dot);
    var result = validExt.includes(img_ext);

    if(imageInput != ''){
        if(result == false){
            $('#imgError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Image File is not Image</p>')
            event.preventDefault();
        }else{
            $('#imgError').empty();
        }
   }else{
        $('#imgError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Image File is required</p>')
        event.preventDefault();
    }

    if(publicationeditor == ''){
      $('#editorError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Description field is required.</p>')
         event.preventDefault();
    }else{
        $('#editorError').empty();  
    }
}