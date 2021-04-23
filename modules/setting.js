var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var Schema = mongoose.Schema; 

var  settingSchema = new Schema({
    delivery_charge : {
        type: String,
        default: 0,
    },
    service_charge : {
        type: String,
        default: 0,
    },
    tax_charge : {
        type: String,
        default: 0,
    },
    location: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    contact:{
        type: String,
        default: null,
    },
    office_reg_no:{
        type: String,
        default: null,
    },
    google_map_link:{
        type: String,
        default: null,
    },
    facebook_link:{
        type: String,
        default: null,
    },
    twitter_link:{
        type: String,
        default: null,
    },
    youtube_link:{
        type: String,
        default: null,
    },
    instagram_link:{
        type: String,
        default: null,
    },
    linkedIn_link:{
        type: String,
        default: null,
    },

});


settingSchema.plugin(timestamps);
var settingModel = mongoose.model('setting', settingSchema);

module.exports = settingModel;