var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const { NotImplemented } = require('http-errors');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/kitabharu?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var productFlashSaleSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    flashsale_product_price:{
        type: String,
       required: true,
    },
    flashsale_start_date:{
        type: String,
       required: true,
    },
    flashsale_start_time:{
        type: String,
       required: true,
    }, 
    flashsale_end_date:{
        type: String,
       required: true,
    }, 
    flashsale_end_time:{
        type: String,
       required: true,
    }, 

    status: {
        type: String,
        default:'Active',
      },
});
productFlashSaleSchema.plugin(timestamps);

var productFlashSaleModel = mongoose.model('flash_sales', productFlashSaleSchema);
module.exports = productFlashSaleModel;