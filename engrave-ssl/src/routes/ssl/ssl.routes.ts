import * as express from "express";
import validate from "./routes/validate";
import generate from "./routes/generate";

const healthApi: express.Router = express.Router();

healthApi.get('/validate', validate.middleware, validate.handler);
healthApi.get('/generate', generate.middleware, generate.handler);

export default healthApi;