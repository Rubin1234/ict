var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/kitabharu?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var  adminTypeSchema = new Schema({
    admin_type: {
        type: String,
        required: true,
        index:{
            unique:true,
        }
    },
    status: {
      type: String,
      default:'Active',

    },
    admins:[{type:Schema.Types.ObjectId, ref:'admins'}],

});

adminTypeSchema.plugin(timestamps);

var adminTypeModel = mongoose.model('admin_types', adminTypeSchema);

module.exports = adminTypeModel;