var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/ict?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
var conn = mongoose.connection;
var Schema = mongoose.Schema; 

var  articlesSchema = new Schema({
    article_title: {
        type: String,
        required: true,
    },
    article_date: {
        type: String,
        required: true,
    },
    article_image:{
        type: String,
    },
    article_description:{
        type: String,
    },
    slug:{
        type: String,
    },
    status:{
        type: String,
    },
 
});


articlesSchema.plugin(timestamps);
var articleModel = mongoose.model('articles', articlesSchema);

module.exports = articleModel;