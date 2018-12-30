import verifyToken from "../middlewares/jwt/verifyToken";

const bodyParser = require("body-parser");

function settings(app: any) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(verifyToken);
}

export default settings;