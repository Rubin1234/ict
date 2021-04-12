var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
// const PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');

// var server = require('http').createServer(app);


// const Emitter = require('events')

app.use(cors());

// //Event Emitter
// const eventEmitter = new Emitter()
// app.set('eventEmitter',eventEmitter)


//For Flash Message
var MemoryStore = require('memorystore')(session)
mongoose.connect('mongodb+srv://smart123123:smart123123@cluster0.xyi6x.mongodb.net/kitabharu?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});

// app.use(session({
//   secret: 'secret123',
//   saveUninitialized: true,
//   resave: false,
// }));

app.use(session({
  secret: 'secret123',
  saveUninitialized: true,
  store : new MemoryStore({mongooseConnection : mongoose.connection,
  checkPeriod: 86400000}),
  resave: false,
  
})); 


var flash = require('express-flash');
app.use(flash());


app.set('views', [path.join(__dirname, 'views'),
                  path.join(__dirname, 'views/backend/')]);


app.set('view engine', 'ejs');


// --> 11)  Mount the body-parser middleware  here
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));



var loginRouter = require('./routes/admin/login');
var usersRouter = require('./routes/admin/users');
var registerRouter = require('./routes/admin/register');
var dashboardRouter = require('./routes/admin/dashboard');
var adminRouter = require('./routes/admin/manageadmin/admin');
var roleRouter = require('./routes/admin/manageadmin/role');
var categoriesRouter = require('./routes/admin/categories/categories');
var subcategoriesRouter = require('./routes/admin/categories/subcategories');
var productRouter = require('./routes/admin/products/product');
var brandRouter = require('./routes/admin/brands/brand');
var articlesRouter = require('./routes/admin/articles/articles');
var myvideosRouter = require('./routes/admin/videos/videos');
var settingRouter = require('./routes/admin/setting/setting')
var publicationsRouter = require('./routes/admin/publication/publication')
var ordersRouter = require('./routes/admin/orders/orders')
var sliderRouter = require('./routes/admin/slider/slider');
var magazineRouter = require('./routes/admin/magazine/magazine');


//Frontend
var homeRouter = require('./routes/frontend/home');
var bookRouter = require('./routes/frontend/books');
var stationaryRouter = require('./routes/frontend/stationary');
var ebookRouter = require('./routes/frontend/ebooks');
var articleRouter = require('./routes/frontend/articles');
var blogRouter = require('./routes/frontend/blogs');
var publicationRouter = require('./routes/frontend/publications');
var videosRouter = require('./routes/frontend/videos');
var contactusRouter = require('./routes/frontend/contactus');
var bookdetailsRouter = require('./routes/frontend/bookdetails');
var stationarydetailsRouter = require('./routes/frontend/stationarydetails');
var articledetailsRouter = require('./routes/frontend/articledetails');
var customerLoginRouter = require('./routes/frontend/login');
var cartRouter = require('./routes/frontend/cart');
var wishlistRouter = require('./routes/frontend/wishlists');
var payment = require('./routes/frontend/payment');
var order = require('./routes/frontend/order');



//API
var homeApiRouter = require('./routes/api/home');
var signUpApiRouter = require('./routes/api/signup');
var loginApiRouter = require('./routes/api/login');
var productApiRouter = require('./routes/api/product')
var cartApiRouter = require('./routes/api/cart')
var paymentApiRouter = require('./routes/api/payment')
var bookingApiRouter = require('./routes/api/booking')
var userProfileApiRouter = require('./routes/api/userProfile')

//ICT APi
var ictCartApiRouter = require('./routes/api/ict/cart')

// view engine setup



app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ type: 'application/*+json' }))




app.use('/users', usersRouter);
app.use('/', loginRouter);
app.use('/register', registerRouter);
app.use('/', dashboardRouter);
app.use('/admin', adminRouter);
app.use('/admintype', roleRouter);
app.use('/categories', categoriesRouter);
app.use('/subcategories', subcategoriesRouter);
app.use('/product', productRouter);
app.use('/brand', brandRouter);
app.use('/articles',articlesRouter);
app.use('/myvideos',myvideosRouter);
app.use('/settings',settingRouter);
app.use('/publication',publicationsRouter);
app.use('/order',ordersRouter);
app.use('/slider',sliderRouter)
app.use('/magazine', magazineRouter);



// frontend
app.use('/', homeRouter);
app.use('/books', bookRouter);
app.use('/stationary', stationaryRouter);
app.use('/ebooks', ebookRouter);
app.use('/articles', articleRouter);
app.use('/blogs', blogRouter);
app.use('/publications', publicationRouter);
app.use('/videos', videosRouter);
app.use('/contactus', contactusRouter);
app.use('/', bookdetailsRouter);
app.use('/stationarydetails', stationarydetailsRouter);
app.use('/articledetails', articledetailsRouter);
app.use('/customer', customerLoginRouter);
app.use('/cart', cartRouter);
app.use('/wishlists',wishlistRouter);
app.use('/payment',payment);
app.use('/orders',order);


// cartRouter

//API
app.use('/api', homeApiRouter);
app.use('/api', signUpApiRouter);
app.use('/api', loginApiRouter);
app.use('/api', productApiRouter);
app.use('/api', cartApiRouter);
app.use('/api', bookingApiRouter);
app.use('/api', userProfileApiRouter);
app.use('/api/payment',paymentApiRouter);

//ICT APi
app.use('/ict/api', ictCartApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



//Emitter


// const server = app.listen(PORT , () => {
//   console.log('listening on port 3000');
// })

//Socket
// const io = require('socket.io')(server)

// io.on('connection', (socket) => {
//     // Join 

//     socket.on('join',(roomName) => {
     
//         socket.join(roomName)
//     })
// })



module.exports = app;
