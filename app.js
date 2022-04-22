const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));

const accessToken = process.env.ACCESS_TOKEN || 'provide the access token';

app.use(bearerToken());
app.use(function (req, res, next) {

    console.log('token', req.token);
    console.log('env token', accessToken);

    if(accessToken !== req.token){
        res.status(401);
        res.send({
            'error_description': 'Access Denied. Please contact your system administrator.'
        });
    } else {
        next();
    }

});

app.use(function (req, res, next) {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Cache-Control', 'no-cache');
    next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

app.disable('x-powered-by');

module.exports = app;
