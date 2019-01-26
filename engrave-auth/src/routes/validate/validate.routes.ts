import * as express from "express";
import validate from "./routes/validate";

const healthApi: express.Router = express.Router();

healthApi.get('/', validate.middleware, validate.handler);

export default healthApi;