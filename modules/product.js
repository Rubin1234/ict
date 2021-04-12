var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const { NotImplemented } = require('http-errors');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/kitabharu?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var productSchema = new Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
    },
    
    subcategory_id:{
        type: Schema.Types.ObjectId,
        ref: 'subcategories',
    },

    book_type:{
        type: String,
       default: null,
    },

    ebook_id:{
        type: Schema.Types.ObjectId,
        ref: 'ebook',
    },

    product_name:{
        type: String,
       required: true,
    },

    product_price:{
        type: String,
       required: true,
    },

    discount_percent:{
        type: String,
        default : 0
    },

    product_stock:{
        type: String,
       required: true,
    },

    product_image:{
        type:String,
        default: null,
     },

    product_description:{
        type: String,
        default: null,
    },
    
    slug:{
        type: String,
        default: null,
    },

    images:[{type:Schema.Types.ObjectId, ref:'product_images'}],
  
    book_attribute :[{type:Schema.Types.ObjectId, ref:'bookattributes'}],

    stationary_attribute :[{type:Schema.Types.ObjectId, ref:'stationaryattributes'}],

    flash_sale:{type:Schema.Types.ObjectId, ref:'flash_sales'},

    special_offer:{type:Schema.Types.ObjectId, ref:'special_offer'},

    bulk_offer:{type:Schema.Types.ObjectId, ref:'bulk_offer'},

    status: {
        type: String,
        default:'Active',
      },
});

productSchema.plugin(timestamps);

var productModel = mongoose.model('product', productSchema);
module.exports = productModel;