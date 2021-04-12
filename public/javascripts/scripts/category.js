function imageCategoryValidation(){

    var validExt = ["jpeg","png","jpg"];
    var imageInput = $(event.currentTarget).val();
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


 function imageCategoryIconValidation(){

    var validExt = ["jpeg","png","jpg"];
    var imageInput = $(event.currentTarget).val();
    var pos_of_dot = imageInput.lastIndexOf('.')+1;
    var img_ext = imageInput.substring(pos_of_dot);
    var result = validExt.includes(img_ext);

 
    if(imageInput != ''){
       if(result == false){
          $('#iconimgError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i>Icon Image File is not Image</p>')
          event.preventDefault();
          return false;
       }else{
          $('#iconimgError').empty();
       }
       return true;
    }
 }


 
 function categoryFormValidation(){ 

   
    // var publicationeditor = CKEDITOR.instances['publicationeditor'].getData();

    //For Image File Validation
    var validExt = ["jpeg","png","jpg"];   
    var url = window.location.href.split('/')[4];
   

    if(url == "edit"){
        var newImage = document.forms['parsley-examples']['categoryimage'].value;
        var newImage1 = document.forms['parsley-examples']['categoryicon'].value;

     

        if(newImage == ''){
            imageInput = document.forms['parsley-examples']['previousCategoryImage'].value;
        }else{
            imageInput = newImage;
        }

        if(newImage1 == ''){
            imageInput1 = document.forms['parsley-examples']['previousIconImage'].value;
        }else{
            imageInput1 = newImage1;
        }
    }else{
        var imageInput = document.forms['parsley-examples']['categoryimage'].value;
        var imageInput1 = document.forms['parsley-examples']['categoryicon'].value;
    }

    var pos_of_dot = imageInput.lastIndexOf('.')+1;
    var pos_of_dot1 = imageInput1.lastIndexOf('.')+1;

    var img_ext = imageInput.substring(pos_of_dot);
    var img_ext1 = imageInput1.substring(pos_of_dot1);

    var result = validExt.includes(img_ext);
    var result1 = validExt.includes(img_ext1);


   

    if(imageInput != ''){
        if(result == false){
            $('#imgError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Image File is not Image</p>')
            event.preventDefault();
        }else{
            $('#imgError').empty();
        }
   }

   
   if(imageInput1 != ''){
        if(result1 == false){
            $('#iconimgError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Icon Image File is not Image</p>')
            event.preventDefault();
        }else{
            $('#iconimgError').empty();
        }
    }
    
    //    else{
    //         $('#imgError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Image File is required</p>')
    //         event.preventDefault();
    //     }

    // if(publicationeditor == ''){
    //   $('#editorError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Description field is required.</p>')
    //      event.preventDefault();
    // }else{
    //     $('#editorError').empty();  
    // }
}

