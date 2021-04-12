var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const { NotImplemented } = require('http-errors');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var stationaryAttributesSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    product_code:{
        type: String,
       required: true,
    },
    manufacturer_name:{
        type: String,
        default: null,
    },
    status: {
        type: String,
        default:'Active',
      },
});

stationaryAttributesSchema.plugin(timestamps);

var stationaryAttributesModel = mongoose.model('stationaryattributes', stationaryAttributesSchema);
module.exports = stationaryAttributesModel;