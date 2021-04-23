var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var videosSchema = new Schema({
    video_title: {
        type: String,
        default: null,
    },
    youtube_link:{
        type: String,
    },
    slug:{
        type: String,
    },
    status:{
        type: String,
    },
 
});


videosSchema.plugin(timestamps);
var videosModel = mongoose.model('videos', videosSchema);

module.exports = videosModel;