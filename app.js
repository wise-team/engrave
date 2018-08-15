require('dotenv').config();
let config = require('./config');
var fs = require('fs');
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let expressSanitized = require('express-sanitize-escape');
var mongoose = require('mongoose');
let steem = require("steem");
let moment = require("moment");
var pm2 = require('pm2');
var scheduler = require('./modules/scheduler.js');
var statistics = require('./modules/statistics.js');

console.log("Launched on " + moment().format("LLLL"));
console.log(config);

let app = express();

app.use(session({
    secret: config.session_secret,
    saveUninitialized: true,
    resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    res.locals.config = config;
    next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitized.middleware());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let main = require('./routes/main');
let authorize = require('./routes/authorize');
let dashboard = require('./routes/dashboard');

// app.use('/dashboard', dashboard);
app.use('/authorize', authorize);
app.use('/dashboard', dashboard);
app.use('/', main);

app.locals.moment = require('moment');

mongoose.connection.on('error', function (err) { console.log(err) });
mongoose.connect(config.database_url);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('main/error', { categories: config.categories });
});

scheduler.initialize();
statistics.initialize();

/**
 * Create HTTP server.
 */
var http = require('http');
let server = http.createServer(app).listen(parseInt(config.port));
let port = normalizePort(config.port);
app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}