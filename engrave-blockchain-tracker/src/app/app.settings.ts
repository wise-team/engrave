const bodyParser = require("body-parser");

function settings(app: any) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
}

export default settings;