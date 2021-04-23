var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var Schema = mongoose.Schema; 

var  orderSchema = new Schema({
        orderId : {
            type: String,
            required: true
        },
        customerId : {
            type :Schema.Types.ObjectId,
            ref:'customers'
        },
        fullName : {
            type: String,
            required: true
        },
        phoneNumber : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true,
        },
        streetAddress : {
            type : String,
            require : true
        },
        products : [],
        paymentType : {
            type: String, 
            default: 'COD'
        },
        totalAmount : {
            type: String, 
            required:true
        },
        status : {
            type:String, 
            default:'order_placed'
        },
        payment : {
            type: String,
            default:'false'
        },
        ordered_from : {
            type: String,
            required:true
        }
        

});
orderSchema.plugin(timestamps);

var orderModel = mongoose.model('orders', orderSchema);
module.exports = orderModel;