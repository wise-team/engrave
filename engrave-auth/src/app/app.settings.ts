const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

import * as express from 'express';

function settings(app: any) {
    app.use(session({ store: new RedisStore({ host: 'redis', port: 6379 }), secret: 'wobkvDgD6fe1zY9VaKTe5s7K8hamVojeoKiK0ais', saveUninitialized: true, resave: false }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static('/app/src/public')); // for sslo purposes
    mongoose.connect("mongodb://mongo:27017/engrave", { useNewUrlParser: true });
}

export default settings;