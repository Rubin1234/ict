var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var Schema = mongoose.Schema; 

var  wishlistSchema = new Schema({
    products: [],
    customer_id:{
        type: String,
        default: null,
    },
    status: {
        type: String,
        default:'Active',
      },
});
wishlistSchema.plugin(timestamps);

var wishlistModel = mongoose.model('wishlist', wishlistSchema);
module.exports = wishlistModel;