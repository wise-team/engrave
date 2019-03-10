import * as express from "express";
import ping from "./routes/ping";

const healthApi: express.Router = express.Router();

healthApi.get('/ping', ping.middleware, ping.handler);

export default healthApi;