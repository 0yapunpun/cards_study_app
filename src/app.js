let express = require('express');
let path = require('path')
let app = express();
let createError = require('http-errors');
let cookieParser = require('cookie-parser');
const session = require('express-session');

let router = require('./router');

app.use(session({secret: 'any_any', saveUninitialized: true, resave: true}));

// view engine setup
app.set('views', [path.join(__dirname, 'views')]);
app.set('view engine', 'ejs');

let allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-generaled-With, Origin, Accept, x-xsrf-token, X-XSRF-TOKEN, Cache-Control, Pragma');

  if ('OPTIONS' === req.method) {
      res.send(200);
  } else {
      next();
  }
};

//middlewares
app.use((req, res, next) => {
  next();
});

app.use(allowCrossDomain);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({success: false, message: 'Error procesing request'});
});

module.exports = app;