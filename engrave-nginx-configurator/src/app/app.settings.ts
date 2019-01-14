const bodyParser = require("body-parser");
const mongoose = require('mongoose');

function settings(app: any) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    mongoose.connect("mongodb://mongo:27017/engrave", { useNewUrlParser: true });
}

export default settings;