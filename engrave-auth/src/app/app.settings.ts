const bodyParser = require("body-parser");
const mongoose = require('mongoose');
let session = require('express-session');

function settings(app: any) {
    app.use(session({ secret: 'asdasdasdasdasdsad', saveUninitialized: true, resave: false }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    mongoose.connect("mongodb://mongo:27017/engrave", { useNewUrlParser: true });
}

export default settings;