require('dotenv').config();
let CronJob = require('cron').CronJob;
let path = require("path");
const dynamicStatic = require('express-dynamic-static')(); // immediate initialization

var mongoose = require('mongoose');
let cfg = require('./config');
mongoose.connection.on('error', function (err) { console.log(err) });
mongoose.connect(cfg.get_config().database_url);

cfg.refresh_config(function() {
    let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let expressSanitized = require('express-sanitize-escape');

let steem = require("steem");
let moment = require("moment");

let featured_posts = require('./modules/featured.js');
let reward_tools = require('./modules/reward-tools');
let authors = require('./modules/authors');
let sitemap = require('./modules/sitemap');
let articles = require('./modules/articles');

let lang = require('./translation');

var fs = require('fs');

console.log("Launched on " + moment().format("LLLL"));
console.log(cfg.get_config());

let app = express();


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

app.use(session({
    secret: makeid(),
    saveUninitialized: true,
    resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

lang.initialize(cfg.get_config().frontpage_language);

function refresh_shared_config() {
    app.use((req, res, next) => {
        res.locals.config = cfg.get_config();
        lang.initialize(res.locals.config.frontpage_language);
        moment.locale(res.locals.config.frontpage_language);
        res.locals.translation = lang.get_translation();
        next();
    });
}

refresh_shared_config();

cfg.init_refreshing();


new CronJob('* * * * *', function () { refresh_shared_config() }, null, true, 'America/Los_Angeles');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitized.middleware());
app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '..', 'instances', cfg.get_config().domain, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
app.use(dynamicStatic);

dynamicStatic.setPath(path.join(__dirname, '/views/main/' + cfg.get_config().theme + '/public'));

let index = require('./routes/index');
let authorize = require('./routes/authorize');
let action = require('./routes/action');
let dashboard = require('./routes/dashboard');

app.use('/authorize', authorize);
app.use('/action', action);
app.use('/dashboard', dashboard);
app.use('/', index);
app.use('/logout', authorize);

app.locals.moment = require('moment');

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
    res.render('main/' + cfg.get_config().theme + '/theme/error', {categories: cfg.get_config().categories});
});

let debug = require('debug')('boilerplate:server');


/**
 * Create HTTP server.
 */
var http = require('http');
let server = http.createServer(app).listen(parseInt(cfg.get_config().port));
let port = normalizePort(cfg.get_config().port);
app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);

featured_posts.initialize();
reward_tools.initialize();
authors.initialize();
sitemap.initialize();
articles.initialize();

/**
 * Normalize a port into a number, string, or false.
 */

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

/**
 * Event listener for HTTP server "error" event.
 */

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

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

});

