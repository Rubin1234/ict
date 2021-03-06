var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const { NotImplemented } = require('http-errors');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var Schema = mongoose.Schema; 

var specialOfferSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },
    specialoffer_percent:{
        type: String,
       required: true,
    },
    specialoffer_start_date:{
        type: String,
       required: true,
    },
    specialoffer_end_date:{
        type: String,
       required: true,
    }, 
    specialoffer_image:{
        type: String,
        default: null,
    }, 
    status: {
        type: String,
        default:'Active',
      },
});

specialOfferSchema.plugin(timestamps);

var specialOfferModel = mongoose.model('special_offer', specialOfferSchema);
module.exports = specialOfferModel;