var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const { NotImplemented } = require('http-errors');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var reviewSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'customers',
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    product_slug: {
        type: String,
        required: false,
    },
    comment:{
        type: String,
       required: false,
    },
    rating_star:{
        type: String,
       required: true,
    },
    status: {
        type: String,
        default:'Active',
      },
});

reviewSchema.plugin(timestamps);

var reviewModel = mongoose.model('review', reviewSchema);
module.exports = reviewModel;