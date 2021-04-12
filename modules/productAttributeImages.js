var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const { NotImplemented } = require('http-errors');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var productAttributeImagesSchema = new Schema({

    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    productAttribute_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    productAttributeImage:{
        type: String,
       required: true,
    },   
    status: {
        type: String,
        default:'Active',
      },
});
productAttributeImagesSchema.plugin(timestamps);

var productAttributeImagesModel = mongoose.model('product_attribute_images', productAttributeImagesSchema);
module.exports = productAttributeImagesModel;