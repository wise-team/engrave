const mongoose = require('mongoose');
const bodyParser = require("body-parser");

function settings(app: any) {
    mongoose.connect("mongodb://mongo:27017/engrave", { useNewUrlParser: true });
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
}

export default settings;