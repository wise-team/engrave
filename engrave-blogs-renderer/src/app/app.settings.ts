const bodyParser = require("body-parser");
const mongoose = require('mongoose');
import * as express from 'express';
const dynamicStatic = require('express-dynamic-static')();

function settings(app: any) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static('/app/certbot')); // for letsencrypt purposes
    app.set('view engine', 'pug');
    app.set('views', '/app/src/themes');
    app.use(dynamicStatic);
    mongoose.connect("mongodb://mongo:27017/engrave", { useNewUrlParser: true });
}

export default settings;