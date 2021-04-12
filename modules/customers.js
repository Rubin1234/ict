var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/kitabharu?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var  customerSchema = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        default: null,
    },
    phone_number:{
        type: String,
        default: null,
    },
    password:{
        type: String,
        default: null,
    },
    
    slug:{
        type: String,
        default: null,
    },

    status: {
        type: String,
        default:'Active',
      },
});
customerSchema.plugin(timestamps);

var customerModel = mongoose.model('customers', customerSchema);
module.exports = customerModel;