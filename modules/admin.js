var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var  adminSchema = new Schema({

    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    address: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    email: {
        type: String,
        unique:true,
        required:true,
        index:{
            unique:true,
        }
    },
    image:{
        type: String,
    },
    password: {
        type: String,
        required:true,
    },
    admin_type:{type: Schema.Types.ObjectId, ref: 'admin_types'},
    publication : {type: String, default:null},
    status: {
        type: String,
        default:'Active',
  
      },
});


adminSchema.plugin(timestamps);
var userModel = mongoose.model('admins', adminSchema);

module.exports = userModel;