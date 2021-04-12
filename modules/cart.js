var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/kitabharu?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var  cartSchema = new Schema({
    products: [       
    ],
         

    customer_id:{
        type: String,
        default: null,
    },

    status: {
        type: String,
        default:'Active',
      },
});
cartSchema.plugin(timestamps);

var cartModel = mongoose.model('cart', cartSchema);
module.exports = cartModel;