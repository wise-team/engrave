const bodyParser = require("body-parser");
const mongoose = require('mongoose');
let session = require('express-session');
import * as express from 'express';

function settings(app: any) {
    app.use(session({ secret: 'asdasdasdasdasdsad', saveUninitialized: true, resave: false }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static('/app/src/public')); // for sslo purposes
    mongoose.connect("mongodb://mongo:27017/engrave", { useNewUrlParser: true });
}

export default settings;