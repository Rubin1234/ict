$(function () {
    CKEDITOR.replace('articleseditor',{
        on:{
            change: function() {
              var val = CKEDITOR.instances['articleseditor'].getData();
              if(val.length > 0){
                $('#editorError').empty();
              }
            }

        }
    });
});


    
//FOr Articles
function imageArticleValidation(){
 

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


 function articleFormValidation(){
    var articleseditor = CKEDITOR.instances['articleseditor'].getData();

    //For Image File Validation
    var validExt = ["jpeg","png","jpg"];   
    var url = window.location.href.split('/')[4];

    if(url == "edit"){
        var newImage = document.forms['parsley-examples']['articleimage'].value;

        if(newImage == ''){
            imageInput = document.forms['parsley-examples']['previousArticleImage'].value;
        }else{
            imageInput = newImage;
        }
    }else{
        var imageInput = document.forms['parsley-examples']['articleimage'].value;
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

    if(articleseditor == ''){
      $('#editorError').empty().append(' <p style="color: #f1556c;margin-bottom: 10px;"><i class="mdi mdi-close-circle"></i> Description field is required.</p>')
         event.preventDefault();
    }else{
        $('#editorError').empty();  
    }
}


function changeArticlesEditor(element){
//     var textarea2 = document.getElementById("textarea2"),
//     event = new Event('change');
//   textarea2.value = element.value;
//   textarea2.dispatchEvent(event);
   console.log(element.value);
}
// $('#editorError').on('change',function(){
//    console.log('asdasd');

//    if($(this).val() != ''){
//       $('#editorError').empty();
//    }
// });

function check(element) {
   
  };