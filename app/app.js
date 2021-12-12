//imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//mysql db connection pool details
const pool = createPool(
  {
    host: "database-1.cwo8qpqj2avt.us-east-2.rds.amazonaws.com",
    user: "wishup",
    password: "1stAssignment@wishup",
    database: "WISHUP",
    connectionLimit: 10
  }
);

//routers
//user router
const userRouter = require('./routes/user');
app.use('/user', userRouter);

//subscription router
const subscriptionRouter = require('./routes/subscription');
app.use('/subscription', subscriptionRouter);


//START SERVER
const port = 8088;
app.listen(port, () => console.log(`WISHUP SUBCRIPTION SERVICE IS ACTIVE AND RUNNING AT PORT ${port}`));

//TEST API
app.get('/hello', (req, res) => { console.log("hello"); res.json("hello") });


module.exports = app;
module.exports = pool;

