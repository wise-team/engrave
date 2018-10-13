require('dotenv').config();

import * as express from 'express';
import { Config } from './config'
import { StatisticsModule } from './modules/Statistics';
import { SchedulerModule } from './modules/Scheduler';
import { SSLModule } from './modules/SSL';
import { BlogListModule } from './modules/BlogList';

let config = Config.GetConfig();

let path = require('path');
// let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let expressSanitized = require('express-sanitize-escape');
var mongoose = require('mongoose');
let moment = require("moment");

console.log("Launched on " + moment().format("LLLL"));

let app = express();

app.use(session({
    secret: config.session_secret,
    saveUninitialized: true,
    resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, "..", 'views'));
app.set('view engine', 'pug');

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.locals.config = config;
    next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitized.middleware());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", 'public')));

app.use('/authorize', require('./routes/authorize/logout'));
app.use('/authorize', require('./routes/authorize/tier'));
app.use('/authorize', require('./routes/authorize/main'));

app.use('/dashboard', require('./routes/dashboard/configure'));
app.use('/dashboard', require('./routes/dashboard/main'));
app.use('/dashboard', require('./routes/dashboard/notifications'));
app.use('/dashboard', require('./routes/dashboard/posts'));
app.use('/dashboard', require('./routes/dashboard/profile'));
app.use('/dashboard', require('./routes/dashboard/settings'));
app.use('/dashboard', require('./routes/dashboard/statistics'));
app.use('/dashboard', require('./routes/dashboard/upgrade'));
app.use('/dashboard', require('./routes/dashboard/wallet'));
app.use('/dashboard', require('./routes/dashboard/write'));
app.use('/dashboard', require('./routes/dashboard/main'));

app.use('/', require('./routes/frontpage/about'));
app.use('/', require('./routes/frontpage/configure'));
app.use('/', require('./routes/frontpage/create'));
app.use('/', require('./routes/frontpage/how-to-earn'));
app.use('/', require('./routes/frontpage/main'));

app.locals.moment = require('moment');

mongoose.connection.on('error', function (err: Error) { console.log(err) });
mongoose.connect(
    config.database_url,
    {
        useNewUrlParser: true
    });

console.log(config);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    (<any>err).status = 404;
    next(err);
});

// error handler
app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status((<any>err).status || 500);
    res.render('main/error');
});

let sslModuleInstance = new SSLModule(); // constructor creates CronJob
let schedulerModuleInstance = new SchedulerModule(); // constructor creates CronJob
let statisticsModuleInstance = new StatisticsModule(); // constructor creates CronJob

/**
 * Create HTTP server.
 */
var http = require('http');
let server = http.createServer(app).listen(parseInt(config.port));
let port = normalizePort(config.port);
app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: string) {
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

function onError(error: Error) {
    if ((<any>error).syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch ((<any>error).code) {
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