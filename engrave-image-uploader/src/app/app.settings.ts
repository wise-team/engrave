const bodyParser = require("body-parser");

function settings(app: any) {
    app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    app.use(bodyParser.json({limit: '5mb', extended: true}));
}

export default settings;