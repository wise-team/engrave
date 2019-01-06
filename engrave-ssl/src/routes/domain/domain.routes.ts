import * as express from "express";
import validate from "./routes/validate";

const healthApi: express.Router = express.Router();

healthApi.post('/validate', validate.middleware, validate.handler);

export default healthApi;