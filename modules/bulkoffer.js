var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const { NotImplemented } = require('http-errors');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var bulkOfferSchema = new Schema({
    
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    minimum_product:{
        type: String,
       required: true,
    },
    bulkDiscountPercent:{
        type: String,
       required: true,
    },

    status: {
        type: String,
        default:'Active',
      },
});

bulkOfferSchema.plugin(timestamps);

var bulkOfferModel = mongoose.model('bulk_offer', bulkOfferSchema);
module.exports = bulkOfferModel;