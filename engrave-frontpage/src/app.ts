import * as express from 'express';

let path = require('path');
let moment = require("moment");
var bodyParser = require('body-parser')
let app = express();

app.use(bodyParser());

// view engine setup
app.set('views', path.join(__dirname, "..", 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, "..", 'public')));

app.use('/', require('./routes/frontpage/about'));
app.use('/', require('./routes/frontpage/create'));
app.use('/', require('./routes/frontpage/explore'));
app.use('/', require('./routes/frontpage/main'));

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
    res.locals.error = err;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status((<any>err).status || 500);
    res.render(`main/${process.env.FRONT}/error`);
});

/**
 * Create HTTP server.
 */
var http = require('http');
let server = http.createServer(app).listen(80);

app.set('port', 80);

console.log("Launched on " + moment().format("LLLL"));

export default app;
export { server };