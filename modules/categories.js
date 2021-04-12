var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/kitabharu?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var  categorySchema = new Schema({
    category_name: {
        type: String,
        required: true,
    },
    category_image:{
        type: String,
        default: null,
    },
    category_icon:{
        type: String,
        default: null,
    },

    subcategories:[{type:Schema.Types.ObjectId, ref:'subcategories'}],
    
    slug:{
        type: String,
        default: null,
    },
    status: {
        type: String,
        default:'Active',
      },
});
categorySchema.plugin(timestamps);

var categoryModel = mongoose.model('categories', categorySchema);
module.exports = categoryModel;