$(document).ready(function(){
   $('#attributes').children().first().children().last().children().last().hide();

   //REmove Add Attributes if it has already one attributes
  var tableLength = $('#attributes_table .tr').length;
  if(tableLength > 0){
    $('#add_product_attributes').css('display','none');
  }else{
    $('#add_product_attributes').css('display','block');
  }
  console.log(tableLength);

});


function addAttributes(){
    var s = $(event.currentTarget).parent().children().last().show();
    var a = $(event.currentTarget).parent().parent().clone();

    var row = '<div class="row" style="font-size: 13px;background: #f7f7f7;padding: 18px 0px 3px 20px;border-radius: 4px;margin-bottom: 20px;border: 1px solid #e7e7e7;"><div class="col-lg-1"><div class="form-group"><label for="inputEmail3" class="form-label" style="margin-bottom: 16px;">S.N</label><br><span style="background-color: #9aace7; padding: 3px 8px;color: white;border-radius: 5px;">1</span></div></div><div class="col-lg-1"><div class="form-group"><label for="inputEmail3" class="form-label">SKU Name<span class="text-danger">*</span></label><input type="text" name="sku[]" parsley-type="text" class="form-control"  placeholder="sku"  required></div></div><div class="col-lg-1"><div class="form-group"><label for="inputEmail3" class="form-label">Size<span class="text-danger">*</span></label><select name="size[]" class="form-control" data-style="btn-light" style="border: 1px solid lightgrey;"><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option><option value="XXXL">XXXL</option></select></div></div><div class="col-lg-1"><div class="form-group"><label for="inputEmail3" class="form-label">Color<span class="text-danger">*</span></label><input type="text" name="color[]"  parsley-type="text" class="form-control"  placeholder="" autocomplete="off" required></div></div><div class="col-lg-1"><div class="form-group "><label for="inputEmail3" class="form-label">Price<span class="text-danger">*</span></label><input type="text" name="price[]"  parsley-type="text" class="form-control"  placeholder="Rs. xxx"  autocomplete="off" required></div></div><div class="col-lg-1"><div class="form-group"><label for="inputEmail3" class="form-label">Stock<span class="text-danger">*</span></label><input type="text" name="stock[]"  parsley-type="text" class="form-control"  placeholder="0" autocomplete="off" required></div></div><div class="col-lg-2"><div class="form-group"><label for="inputEmail3" class="form-label">Images<span class="text-danger">*</span></label><input type="file" name="images1[]"  parsley-type="text" class=""  placeholder="Enter a stock" autocomplete="off" style="padding-top: 5px;" required multiple></div></div><div style="display:none !important;"><select name="status[]" class="selectpicker show-tick" data-style="btn-light" style="border: 1px solid lightgrey;"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div><div class="col-lg-2" style="padding-top: 28px;padding-left: 10px;"><button type="button" class="btn btn-success btn-rounded waves-light" style="font-size: 13px;padding: 7px 20px;background-color: #07ddb2;border-color: #36d7b7;" onclick="addAttributes()">Add</button>&nbsp;&nbsp;<button type="button" class="btn btn-danger btn-rounded  waves-light" style="font-size: 13px;padding: 7px 20px;" onclick="removeAttributes()">Remove</button></div></div>';

$('#attributes').append(row);

var count = $('#attributes').children('.row').length;

//Addming S.N
$('#attributes').children().last().children().first().children().children().last().html(count);

var name = 'images'+ parseInt(count-1);
console.log(name);

var a = $('#attributes').children().last().children().eq(6).children().children().last().attr('name',name);
console.log(a);

//Adding Remove Button
var asd = $(event.currentTarget).parent().children().first().remove();

}





function removeAttributes(){
    var a = $(event.currentTarget).parent().parent();
 

    //if last child
    if($(a).is(':last-child')){
       var asd =  $(event.currentTarget).parent().html();
        $(event.currentTarget).parent().parent().prev().children().last().html(asd);
        $(event.currentTarget).parent().parent().remove();


           //if lngth is 1 then removing remove button
        var length = $('#attributes').children().length;
        if(length == 1){
            $('#attributes').children().first().children().last().children().last().hide();
          }
        // console.log(a);
    }else{
       $(event.currentTarget).parent().parent().remove();

       var children = $('#attributes').children();
       var length = $('#attributes').children().length;

       var i = 1;
       $("#attributes .row").each(function() {
        $(this).children().first().children().children().last().html(i);
        i++;
    });

    //if lngth is 1 then removing remove button
    if(length == 1){
      $('#attributes').children().first().children().last().children().last().hide();
    }

    }

 

    // // ($('#b').is(":last-child"))
    // if('#attributes:last-child' == a){
    //     console.log(1);
    // }
 

 
   }



