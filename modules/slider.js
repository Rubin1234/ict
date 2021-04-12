var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/kitabharu?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var  sliderSchema = new Schema({
    title: {
        type: String,
        default: null
    },
    image: {
        type: String,
    },
    description:{
        type: String,
        default: null
    },
    slug:{
        type: String,
        default: null
    },
    status:{
        type: String,
    },
 
});


sliderSchema.plugin(timestamps);
var sliderModel = mongoose.model('sliders', sliderSchema);

module.exports = sliderModel;